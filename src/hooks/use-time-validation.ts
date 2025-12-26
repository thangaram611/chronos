import { useCallback } from 'react';
import { differenceInMinutes, isBefore, startOfDay, endOfDay } from 'date-fns';
import type { Schedule } from '@/lib/db';
import { checkForConflicts, checkForLockedConflicts, type TimeValidationResult, type TimeValidationError } from '@/lib/timeline';

interface UseTimeValidationOptions {
  /** Existing schedules to check for conflicts */
  existingSchedules: Schedule[];
  /** Minimum duration in minutes (default: 15) */
  minDuration?: number;
  /** Allow past times (default: false) */
  allowPastTimes?: boolean;
  /** ID to exclude from conflict check (for editing) */
  excludeId?: string;
}

interface UseTimeValidationReturn {
  /** Validate a time range */
  validate: (startTime: number, endTime: number) => TimeValidationResult;
  /** Check if range is valid (quick check) */
  isValid: (startTime: number, endTime: number) => boolean;
  /** Get conflicting schedule IDs */
  getConflicts: (startTime: number, endTime: number) => string[];
}

/**
 * Hook for validating time ranges
 */
export function useTimeValidation(
  options: UseTimeValidationOptions
): UseTimeValidationReturn {
  const {
    existingSchedules,
    minDuration = 15,
    allowPastTimes = false,
    excludeId,
  } = options;

  const validate = useCallback(
    (startTime: number, endTime: number): TimeValidationResult => {
      const errors: TimeValidationError[] = [];

      // Check if end is after start
      if (!isBefore(startTime, endTime)) {
        errors.push({
          type: 'invalid_range',
          message: 'End time must be after start time',
        });
      }

      // Check minimum duration
      const duration = differenceInMinutes(endTime, startTime);
      if (duration < minDuration) {
        errors.push({
          type: 'too_short',
          message: `Duration must be at least ${minDuration} minutes`,
        });
      }

      // Check if start time is in the past
      if (!allowPastTimes && isBefore(startTime, Date.now())) {
        errors.push({
          type: 'past_time',
          message: 'Start time cannot be in the past',
        });
      }

      // Check for locked block overlaps (blocking error)
      const lockedConflicts = checkForLockedConflicts(
        startTime,
        endTime,
        existingSchedules,
        excludeId
      );

      if (lockedConflicts.length > 0) {
        errors.push({
          type: 'locked_overlap',
          message: `Cannot create block: overlaps with ${lockedConflicts.length} locked block(s)`,
          conflictingBlockId: lockedConflicts[0],
        });
      }

      // Check for regular overlaps (warning, not blocking)
      const conflicts = checkForConflicts(
        startTime,
        endTime,
        existingSchedules,
        excludeId
      );

      // Filter out locked conflicts from regular conflicts count
      const nonLockedConflicts = conflicts.filter(id => !lockedConflicts.includes(id));
      if (nonLockedConflicts.length > 0) {
        errors.push({
          type: 'overlap',
          message: `This time overlaps with ${nonLockedConflicts.length} existing block(s)`,
          conflictingBlockId: nonLockedConflicts[0],
        });
      }

      return {
        // locked_overlap is a blocking error (not in exclusion list)
        isValid: errors.filter((e) => e.type !== 'overlap').length === 0,
        errors,
      };
    },
    [existingSchedules, minDuration, allowPastTimes, excludeId]
  );

  const isValid = useCallback(
    (startTime: number, endTime: number): boolean => {
      return validate(startTime, endTime).isValid;
    },
    [validate]
  );

  const getConflicts = useCallback(
    (startTime: number, endTime: number): string[] => {
      return checkForConflicts(startTime, endTime, existingSchedules, excludeId);
    },
    [existingSchedules, excludeId]
  );

  return {
    validate,
    isValid,
    getConflicts,
  };
}

/**
 * Hook for validating time picker values
 */
export function useTimePickerValidation(
  date: Date,
  options?: { allowPastTimes?: boolean }
) {
  const { allowPastTimes = false } = options || {};

  const dayStart = startOfDay(date).getTime();
  const dayEnd = endOfDay(date).getTime();

  const isTimeInDay = useCallback(
    (timestamp: number): boolean => {
      return timestamp >= dayStart && timestamp <= dayEnd;
    },
    [dayStart, dayEnd]
  );

  const isTimeInPast = useCallback((timestamp: number): boolean => {
    return timestamp < Date.now();
  }, []);

  const validateTime = useCallback(
    (timestamp: number): { isValid: boolean; error?: string } => {
      if (!isTimeInDay(timestamp)) {
        return { isValid: false, error: 'Time must be within the selected day' };
      }

      if (!allowPastTimes && isTimeInPast(timestamp)) {
        return { isValid: false, error: 'Time cannot be in the past' };
      }

      return { isValid: true };
    },
    [isTimeInDay, isTimeInPast, allowPastTimes]
  );

  return {
    isTimeInDay,
    isTimeInPast,
    validateTime,
  };
}
