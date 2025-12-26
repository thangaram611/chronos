import type { Schedule } from '@/lib/db';
import type { TimeRange, OverlapGroup } from './types';

/**
 * Check if two time ranges overlap
 * @param range1 - First time range
 * @param range2 - Second time range
 * @returns true if ranges overlap
 */
export function hasOverlap(range1: TimeRange, range2: TimeRange): boolean {
  // Ranges overlap if range1 starts before range2 ends AND range1 ends after range2 starts
  return range1.start < range2.end && range1.end > range2.start;
}

/**
 * Find all blocks that overlap with a given block
 * @param targetBlock - The block to check for overlaps
 * @param allBlocks - All blocks to check against
 * @returns Array of overlapping blocks (excluding the target)
 */
export function findOverlappingBlocks(
  targetBlock: TimeRange,
  allBlocks: TimeRange[]
): TimeRange[] {
  return allBlocks.filter(
    (block) => block.id !== targetBlock.id && hasOverlap(targetBlock, block)
  );
}

/**
 * Convert schedules to time ranges for overlap detection
 * @param schedules - Array of schedules
 * @returns Array of time ranges
 */
export function schedulesToTimeRanges(schedules: Schedule[]): TimeRange[] {
  return schedules.map((schedule) => ({
    id: schedule.id,
    start: schedule.startTimestamp,
    end: schedule.endTimestamp,
  }));
}

/**
 * Group overlapping blocks together
 * Uses a graph-based approach to find connected components
 * @param schedules - All schedules to group
 * @returns Array of overlap groups with column assignments
 */
export function getOverlapGroups(schedules: Schedule[]): OverlapGroup[] {
  if (schedules.length === 0) return [];

  // Sort by start time
  const sorted = [...schedules].sort(
    (a, b) => a.startTimestamp - b.startTimestamp
  );

  const groups: OverlapGroup[] = [];
  const visited = new Set<string>();

  for (const schedule of sorted) {
    if (visited.has(schedule.id)) continue;

    // Find all schedules in this overlap group using BFS
    const groupBlocks: Schedule[] = [];
    const queue: Schedule[] = [schedule];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current.id)) continue;

      visited.add(current.id);
      groupBlocks.push(current);

      // Find overlapping schedules
      for (const other of sorted) {
        if (visited.has(other.id)) continue;

        if (hasOverlap(
          { id: current.id, start: current.startTimestamp, end: current.endTimestamp },
          { id: other.id, start: other.startTimestamp, end: other.endTimestamp }
        )) {
          queue.push(other);
        }
      }
    }

    // Assign columns to blocks in this group
    const { columnCount, columnAssignments } = assignColumns(groupBlocks);

    groups.push({
      blocks: groupBlocks,
      columnCount,
      columnAssignments,
    });
  }

  return groups;
}

/**
 * Assign column indices to blocks in an overlap group
 * Uses a greedy algorithm similar to interval graph coloring
 * @param blocks - Blocks in the overlap group
 * @returns Column count and assignments map
 */
function assignColumns(
  blocks: Schedule[]
): { columnCount: number; columnAssignments: Map<string, number> } {
  if (blocks.length === 0) {
    return { columnCount: 0, columnAssignments: new Map() };
  }

  if (blocks.length === 1) {
    const assignments = new Map<string, number>();
    assignments.set(blocks[0].id, 0);
    return { columnCount: 1, columnAssignments: assignments };
  }

  // Sort by start time, then by end time (shorter blocks first)
  const sorted = [...blocks].sort((a, b) => {
    if (a.startTimestamp !== b.startTimestamp) {
      return a.startTimestamp - b.startTimestamp;
    }
    return a.endTimestamp - b.endTimestamp;
  });

  const columnAssignments = new Map<string, number>();
  const columnEndTimes: number[] = []; // End time of the block in each column

  for (const block of sorted) {
    // Find the first available column
    let assignedColumn = -1;

    for (let col = 0; col < columnEndTimes.length; col++) {
      // Column is available if the last block in it ended before this block starts
      if (columnEndTimes[col] <= block.startTimestamp) {
        assignedColumn = col;
        break;
      }
    }

    // If no column is available, create a new one
    if (assignedColumn === -1) {
      assignedColumn = columnEndTimes.length;
      columnEndTimes.push(0);
    }

    // Assign the block to this column
    columnAssignments.set(block.id, assignedColumn);
    columnEndTimes[assignedColumn] = block.endTimestamp;
  }

  return {
    columnCount: columnEndTimes.length,
    columnAssignments,
  };
}

/**
 * Check if a new time range would create an overlap with existing schedules
 * @param newStart - Start timestamp for new block
 * @param newEnd - End timestamp for new block
 * @param existingSchedules - Existing schedules to check against
 * @param excludeId - Optional ID to exclude from check (for editing)
 * @returns Array of conflicting schedule IDs
 */
export function checkForConflicts(
  newStart: number,
  newEnd: number,
  existingSchedules: Schedule[],
  excludeId?: string
): string[] {
  const newRange: TimeRange = { id: 'new', start: newStart, end: newEnd };

  return existingSchedules
    .filter((schedule) => {
      if (excludeId && schedule.id === excludeId) return false;

      return hasOverlap(newRange, {
        id: schedule.id,
        start: schedule.startTimestamp,
        end: schedule.endTimestamp,
      });
    })
    .map((schedule) => schedule.id);
}

/**
 * Check if a new time range would overlap with any LOCKED schedules
 * @param newStart - Start timestamp for new block
 * @param newEnd - End timestamp for new block
 * @param existingSchedules - Existing schedules to check against
 * @param excludeId - Optional ID to exclude from check (for editing)
 * @returns Array of conflicting LOCKED schedule IDs
 */
export function checkForLockedConflicts(
  newStart: number,
  newEnd: number,
  existingSchedules: Schedule[],
  excludeId?: string
): string[] {
  const newRange: TimeRange = { id: 'new', start: newStart, end: newEnd };

  return existingSchedules
    .filter((schedule) => {
      if (excludeId && schedule.id === excludeId) return false;
      if (!schedule.isLocked) return false; // Only check locked blocks

      return hasOverlap(newRange, {
        id: schedule.id,
        start: schedule.startTimestamp,
        end: schedule.endTimestamp,
      });
    })
    .map((schedule) => schedule.id);
}

/**
 * Get the column assignment for a specific schedule
 * @param scheduleId - ID of the schedule
 * @param groups - All overlap groups
 * @returns Column index and total columns, or defaults if not found
 */
export function getScheduleColumn(
  scheduleId: string,
  groups: OverlapGroup[]
): { column: number; totalColumns: number } {
  for (const group of groups) {
    const column = group.columnAssignments.get(scheduleId);
    if (column !== undefined) {
      return { column, totalColumns: group.columnCount };
    }
  }

  // Default: single column
  return { column: 0, totalColumns: 1 };
}
