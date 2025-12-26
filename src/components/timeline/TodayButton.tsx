import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SPRING_CONFIG } from '@/lib/timeline';

interface TodayButtonProps {
  /** Current selected date */
  selectedDate: Date;
  /** Handler to go to today */
  onGoToToday: () => void;
  /** Variant style */
  variant?: 'default' | 'floating';
  /** Whether current time indicator is visible in viewport (for floating variant) */
  isCurrentTimeVisible?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * TodayButton component
 * Quick navigation button to jump to today's view
 */
export const TodayButton = memo(function TodayButton({
  selectedDate,
  onGoToToday,
  variant = 'default',
  isCurrentTimeVisible = true,
  className,
}: TodayButtonProps) {
  const isTodaySelected = isToday(selectedDate);

  // For floating variant:
  // - Show if today is NOT selected, OR
  // - Show if today IS selected but current time is NOT visible
  if (variant === 'floating') {
    const shouldShow = !isTodaySelected || (isTodaySelected && !isCurrentTimeVisible);

    return (
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={SPRING_CONFIG}
            className={cn('fixed bottom-20 left-1/2 -translate-x-1/2 z-30', className)}
          >
            <Button
              onClick={onGoToToday}
              size="sm"
              className={cn(
                'rounded-full shadow-lg',
                'bg-card text-card-foreground border',
                'hover:bg-accent'
              )}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Today
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Button
      variant={isTodaySelected ? 'secondary' : 'outline'}
      size="sm"
      onClick={onGoToToday}
      disabled={isTodaySelected}
      className={cn(
        'rounded-full text-xs font-medium',
        isTodaySelected && 'opacity-50',
        className
      )}
      aria-label="Go to today"
    >
      <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
      Today
    </Button>
  );
});

/**
 * Compact today button for tight spaces
 */
export const TodayButtonCompact = memo(function TodayButtonCompact({
  selectedDate,
  onGoToToday,
  className,
}: Omit<TodayButtonProps, 'variant'>) {
  const isTodaySelected = isToday(selectedDate);

  return (
    <button
      onClick={onGoToToday}
      disabled={isTodaySelected}
      className={cn(
        'flex items-center justify-center',
        'w-10 h-10 rounded-full',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isTodaySelected
          ? 'bg-primary/10 text-primary cursor-default'
          : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      aria-label="Go to today"
    >
      <CalendarDays className="w-5 h-5" />
    </button>
  );
});

export default TodayButton;
