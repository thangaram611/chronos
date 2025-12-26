import { useMemo } from 'react';
import { startOfDay } from 'date-fns';
import type { Schedule } from '@/lib/db';
import {
  calculateBlockPosition,
  getOverlapGroups,
  type BlockPosition,
  type OverlapGroup,
} from '@/lib/timeline';

interface UseTimeBlockPositionOptions {
  schedule: Schedule;
  allSchedules: Schedule[];
  date: Date;
}

interface UseTimeBlockPositionReturn {
  position: BlockPosition;
  overlapGroup: OverlapGroup | null;
}

/**
 * Hook to calculate the position of a single time block
 */
export function useTimeBlockPosition(
  options: UseTimeBlockPositionOptions
): UseTimeBlockPositionReturn {
  const { schedule, allSchedules, date } = options;
  const dayStart = startOfDay(date).getTime();

  return useMemo(() => {
    // Get all overlap groups
    const overlapGroups = getOverlapGroups(allSchedules);

    // Find this schedule's group and column
    let column = 0;
    let totalColumns = 1;
    let overlapGroup: OverlapGroup | null = null;

    for (const group of overlapGroups) {
      const columnIndex = group.columnAssignments.get(schedule.id);
      if (columnIndex !== undefined) {
        column = columnIndex;
        totalColumns = group.columnCount;
        overlapGroup = group;
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

    return { position, overlapGroup };
  }, [schedule, allSchedules, dayStart]);
}

/**
 * Hook to calculate positions for all schedules in a day
 */
export function useAllBlockPositions(
  schedules: Schedule[],
  date: Date
): Map<string, BlockPosition> {
  const dayStart = startOfDay(date).getTime();

  return useMemo(() => {
    const positions = new Map<string, BlockPosition>();

    if (schedules.length === 0) {
      return positions;
    }

    // Get all overlap groups
    const overlapGroups = getOverlapGroups(schedules);

    // Calculate position for each schedule
    for (const schedule of schedules) {
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

      positions.set(schedule.id, position);
    }

    return positions;
  }, [schedules, dayStart]);
}

/**
 * Get inline styles for a time block position
 */
export function getBlockPositionStyles(position: BlockPosition): React.CSSProperties {
  return {
    position: 'absolute',
    top: `${position.top}px`,
    height: `${position.height}px`,
    left: position.left,
    width: position.width,
    minHeight: '44px', // Touch target minimum
  };
}
