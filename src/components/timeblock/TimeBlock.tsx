import { memo, forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Schedule, Context } from '@/lib/db';
import type { BlockPosition } from '@/lib/timeline';
import { MIN_BLOCK_HEIGHT_PX, SPRING_CONFIG, TWEEN_CONFIG } from '@/lib/timeline';
import { TimeBlockContent, TimeBlockContentMinimal } from './TimeBlockContent';
import { Check } from 'lucide-react';

interface TimeBlockProps {
  /** The schedule data */
  schedule: Schedule;
  /** Calculated position */
  position: BlockPosition;
  /** Optional context for color tinting */
  context?: Context;
  /** Whether the block is selected */
  isSelected?: boolean;
  /** Whether the block is being dragged */
  isDragging?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Complete handler */
  onComplete?: () => void;
  /** Uncomplete handler (toggle back to incomplete) */
  onUncomplete?: () => void;
  /** Edit handler */
  onEdit?: () => void;
  /** Delete handler */
  onDelete?: () => void;
  /** Additional class name */
  className?: string;
}

// Animation variants
const blockVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: TWEEN_CONFIG,
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * TimeBlock component
 * Displays a single schedule block on the timeline
 */
export const TimeBlock = memo(
  forwardRef<HTMLDivElement, TimeBlockProps>(function TimeBlock(
    {
      schedule,
      position,
      context,
      isSelected = false,
      isDragging = false,
      onClick,
      onComplete: _onComplete,
      onUncomplete: _onUncomplete,
      onEdit: _onEdit,
      onDelete,
      className,
    },
    ref
  ) {
    // Suppress unused variable warnings - props passed for interface consistency
    void _onComplete;
    void _onUncomplete;
    void _onEdit;
    const { title, startTimestamp, endTimestamp, isLocked, actualEndTimestamp } = schedule;
    const isCompleted = !!actualEndTimestamp;
    const isCompact = position.height < 60;
    const isMinimal = position.height < MIN_BLOCK_HEIGHT_PX + 10;

    // Calculate context-based styles
    const contextStyles = useMemo(() => {
      if (!context?.colorHex) return {};

      return {
        borderLeftColor: context.colorHex,
        backgroundColor: `${context.colorHex}10`, // 10% opacity
      };
    }, [context?.colorHex]);

    return (
      <motion.div
        ref={ref}
        className={cn(
          'absolute group cursor-pointer',
          'rounded-xl border shadow-sm',
          'bg-card text-card-foreground',
          'border-l-[3px]',
          'transition-shadow duration-150',
          'hover:shadow-md',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'gpu-accelerated',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          isDragging && 'shadow-lg opacity-90 z-50',
          isCompleted && 'bg-muted/20 border-border/70 opacity-65',
          className
        )}
        style={{
          top: position.top,
          height: Math.max(position.height, MIN_BLOCK_HEIGHT_PX),
          left: position.left,
          width: position.width,
          minHeight: `${MIN_BLOCK_HEIGHT_PX}px`,
          willChange: 'transform',
          ...contextStyles,
          borderLeftColor: context?.colorHex || 'hsl(var(--primary))',
        }}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileTap="tap"
        transition={SPRING_CONFIG}
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-label={`${title}, ${schedule.startTimestamp} to ${schedule.endTimestamp}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
          if (e.key === 'Delete' && onDelete && !isLocked) {
            e.preventDefault();
            onDelete();
          }
        }}
      >
        {/* Completed badge - Subtle pastel chip */}
        {isCompleted && (
          <div
            className={cn(
              'absolute z-10 pointer-events-none',
              isMinimal ? 'top-0.5 right-0.5' : isCompact ? 'top-1 right-1' : 'top-2 right-2'
            )}
          >
            <span
              className={cn(
                'inline-flex items-center justify-center',
                isMinimal ? 'h-4 w-4 rounded-full' : 'gap-1 rounded-full px-2 py-0.5',
                'bg-secondary/80 dark:bg-secondary/20',
                'text-secondary-foreground/80 dark:text-secondary-foreground/70',
                'border border-secondary-foreground/15 dark:border-secondary/30'
              )}
            >
              <Check className={isMinimal ? 'h-2.5 w-2.5' : 'h-3 w-3'} strokeWidth={2.5} />
              {!isMinimal && (
                <span className="text-[10px] font-medium leading-none">done</span>
              )}
            </span>
          </div>
        )}

        {/* Content */}
        {isMinimal ? (
          <TimeBlockContentMinimal title={title} isCompleted={isCompleted} />
        ) : (
          <TimeBlockContent
            title={title}
            startTimestamp={startTimestamp}
            endTimestamp={endTimestamp}
            isLocked={isLocked}
            compact={isCompact}
            isCompleted={isCompleted}
          />
        )}
      </motion.div>
    );
  })
);

/**
 * Static TimeBlock (no animation)
 * Use for reduced motion preference or performance
 */
export const StaticTimeBlock = memo(
  forwardRef<HTMLDivElement, TimeBlockProps>(function StaticTimeBlock(
    {
      schedule,
      position,
      context,
      isSelected = false,
      onClick,
      onComplete: _onComplete,
      onEdit: _onEdit,
      onDelete,
      className,
    },
    ref
  ) {
    // Suppress unused variable warnings
    void _onComplete;
    void _onEdit;
    const { title, startTimestamp, endTimestamp, isLocked, actualEndTimestamp } = schedule;
    const isCompleted = !!actualEndTimestamp;
    const isCompact = position.height < 60;

    const contextStyles = useMemo(() => {
      if (!context?.colorHex) return {};
      return {
        borderLeftColor: context.colorHex,
        backgroundColor: `${context.colorHex}10`,
      };
    }, [context?.colorHex]);

    return (
      <div
        ref={ref}
        className={cn(
          'absolute group cursor-pointer',
          'rounded-xl border shadow-sm',
          'bg-card text-card-foreground',
          'border-l-[3px]',
          'transition-all duration-150',
          'hover:shadow-md active:scale-[0.98]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isSelected && 'ring-2 ring-primary',
          isCompleted && 'opacity-60',
          className
        )}
        style={{
          top: position.top,
          height: Math.max(position.height, MIN_BLOCK_HEIGHT_PX),
          left: position.left,
          width: position.width,
          minHeight: `${MIN_BLOCK_HEIGHT_PX}px`,
          ...contextStyles,
          borderLeftColor: context?.colorHex || 'hsl(var(--primary))',
        }}
        onClick={onClick}
        tabIndex={0}
        role="button"
        aria-label={`${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.();
          if (e.key === 'Delete' && onDelete && !isLocked) onDelete();
        }}
      >
        <TimeBlockContent
          title={title}
          startTimestamp={startTimestamp}
          endTimestamp={endTimestamp}
          isLocked={isLocked}
          compact={isCompact}
        />
      </div>
    );
  })
);

export default TimeBlock;
