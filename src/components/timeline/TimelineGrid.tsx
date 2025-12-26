import { memo } from 'react';
import { cn } from '@/lib/utils';
import {
  HOUR_HEIGHT_PX,
  TIME_GUTTER_WIDTH_PX,
  TOTAL_HOURS,
  formatHourLabel,
  isMajorHour,
  isNoonOrMidnight,
} from '@/lib/timeline';

interface TimelineGridProps {
  /** Use compact hour labels (mobile) */
  compact?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * TimelineGrid component
 * Renders the 24-hour background grid with hour lines and labels
 */
export const TimelineGrid = memo(function TimelineGrid({
  compact = false,
  className,
}: TimelineGridProps) {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => i);

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none gpu-accelerated',
        className
      )}
      style={{
        width: '100%',
        height: `${TOTAL_HOURS * HOUR_HEIGHT_PX}px`,
      }}
      role="presentation"
      aria-hidden="true"
    >
      {hours.map((hour) => (
        <HourRow key={hour} hour={hour} compact={compact} />
      ))}
    </div>
  );
});

interface HourRowProps {
  hour: number;
  compact: boolean;
}

const HourRow = memo(function HourRow({ hour, compact }: HourRowProps) {
  const isMajor = isMajorHour(hour);
  const isSpecial = isNoonOrMidnight(hour);

  return (
    <div
      className="absolute w-full flex"
      style={{
        top: `${hour * HOUR_HEIGHT_PX}px`,
        height: `${HOUR_HEIGHT_PX}px`,
      }}
    >
      {/* Time label */}
      <div
        className={cn(
          'flex-shrink-0 flex items-start justify-end pr-3 pt-0',
          'text-xs font-medium select-none',
          isSpecial
            ? 'text-foreground'
            : isMajor
              ? 'text-muted-foreground'
              : 'text-muted-foreground/70'
        )}
        style={{ width: `${TIME_GUTTER_WIDTH_PX}px` }}
      >
        <span className="-translate-y-2">{formatHourLabel(hour, compact)}</span>
      </div>

      {/* Hour line */}
      <div className="flex-1 relative">
        <div
          className={cn(
            'absolute top-0 left-0 right-0',
            isSpecial
              ? 'border-t border-border'
              : isMajor
                ? 'border-t border-border/60'
                : 'border-t border-border/30'
          )}
        />

        {/* Half-hour line (subtle) */}
        <div
          className="absolute left-0 right-0 border-t border-border/10"
          style={{ top: `${HOUR_HEIGHT_PX / 2}px` }}
        />
      </div>
    </div>
  );
});

/**
 * Lightweight grid overlay for better performance
 * Use this when you need just the lines without labels
 */
export const TimelineGridLines = memo(function TimelineGridLines({
  className,
}: {
  className?: string;
}) {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => i);

  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        height: `${TOTAL_HOURS * HOUR_HEIGHT_PX}px`,
        left: `${TIME_GUTTER_WIDTH_PX}px`,
        right: 0,
      }}
    >
      {hours.map((hour) => (
        <div
          key={hour}
          className={cn(
            'absolute left-0 right-0 border-t',
            isNoonOrMidnight(hour)
              ? 'border-border'
              : isMajorHour(hour)
                ? 'border-border/60'
                : 'border-border/30'
          )}
          style={{ top: `${hour * HOUR_HEIGHT_PX}px` }}
        />
      ))}
    </div>
  );
});

export default TimelineGrid;
