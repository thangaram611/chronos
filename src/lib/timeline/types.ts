import type { Schedule, Context } from '@/lib/db';

/**
 * Timeline configuration
 */
export interface TimelineConfig {
  hourHeight: number;
  gutterWidth: number;
  minBlockHeight: number;
  snapInterval: number;
}

/**
 * Calculated position for a time block
 */
export interface BlockPosition {
  top: number;
  height: number;
  left: string;
  width: string;
  column: number;
  totalColumns: number;
}

/**
 * Group of overlapping blocks
 */
export interface OverlapGroup {
  blocks: Schedule[];
  columnCount: number;
  columnAssignments: Map<string, number>;
}

/**
 * Time range for overlap detection
 */
export interface TimeRange {
  id: string;
  start: number;
  end: number;
}

/**
 * Schedule with calculated position
 */
export interface PositionedSchedule extends Schedule {
  position: BlockPosition;
  context?: Context;
}

/**
 * Day bounds (start and end timestamps)
 */
export interface DayBounds {
  start: number;
  end: number;
}

/**
 * Validation result for time ranges
 */
export interface TimeValidationResult {
  isValid: boolean;
  errors: TimeValidationError[];
}

export interface TimeValidationError {
  type: 'invalid_range' | 'too_short' | 'overlap' | 'past_time' | 'locked_overlap';
  message: string;
  conflictingBlockId?: string;
}

/**
 * Time picker value
 */
export interface TimePickerValue {
  hours: number; // 0-23
  minutes: number; // 0-59
}

/**
 * Block action types
 */
export type BlockAction = 'complete' | 'edit' | 'delete' | 'reschedule';

/**
 * Timeline scroll state
 */
export interface ScrollState {
  scrollTop: number;
  containerHeight: number;
  isScrolling: boolean;
}

/**
 * Formatted time display
 */
export interface FormattedTime {
  time: string; // "9:30 AM"
  compact: string; // "9:30a"
  hours: string; // "9"
  minutes: string; // "30"
  period: 'AM' | 'PM';
}

/**
 * Day selector item
 */
export interface DaySelectorDay {
  date: Date;
  dayOfWeek: string; // "Mon", "Tue", etc.
  dayOfMonth: number;
  isToday: boolean;
  isSelected: boolean;
  hasSchedules: boolean;
}
