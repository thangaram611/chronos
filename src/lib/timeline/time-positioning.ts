import {
  getHours,
  getMinutes,
  startOfDay,
  endOfDay,
  differenceInMinutes,
} from 'date-fns';
import {
  HOUR_HEIGHT_PX,
  MIN_BLOCK_HEIGHT_PX,
  BLOCK_HORIZONTAL_PADDING_PX,
  BLOCK_GAP_PX,
  SNAP_INTERVAL_MINUTES,
} from './constants';
import type { BlockPosition, DayBounds } from './types';

/**
 * Convert a timestamp to Y position in pixels
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Y position in pixels from top of timeline
 */
export function timestampToYPosition(
  timestamp: number,
  dayStart?: number
): number {
  // Prefer using dayStart if provided (avoids any DST / day boundary surprises)
  if (typeof dayStart === 'number') {
    const minutesFromDayStart = differenceInMinutes(timestamp, dayStart);
    return (minutesFromDayStart / 60) * HOUR_HEIGHT_PX;
  }

  const date = new Date(timestamp);
  const hours = getHours(date);
  const minutes = getMinutes(date);

  // Calculate minutes from midnight
  const minutesFromMidnight = hours * 60 + minutes;

  // Convert to pixels (HOUR_HEIGHT_PX / 60 = pixels per minute)
  return (minutesFromMidnight / 60) * HOUR_HEIGHT_PX;
}

/**
 * Convert a Y position to timestamp
 * @param yPosition - Y position in pixels from top of timeline
 * @param dayStart - Start of day timestamp in milliseconds
 * @returns Unix timestamp in milliseconds
 */
export function yPositionToTimestamp(
  yPosition: number,
  dayStart: number
): number {
  // Convert pixels to minutes
  const minutesFromMidnight = (yPosition / HOUR_HEIGHT_PX) * 60;

  // Add to day start
  return dayStart + minutesFromMidnight * 60 * 1000;
}

/**
 * Calculate the height of a time block in pixels
 * @param startTimestamp - Block start time in milliseconds
 * @param endTimestamp - Block end time in milliseconds
 * @returns Height in pixels (minimum MIN_BLOCK_HEIGHT_PX)
 */
export function getBlockHeight(
  startTimestamp: number,
  endTimestamp: number
): number {
  const durationMinutes = differenceInMinutes(endTimestamp, startTimestamp);
  const height = (durationMinutes / 60) * HOUR_HEIGHT_PX;

  // Ensure minimum height for touch targets
  return Math.max(height, MIN_BLOCK_HEIGHT_PX);
}

/**
 * Calculate the top position of a time block
 * @param startTimestamp - Block start time in milliseconds
 * @param dayStart - Start of day timestamp in milliseconds
 * @returns Top position in pixels
 */
export function getBlockTop(startTimestamp: number, dayStart: number): number {
  return timestampToYPosition(startTimestamp, dayStart);
}

/**
 * Calculate the full position style for a time block
 * @param startTimestamp - Block start time in milliseconds
 * @param endTimestamp - Block end time in milliseconds
 * @param dayStart - Start of day timestamp in milliseconds
 * @param column - Column index for overlapping blocks (0-based)
 * @param totalColumns - Total number of columns in overlap group
 * @returns BlockPosition object with all positioning values
 */
export function calculateBlockPosition(
  startTimestamp: number,
  endTimestamp: number,
  dayStart: number,
  column: number = 0,
  totalColumns: number = 1
): BlockPosition {
  const top = getBlockTop(startTimestamp, dayStart);
  const height = getBlockHeight(startTimestamp, endTimestamp);

  // Calculate width and left position for overlapping columns
  const availableWidth = 100; // Percentage
  const columnWidth = availableWidth / totalColumns;

  const width = `calc(${columnWidth}% - ${BLOCK_GAP_PX}px)`;
  const left = `calc(${column * columnWidth}% + ${BLOCK_HORIZONTAL_PADDING_PX}px)`;

  return {
    top,
    height,
    left,
    width,
    column,
    totalColumns,
  };
}

/**
 * Get the start and end timestamps for a given day
 * @param date - Any date within the desired day
 * @returns DayBounds with start and end timestamps
 */
export function getDayBounds(date: Date): DayBounds {
  return {
    start: startOfDay(date).getTime(),
    end: endOfDay(date).getTime(),
  };
}

/**
 * Snap a timestamp to the nearest interval
 * @param timestamp - Unix timestamp in milliseconds
 * @param intervalMinutes - Interval to snap to (default: SNAP_INTERVAL_MINUTES)
 * @returns Snapped timestamp in milliseconds
 */
export function snapToInterval(
  timestamp: number,
  intervalMinutes: number = SNAP_INTERVAL_MINUTES
): number {
  const date = new Date(timestamp);
  const minutes = getMinutes(date);
  const snappedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;

  date.setMinutes(snappedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.getTime();
}

/**
 * Get the Y position for the current time
 * @param dayStart - Start of day timestamp in milliseconds
 * @returns Y position in pixels, or null if current time is not in this day
 */
export function getCurrentTimeYPosition(dayStart: number): number | null {
  const now = Date.now();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;

  if (now < dayStart || now > dayEnd) {
    return null;
  }

  return timestampToYPosition(now, dayStart);
}

/**
 * Calculate scroll position to center a specific time on screen
 * @param timestamp - Target time in milliseconds
 * @param dayStart - Start of day timestamp in milliseconds
 * @param containerHeight - Height of scroll container in pixels
 * @returns Scroll top position in pixels
 */
export function getScrollPositionForTime(
  timestamp: number,
  dayStart: number,
  containerHeight: number
): number {
  const yPosition = timestampToYPosition(timestamp, dayStart);
  // Center the time in the viewport
  return Math.max(0, yPosition - containerHeight / 3);
}
