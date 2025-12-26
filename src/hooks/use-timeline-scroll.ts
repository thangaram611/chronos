import { useRef, useCallback, useEffect, useState } from 'react';
import { startOfDay } from 'date-fns';
import {
  getScrollPositionForTime,
  getCurrentTimeYPosition,
  SCROLL_PADDING_TOP_PX,
} from '@/lib/timeline';

interface UseTimelineScrollOptions {
  /** The selected day */
  date: Date;
  /** Whether to scroll to current time on mount */
  scrollToCurrentOnMount?: boolean;
  /** Custom scroll duration in ms */
  scrollDuration?: number;
}

interface UseTimelineScrollReturn {
  /** Ref to attach to the scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Scroll to a specific time */
  scrollToTime: (timestamp: number, smooth?: boolean) => void;
  /** Scroll to current time */
  scrollToCurrentTime: (smooth?: boolean) => void;
  /** Scroll to top of timeline */
  scrollToTop: (smooth?: boolean) => void;
  /** Get current scroll position */
  getScrollPosition: () => number;
}

/**
 * Hook for managing timeline scroll behavior
 */
export function useTimelineScroll(
  options: UseTimelineScrollOptions
): UseTimelineScrollReturn {
  const { date, scrollToCurrentOnMount = true } = options;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayStart = startOfDay(date).getTime();

  /**
   * Scroll to a specific time
   */
  const scrollToTime = useCallback(
    (timestamp: number, smooth: boolean = true) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const targetPosition = getScrollPositionForTime(
        timestamp,
        dayStart,
        container.clientHeight
      );

      container.scrollTo({
        top: Math.max(0, targetPosition - SCROLL_PADDING_TOP_PX),
        behavior: smooth ? 'smooth' : 'instant',
      });
    },
    [dayStart]
  );

  /**
   * Scroll to current time
   */
  const scrollToCurrentTime = useCallback(
    (smooth: boolean = true) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const currentY = getCurrentTimeYPosition(dayStart);
      if (currentY === null) {
        // Current time is not in this day, scroll to a reasonable position (9 AM)
        const nineAM = dayStart + 9 * 60 * 60 * 1000;
        scrollToTime(nineAM, smooth);
        return;
      }

      scrollToTime(Date.now(), smooth);
    },
    [dayStart, scrollToTime]
  );

  /**
   * Scroll to top of timeline
   */
  const scrollToTop = useCallback((smooth: boolean = true) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  /**
   * Get current scroll position
   */
  const getScrollPosition = useCallback(() => {
    return scrollContainerRef.current?.scrollTop ?? 0;
  }, []);

  // Scroll to current time on mount if enabled
  useEffect(() => {
    if (scrollToCurrentOnMount) {
      // Small delay to ensure layout is complete
      const timer = setTimeout(() => {
        scrollToCurrentTime(false); // No animation on initial load
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [scrollToCurrentOnMount, scrollToCurrentTime]);

  return {
    scrollContainerRef,
    scrollToTime,
    scrollToCurrentTime,
    scrollToTop,
    getScrollPosition,
  };
}

/**
 * Hook to detect if current time is visible in viewport
 * Reactive - updates on scroll
 */
export function useIsCurrentTimeVisible(
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  date: Date
): boolean {
  const [isVisible, setIsVisible] = useState(true);
  const dayStart = startOfDay(date).getTime();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkVisibility = () => {
      const currentY = getCurrentTimeYPosition(dayStart);
      if (currentY === null) {
        setIsVisible(false);
        return;
      }

      const { scrollTop, clientHeight } = container;
      const viewportTop = scrollTop;
      const viewportBottom = scrollTop + clientHeight;

      // Add small padding to prevent flickering at edges
      const padding = 20;
      setIsVisible(currentY >= viewportTop - padding && currentY <= viewportBottom + padding);
    };

    // Initial check
    checkVisibility();

    // Listen to scroll events
    container.addEventListener('scroll', checkVisibility, { passive: true });

    return () => {
      container.removeEventListener('scroll', checkVisibility);
    };
  }, [scrollContainerRef, dayStart]);

  return isVisible;
}
