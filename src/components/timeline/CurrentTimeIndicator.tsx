import { memo } from 'react';
import { motion } from 'framer-motion';
import { startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCurrentTime } from '@/hooks/use-current-time';
import {
  getCurrentTimeYPosition,
  formatCurrentTimeIndicator,
  TIME_GUTTER_WIDTH_PX,
  SPRING_CONFIG,
} from '@/lib/timeline';

interface CurrentTimeIndicatorProps {
  /** The current day being viewed */
  date: Date;
  /** Whether to show the time label */
  showLabel?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * CurrentTimeIndicator component
 * Shows a red line at the current time position with optional time label
 */
export const CurrentTimeIndicator = memo(function CurrentTimeIndicator({
  date,
  showLabel = true,
  className,
}: CurrentTimeIndicatorProps) {
  const currentTime = useCurrentTime();
  const dayStart = startOfDay(date).getTime();

  // Get Y position for current time
  const yPosition = getCurrentTimeYPosition(dayStart);

  // Don't render if current time is not in this day
  if (yPosition === null) {
    return null;
  }

  const timeLabel = formatCurrentTimeIndicator(new Date(currentTime));

  return (
    <motion.div
      className={cn(
        'absolute left-0 right-0 z-20 pointer-events-none gpu-accelerated',
        className
      )}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{
        opacity: 1,
        scaleX: 1,
        y: yPosition,
      }}
      transition={{
        opacity: { duration: 0.3 },
        scaleX: { duration: 0.3 },
        y: SPRING_CONFIG,
      }}
      style={{
        transformOrigin: 'left center',
        willChange: 'transform',
      }}
    >
      {/* Unified pill-line design */}
      <div className="flex items-center h-0">
        {/* Time pill in gutter area */}
        {showLabel && (
          <div
            className="shrink-0 flex items-center justify-end pr-1"
            style={{ width: `${TIME_GUTTER_WIDTH_PX}px` }}
          >
            <span
              className={cn(
                'flex items-center justify-center',
                'h-5 px-2',
                'rounded-full',
                'bg-primary text-primary-foreground',
                'text-[10px] font-semibold leading-none',
                'whitespace-nowrap tabular-nums',
                'shadow-sm'
              )}
            >
              {timeLabel}
            </span>
          </div>
        )}

        {/* Gradient line that fades out */}
        <div className="flex items-center flex-1">
          <div
            className={cn(
              'flex-1 h-0.5 rounded-full',
              'bg-linear-to-r from-primary via-primary/50 to-primary/10'
            )}
          />
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Static current time indicator (no animation)
 * Use for reduced motion preference
 */
export const StaticCurrentTimeIndicator = memo(function StaticCurrentTimeIndicator({
  date,
  showLabel = true,
  className,
}: CurrentTimeIndicatorProps) {
  const currentTime = useCurrentTime();
  const dayStart = startOfDay(date).getTime();
  const yPosition = getCurrentTimeYPosition(dayStart);

  if (yPosition === null) {
    return null;
  }

  const timeLabel = formatCurrentTimeIndicator(new Date(currentTime));

  return (
    <div
      className={cn(
        'absolute left-0 right-0 z-20 pointer-events-none',
        className
      )}
      style={{ transform: `translateY(${yPosition}px)` }}
    >
      {/* Unified pill-line design */}
      <div className="flex items-center h-0">
        {/* Time pill in gutter area */}
        {showLabel && (
          <div
            className="shrink-0 flex items-center justify-end pr-1"
            style={{ width: `${TIME_GUTTER_WIDTH_PX}px` }}
          >
            <span
              className={cn(
                'flex items-center justify-center',
                'h-5 px-2',
                'rounded-full',
                'bg-primary text-primary-foreground',
                'text-[10px] font-semibold leading-none',
                'whitespace-nowrap tabular-nums'
              )}
            >
              {timeLabel}
            </span>
          </div>
        )}

        {/* Gradient line that fades out */}
        <div className="flex items-center flex-1">
          <div
            className={cn(
              'flex-1 h-0.5 rounded-full',
              'bg-linear-to-r from-primary via-primary/50 to-primary/10'
            )}
          />
        </div>
      </div>
    </div>
  );
});

export default CurrentTimeIndicator;
