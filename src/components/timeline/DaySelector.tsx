import { memo, useRef, useEffect, useLayoutEffect, useCallback, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, subDays, startOfDay, isSameDay, format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DAY_ITEM_WIDTH_PX,
  DAY_ITEM_GAP_PX,
  DAY_WHEEL_VISIBLE_ITEMS,
  DAY_WHEEL_RENDER_BUFFER,
  DAY_WHEEL_CHUNK_SIZE,
  DAY_WHEEL_EDGE_THRESHOLD,
} from '@/lib/timeline';

interface DaySelectorProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Handler when date changes */
  onDateChange: (date: Date) => void;
  /** Additional class name */
  className?: string;
}

interface DayItem {
  date: Date;
  dayOfWeek: string;
  dayOfMonth: number;
  isToday: boolean;
  key: string;
}

/**
 * Generate day items for a date range
 */
function generateDayItems(startDate: Date, endDate: Date): DayItem[] {
  const days: DayItem[] = [];
  let currentDate = startOfDay(startDate);
  const end = startOfDay(endDate);

  while (currentDate <= end) {
    days.push({
      date: currentDate,
      dayOfWeek: format(currentDate, 'EEE'),
      dayOfMonth: currentDate.getDate(),
      isToday: isToday(currentDate),
      key: currentDate.toISOString(),
    });
    currentDate = addDays(currentDate, 1);
  }

  return days;
}

/**
 * Calculate opacity based on distance from center
 */
function getOpacityForDistance(distance: number): number {
  if (distance === 0) return 1;
  if (distance === 1) return 0.8;
  if (distance === 2) return 0.5;
  if (distance === 3) return 0.3;
  return 0.15;
}

/**
 * DaySelector component
 * iOS-style horizontal wheel picker for date selection
 */
export const DaySelector = memo(function DaySelector({
  selectedDate,
  onDateChange,
  className,
}: DaySelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isUserScrolling = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate dimensions
  const itemWidth = DAY_ITEM_WIDTH_PX + DAY_ITEM_GAP_PX;
  // Use CSS calc for dynamic padding to center the item based on container width
  // padding = 50% of container - 50% of item width
  const paddingStyleWidth = `calc(50% - ${itemWidth / 2}px)`;

  // Date range state for infinite scroll - center on selectedDate
  const [dateRange, setDateRange] = useState(() => {
    const selected = startOfDay(selectedDate);
    return {
      start: subDays(selected, DAY_WHEEL_CHUNK_SIZE),
      end: addDays(selected, DAY_WHEEL_CHUNK_SIZE),
    };
  });

  // Generate all days in the current range
  const days = useMemo(
    () => generateDayItems(dateRange.start, dateRange.end),
    [dateRange.start, dateRange.end]
  );

  // Find index of selected date in days array
  const selectedIndex = useMemo(
    () => days.findIndex((day) => isSameDay(day.date, selectedDate)),
    [days, selectedDate]
  );

  // Track scroll position for virtualization (only after ready)
  const [scrollPosition, setScrollPosition] = useState(0);

  // Measure container width
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(container);
    // Set initial width
    setContainerWidth(container.clientWidth);

    return () => observer.disconnect();
  }, []);

  // Calculate center index - use selectedIndex before ready, scrollPosition after
  const centerIndex = isReady
    ? Math.round(scrollPosition / itemWidth)
    : selectedIndex >= 0
      ? selectedIndex
      : DAY_WHEEL_CHUNK_SIZE;

  /**
   * Scroll to a specific index
   */
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = index * itemWidth;
      container.scrollTo({ left: scrollLeft, behavior });
      setScrollPosition(scrollLeft);
    },
    [itemWidth]
  );

  /**
   * Handle scroll end - snap to nearest day and update selection
   */
  const handleScrollEnd = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isScrolling.current) return;

    const scrollLeft = container.scrollLeft;
    const nearestIndex = Math.round(scrollLeft / itemWidth);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, days.length - 1));

    const selectedDay = days[clampedIndex];
    if (selectedDay && !isSameDay(selectedDay.date, selectedDate)) {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
      onDateChange(selectedDay.date);
    }

    // Snap to exact position
    scrollToIndex(clampedIndex);
    isUserScrolling.current = false;
  }, [itemWidth, days, selectedDate, onDateChange, scrollToIndex]);

  /**
   * Handle scroll event - detect edge for infinite scroll
   */
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isUserScrolling.current = true;

    // Update scroll position for virtualization
    setScrollPosition(container.scrollLeft);

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set scroll end detection
    scrollTimeout.current = setTimeout(handleScrollEnd, 100);

    // Check if we need to expand the date range (infinite scroll)
    const scrollLeft = container.scrollLeft;
    const currentIndex = Math.round(scrollLeft / itemWidth);

    // Near start - expand backwards
    if (currentIndex < DAY_WHEEL_EDGE_THRESHOLD) {
      setDateRange((prev) => ({
        ...prev,
        start: subDays(prev.start, DAY_WHEEL_CHUNK_SIZE),
      }));
    }

    // Near end - expand forwards
    if (currentIndex > days.length - DAY_WHEEL_EDGE_THRESHOLD) {
      setDateRange((prev) => ({
        ...prev,
        end: addDays(prev.end, DAY_WHEEL_CHUNK_SIZE),
      }));
    }
  }, [handleScrollEnd, itemWidth, days.length]);

  /**
   * Navigate to previous day
   */
  const goToPreviousDay = useCallback(() => {
    onDateChange(subDays(selectedDate, 1));
  }, [selectedDate, onDateChange]);

  /**
   * Navigate to next day
   */
  const goToNextDay = useCallback(() => {
    onDateChange(addDays(selectedDate, 1));
  }, [selectedDate, onDateChange]);

  /**
   * Initial scroll - use useLayoutEffect to run before paint
   */
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || selectedIndex < 0) return;

    // Set initial scroll position synchronously
    const scrollLeft = selectedIndex * itemWidth;
    container.scrollLeft = scrollLeft;
    setScrollPosition(scrollLeft);
    setIsReady(true);
  }, [itemWidth, selectedIndex]);

  /**
   * Scroll to selected date when it changes (after initial mount)
   */
  useEffect(() => {
    if (!isReady) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const selectedStart = startOfDay(selectedDate);

    // Ensure the selected date is within our range
    if (selectedStart < dateRange.start) {
      setDateRange((prev) => ({
        ...prev,
        start: subDays(selectedStart, DAY_WHEEL_CHUNK_SIZE),
      }));
      return;
    }
    if (selectedStart > dateRange.end) {
      setDateRange((prev) => ({
        ...prev,
        end: addDays(selectedStart, DAY_WHEEL_CHUNK_SIZE),
      }));
      return;
    }

    // Find and scroll to the selected index
    const index = days.findIndex((day) => isSameDay(day.date, selectedDate));
    if (index >= 0 && !isUserScrolling.current) {
      scrollToIndex(index, 'smooth');
    }
  }, [selectedDate, dateRange.start, dateRange.end, days, scrollToIndex, isReady]);

  /**
   * Clean up timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Calculate visible range for virtualization
  // Determine how many items fit in the viewport
  const visibleItemsCount = containerWidth > 0 
    ? Math.ceil(containerWidth / itemWidth) 
    : DAY_WHEEL_VISIBLE_ITEMS;

  const visibleStartIndex = Math.max(0, Math.floor(scrollPosition / itemWidth) - DAY_WHEEL_RENDER_BUFFER);
  const visibleEndIndex = Math.min(
    days.length,
    Math.ceil(scrollPosition / itemWidth) + visibleItemsCount + DAY_WHEEL_RENDER_BUFFER
  );

  // Before ready, show items around selected date
  const initialPaddingItems = Math.floor(visibleItemsCount / 2);
  const effectiveStartIndex = isReady
    ? visibleStartIndex
    : Math.max(0, selectedIndex - DAY_WHEEL_RENDER_BUFFER - initialPaddingItems);
  const effectiveEndIndex = isReady
    ? visibleEndIndex
    : Math.min(days.length, selectedIndex + DAY_WHEEL_RENDER_BUFFER + initialPaddingItems + 1);

  const visibleDays = days.slice(effectiveStartIndex, effectiveEndIndex);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Previous day button - hidden on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 hidden sm:flex"
        onClick={goToPreviousDay}
        aria-label="Previous day"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Wheel picker container */}
      <div className="relative flex-1 overflow-hidden h-18">
        {/* Selection highlight (fixed at center, behind items) */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'pointer-events-none',
            'bg-primary rounded-xl'
          )}
          style={{
            width: DAY_ITEM_WIDTH_PX,
            height: 64,
            zIndex: 1,
          }}
        />

        {/* Scrollable container (above highlight) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={() => {
            isScrolling.current = true;
          }}
          onTouchEnd={() => {
            isScrolling.current = false;
          }}
          className={cn(
            'relative h-full flex items-center overflow-x-auto',
            'scroll-snap-x no-scrollbar gpu-scroll'
          )}
          style={{ zIndex: 2 }}
          role="listbox"
          aria-label="Select a day"
        >
          {/* Left padding for center alignment */}
          <div className="shrink-0" style={{ width: paddingStyleWidth }} />

          {/* Virtualized spacer for items before visible range */}
          {effectiveStartIndex > 0 && (
            <div
              className="shrink-0"
              style={{ width: effectiveStartIndex * itemWidth }}
            />
          )}

          {/* Visible day items */}
          {visibleDays.map((day) => {
            const dayIndex = days.findIndex((d) => d.key === day.key);
            const distanceFromCenter = Math.abs(dayIndex - centerIndex);
            const isSelected = isSameDay(day.date, selectedDate);
            const isAtCenter = dayIndex === centerIndex;
            const opacity = isAtCenter ? 1 : getOpacityForDistance(distanceFromCenter);

            return (
              <button
                key={day.key}
                className={cn(
                  'relative flex flex-col items-center justify-center shrink-0',
                  'rounded-xl transition-all duration-150',
                  'min-h-16',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'scroll-snap-center',
                  isAtCenter
                    ? 'text-primary-foreground scale-110'
                    : day.isToday
                      ? 'text-primary'
                      : 'text-muted-foreground'
                )}
                style={{
                  width: DAY_ITEM_WIDTH_PX,
                  marginRight: DAY_ITEM_GAP_PX,
                  opacity,
                }}
                onClick={() => onDateChange(day.date)}
                role="option"
                aria-selected={isSelected}
                aria-label={`${day.dayOfWeek} ${day.dayOfMonth}${day.isToday ? ', Today' : ''}${isSelected ? ', Selected' : ''}`}
                aria-current={day.isToday ? 'date' : undefined}
              >
                {/* Day of week */}
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wide',
                    isAtCenter ? 'text-primary-foreground/80' : 'opacity-70'
                  )}
                >
                  {day.dayOfWeek}
                </span>

                {/* Day of month */}
                <span
                  className={cn(
                    'text-lg font-semibold leading-none mt-0.5',
                    isAtCenter ? 'text-primary-foreground' : ''
                  )}
                >
                  {day.dayOfMonth}
                </span>

                {/* Today indicator dot (only when not at center) */}
                {day.isToday && !isAtCenter && (
                  <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}

          {/* Virtualized spacer for items after visible range */}
          {effectiveEndIndex < days.length && (
            <div
              className="shrink-0"
              style={{ width: (days.length - effectiveEndIndex) * itemWidth }}
            />
          )}

          {/* Right padding for center alignment */}
          <div className="shrink-0" style={{ width: paddingStyleWidth }} />
        </div>

        {/* Left gradient fade (above everything) */}
        <div
          className="absolute top-0 bottom-0 left-0 pointer-events-none bg-linear-to-r from-background to-transparent"
          style={{ width: paddingStyleWidth, zIndex: 10 }}
        />

        {/* Right gradient fade (above everything) */}
        <div
          className="absolute top-0 bottom-0 right-0 pointer-events-none bg-linear-to-l from-background to-transparent"
          style={{ width: paddingStyleWidth, zIndex: 10 }}
        />
      </div>

      {/* Next day button - hidden on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 hidden sm:flex"
        onClick={goToNextDay}
        aria-label="Next day"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
});

export default DaySelector;
