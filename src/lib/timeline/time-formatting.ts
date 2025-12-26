import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInMinutes,
  addDays,
  subDays,
  startOfDay,
} from 'date-fns';
import type { FormattedTime, DaySelectorDay } from './types';
import { DAY_WHEEL_VISIBLE_ITEMS } from './constants';

/**
 * Format an hour (0-23) as a readable label
 * @param hour - Hour in 24-hour format
 * @param compact - Use compact format (9a vs 9 AM)
 * @returns Formatted hour string
 */
export function formatHourLabel(hour: number, compact: boolean = false): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  if (compact) {
    return `${displayHour}${period.toLowerCase().charAt(0)}`;
  }

  return `${displayHour} ${period}`;
}

/**
 * Get all hour labels for the timeline
 * @param compact - Use compact format
 * @returns Array of 24 hour labels
 */
export function getHourLabels(compact: boolean = false): string[] {
  return Array.from({ length: 24 }, (_, i) => formatHourLabel(i, compact));
}

/**
 * Format a timestamp as a time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns FormattedTime object with various formats
 */
export function formatTime(timestamp: number): FormattedTime {
  const date = new Date(timestamp);
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

  const paddedMinutes = minutes.toString().padStart(2, '0');

  return {
    time: `${hours12}:${paddedMinutes} ${period}`,
    compact: `${hours12}:${paddedMinutes}${period.toLowerCase().charAt(0)}`,
    hours: hours12.toString(),
    minutes: paddedMinutes,
    period,
  };
}

/**
 * Format a time range as a string
 * @param startTimestamp - Start time in milliseconds
 * @param endTimestamp - End time in milliseconds
 * @returns Formatted time range string
 */
export function formatTimeRange(
  startTimestamp: number,
  endTimestamp: number
): string {
  const start = formatTime(startTimestamp);
  const end = formatTime(endTimestamp);

  // Omit AM/PM from start if both are the same period
  if (start.period === end.period) {
    return `${start.hours}:${start.minutes} - ${end.time}`;
  }

  return `${start.time} - ${end.time}`;
}

/**
 * Format a duration in minutes as a readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m", "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Calculate and format duration between two timestamps
 * @param startTimestamp - Start time in milliseconds
 * @param endTimestamp - End time in milliseconds
 * @returns Formatted duration string
 */
export function formatDurationBetween(
  startTimestamp: number,
  endTimestamp: number
): string {
  const minutes = differenceInMinutes(endTimestamp, startTimestamp);
  return formatDuration(minutes);
}

/**
 * Format a date as a relative day string
 * @param date - Date to format
 * @returns Relative day string (e.g., "Today", "Tomorrow", "Mon, Dec 30")
 */
export function formatRelativeDay(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  // For other dates, show day of week and date
  return format(date, 'EEE, MMM d');
}

/**
 * Format a date for display in the day selector
 * @param date - Date to format
 * @returns Object with day of week and day of month
 */
export function formatDaySelectorDate(date: Date): {
  dayOfWeek: string;
  dayOfMonth: string;
  isToday: boolean;
} {
  return {
    dayOfWeek: format(date, 'EEE'),
    dayOfMonth: format(date, 'd'),
    isToday: isToday(date),
  };
}

/**
 * Generate days for the day selector
 * @param centerDate - The center date (usually today or selected date)
 * @param selectedDate - The currently selected date
 * @param bufferDays - Number of days to render on each side (default: visible days / 2)
 * @returns Array of DaySelectorDay objects
 */
export function generateDaySelectorDays(
  centerDate: Date,
  selectedDate: Date,
  bufferDays?: number
): DaySelectorDay[] {
  const days: DaySelectorDay[] = [];
  const halfDays = bufferDays ?? Math.floor(DAY_WHEEL_VISIBLE_ITEMS / 2);

  for (let i = -halfDays; i <= halfDays; i++) {
    const date = i < 0 ? subDays(centerDate, Math.abs(i)) : addDays(centerDate, i);
    const dayStart = startOfDay(date);
    const selectedDayStart = startOfDay(selectedDate);

    days.push({
      date,
      dayOfWeek: format(date, 'EEE'),
      dayOfMonth: date.getDate(),
      isToday: isToday(date),
      isSelected: dayStart.getTime() === selectedDayStart.getTime(),
      hasSchedules: false, // Will be updated by the component
    });
  }

  return days;
}

/**
 * Format current time for display in the indicator
 * @param date - Current date/time
 * @returns Formatted time string
 */
export function formatCurrentTimeIndicator(date: Date = new Date()): string {
  return format(date, 'h:mm a');
}

/**
 * Check if a given hour is a "major" hour (midnight, 6am, noon, 6pm)
 * @param hour - Hour in 24-hour format
 * @returns true if major hour
 */
export function isMajorHour(hour: number): boolean {
  return hour === 0 || hour === 6 || hour === 12 || hour === 18;
}

/**
 * Check if a given hour is noon or midnight
 * @param hour - Hour in 24-hour format
 * @returns true if noon (12) or midnight (0)
 */
export function isNoonOrMidnight(hour: number): boolean {
  return hour === 0 || hour === 12;
}
