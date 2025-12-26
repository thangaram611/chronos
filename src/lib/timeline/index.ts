// Constants
export * from './constants';

// Types
export type {
  TimelineConfig,
  BlockPosition,
  OverlapGroup,
  TimeRange,
  PositionedSchedule,
  DayBounds,
  TimeValidationResult,
  TimeValidationError,
  TimePickerValue,
  BlockAction,
  ScrollState,
  FormattedTime,
  DaySelectorDay,
} from './types';

// Time positioning utilities
export {
  timestampToYPosition,
  yPositionToTimestamp,
  getBlockHeight,
  getBlockTop,
  calculateBlockPosition,
  getDayBounds,
  snapToInterval,
  getCurrentTimeYPosition,
  getScrollPositionForTime,
} from './time-positioning';

// Overlap detection utilities
export {
  hasOverlap,
  findOverlappingBlocks,
  schedulesToTimeRanges,
  getOverlapGroups,
  checkForConflicts,
  checkForLockedConflicts,
  getScheduleColumn,
} from './overlap-detection';

// Time formatting utilities
export {
  formatHourLabel,
  getHourLabels,
  formatTime,
  formatTimeRange,
  formatDuration,
  formatDurationBetween,
  formatRelativeDay,
  formatDaySelectorDate,
  generateDaySelectorDays,
  formatCurrentTimeIndicator,
  isMajorHour,
  isNoonOrMidnight,
} from './time-formatting';
