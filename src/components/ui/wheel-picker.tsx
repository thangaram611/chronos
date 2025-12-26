import React, {
  memo,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

interface WheelPickerProps<T> {
  /** Available options */
  options: T[];
  /** Currently selected value */
  value: T;
  /** Handler when value changes */
  onChange: (value: T) => void;
  /** Render function for each option */
  renderOption: (option: T, isSelected: boolean) => ReactNode;
  /** Get unique key for each option */
  getOptionKey: (option: T) => string;
  /** Height of each option item */
  itemHeight?: number;
  /** Number of visible items */
  visibleItems?: number;
  /** Additional class name */
  className?: string;
  /** Aria label */
  ariaLabel?: string;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

/**
 * WheelPicker component
 * iOS-style scrolling wheel picker
 */
function WheelPickerInner<T>({
  options,
  value,
  onChange,
  renderOption,
  getOptionKey,
  itemHeight = ITEM_HEIGHT,
  visibleItems = VISIBLE_ITEMS,
  className,
  ariaLabel,
}: WheelPickerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const containerHeight = itemHeight * visibleItems;
  const paddingItems = Math.floor(visibleItems / 2);

  /**
   * Get the index of the current value
   */
  const selectedIndex = options.findIndex(
    (opt) => getOptionKey(opt) === getOptionKey(value)
  );

  /**
   * Scroll to a specific index
   */
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const container = containerRef.current;
      if (!container) return;

      const scrollTop = index * itemHeight;
      container.scrollTo({ top: scrollTop, behavior });
    },
    [itemHeight]
  );

  /**
   * Handle scroll end - snap to nearest option
   */
  const handleScrollEnd = useCallback(() => {
    const container = containerRef.current;
    if (!container || isScrolling.current) return;

    const scrollTop = container.scrollTop;
    const nearestIndex = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, options.length - 1));

    if (clampedIndex !== selectedIndex) {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
      onChange(options[clampedIndex]);
    }

    scrollToIndex(clampedIndex);
  }, [itemHeight, options, selectedIndex, onChange, scrollToIndex]);

  /**
   * Handle scroll event
   */
  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(handleScrollEnd, 100);
  }, [handleScrollEnd]);

  /**
   * Scroll to selected value on mount and value change
   */
  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToIndex(selectedIndex, 'instant');
    }
  }, [selectedIndex, scrollToIndex]);

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

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ height: containerHeight }}
      aria-label={ariaLabel}
      role="listbox"
    >
      {/* Selection highlight */}
      <div
        className={cn(
          'absolute left-0 right-0 pointer-events-none z-10',
          'bg-accent/50 rounded-lg'
        )}
        style={{
          top: paddingItems * itemHeight,
          height: itemHeight,
        }}
      />

      {/* Gradient overlays for fade effect */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none bg-linear-to-b from-background to-transparent"
        style={{ height: paddingItems * itemHeight }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none bg-linear-to-t from-background to-transparent"
        style={{ height: paddingItems * itemHeight }}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className={cn(
          'h-full overflow-y-auto scroll-snap-y no-scrollbar gpu-scroll'
        )}
        onScroll={handleScroll}
        onTouchStart={() => {
          isScrolling.current = true;
        }}
        onTouchEnd={() => {
          isScrolling.current = false;
        }}
      >
        {/* Top padding */}
        <div style={{ height: paddingItems * itemHeight }} />

        {/* Options */}
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={getOptionKey(option)}
              className={cn(
                'w-full flex items-center justify-center',
                'scroll-snap-center',
                'transition-all duration-150',
                isSelected
                  ? 'text-foreground font-semibold scale-110'
                  : 'text-muted-foreground'
              )}
              style={{ height: itemHeight }}
              onClick={() => {
                onChange(option);
                scrollToIndex(index);
              }}
              role="option"
              aria-selected={isSelected}
            >
              {renderOption(option, isSelected)}
            </button>
          );
        })}

        {/* Bottom padding */}
        <div style={{ height: paddingItems * itemHeight }} />
      </div>
    </div>
  );
}

// Export with proper generic type preservation
export const WheelPicker = WheelPickerInner as <T>(
  props: WheelPickerProps<T>
) => React.ReactElement;

/**
 * Simple number wheel picker
 */
export const NumberWheelPicker = memo(function NumberWheelPicker({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  className,
  ariaLabel,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  ariaLabel?: string;
}) {
  const options: number[] = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  return (
    <WheelPicker
      options={options}
      value={value}
      onChange={onChange}
      renderOption={(opt, isSelected) => (
        <span className={cn(isSelected && 'text-lg')}>
          {formatValue ? formatValue(opt) : opt}
        </span>
      )}
      getOptionKey={(opt) => opt.toString()}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
});

export default WheelPicker;
