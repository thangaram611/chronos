import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { startOfDay, endOfDay } from 'date-fns';
import { db, type Schedule, type Context } from '@/lib/db';
import {
  getOverlapGroups,
  calculateBlockPosition,
  type PositionedSchedule,
  type OverlapGroup,
} from '@/lib/timeline';

/**
 * Hook to fetch schedules for a specific day with live updates
 * @param date - The day to fetch schedules for
 * @returns Array of schedules for the day
 */
export function useDaySchedules(date: Date): Schedule[] | undefined {
  const dayStart = startOfDay(date).getTime();
  const dayEnd = endOfDay(date).getTime();

  return useLiveQuery(
    async () => {
      // Get schedules that start within this day
      // Also include schedules that span across this day
      const schedules = await db.schedules
        .filter((schedule) => {
          // Schedule overlaps with this day if:
          // - It starts before day ends AND ends after day starts
          return schedule.startTimestamp < dayEnd && schedule.endTimestamp > dayStart;
        })
        .sortBy('startTimestamp');

      return schedules;
    },
    [dayStart, dayEnd]
  );
}

/**
 * Hook to fetch schedules with their contexts
 * @param date - The day to fetch schedules for
 * @returns Object with schedules and contexts lookup
 */
export function useDaySchedulesWithContexts(date: Date): {
  schedules: Schedule[] | undefined;
  contexts: Map<string, Context>;
  isLoading: boolean;
} {
  const schedules = useDaySchedules(date);

  const contexts = useLiveQuery(async () => {
    const allContexts = await db.contexts.toArray();
    return new Map(allContexts.map((ctx) => [ctx.id, ctx]));
  }, []);

  return {
    schedules,
    contexts: contexts || new Map(),
    isLoading: schedules === undefined || contexts === undefined,
  };
}

/**
 * Hook to get positioned schedules with overlap handling
 * @param date - The day to fetch schedules for
 * @returns Positioned schedules ready for rendering
 */
export function usePositionedSchedules(date: Date): {
  positionedSchedules: PositionedSchedule[];
  overlapGroups: OverlapGroup[];
  isLoading: boolean;
} {
  const { schedules, contexts, isLoading } = useDaySchedulesWithContexts(date);
  const dayStart = startOfDay(date).getTime();

  const result = useMemo(() => {
    if (!schedules) {
      return { positionedSchedules: [], overlapGroups: [] };
    }

    // Calculate overlap groups
    const overlapGroups = getOverlapGroups(schedules);

    // Calculate positions for each schedule
    const positionedSchedules: PositionedSchedule[] = schedules.map((schedule) => {
      // Find which group this schedule belongs to
      let column = 0;
      let totalColumns = 1;

      for (const group of overlapGroups) {
        const columnIndex = group.columnAssignments.get(schedule.id);
        if (columnIndex !== undefined) {
          column = columnIndex;
          totalColumns = group.columnCount;
          break;
        }
      }

      const position = calculateBlockPosition(
        schedule.startTimestamp,
        schedule.endTimestamp,
        dayStart,
        column,
        totalColumns
      );

      return {
        ...schedule,
        position,
        context: schedule.contextId ? contexts.get(schedule.contextId) : undefined,
      };
    });

    return { positionedSchedules, overlapGroups };
  }, [schedules, contexts, dayStart]);

  return {
    ...result,
    isLoading,
  };
}

/**
 * Hook to check if a day has any schedules
 * @param date - The day to check
 * @returns true if the day has schedules
 */
export function useDayHasSchedules(date: Date): boolean {
  const schedules = useDaySchedules(date);
  return (schedules?.length ?? 0) > 0;
}
