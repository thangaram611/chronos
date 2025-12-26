import { useState, useEffect } from 'react';
import { CURRENT_TIME_UPDATE_INTERVAL_MS } from '@/lib/timeline';

/**
 * Hook that provides the current time and updates it periodically
 * @param updateInterval - Update interval in milliseconds (default: 60000 = 1 minute)
 * @returns Current timestamp in milliseconds
 */
export function useCurrentTime(
  updateInterval: number = CURRENT_TIME_UPDATE_INTERVAL_MS
): number {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    // Update immediately to sync with the next minute boundary
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // First update at the next minute boundary
    const initialTimeout = setTimeout(() => {
      setCurrentTime(Date.now());

      // Then update at regular intervals
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, updateInterval);

      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimeout);
  }, [updateInterval]);

  return currentTime;
}

/**
 * Hook that provides the current Date object and updates it periodically
 * @param updateInterval - Update interval in milliseconds
 * @returns Current Date object
 */
export function useCurrentDate(
  updateInterval: number = CURRENT_TIME_UPDATE_INTERVAL_MS
): Date {
  const timestamp = useCurrentTime(updateInterval);
  return new Date(timestamp);
}

/**
 * Hook that provides formatted current time string
 * @param format12Hour - Use 12-hour format (default: true)
 * @returns Formatted time string
 */
export function useFormattedCurrentTime(format12Hour: boolean = true): string {
  const currentTime = useCurrentTime();
  const date = new Date(currentTime);

  const hours24 = date.getHours();
  const minutes = date.getMinutes();

  if (format12Hour) {
    const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
