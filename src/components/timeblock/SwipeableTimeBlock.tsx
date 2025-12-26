import { memo, useState, useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  type PanInfo,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Schedule, Context } from '@/lib/db';
import type { BlockPosition } from '@/lib/timeline';
import {
  SWIPE_THRESHOLD_PX,
  SWIPE_VELOCITY_THRESHOLD,
  SWIPE_REVEAL_POSITION_PX,
  SWIPE_CONFIRM_THRESHOLD_PX,
  SPRING_CONFIG,
  MIN_BLOCK_HEIGHT_PX,
} from '@/lib/timeline';
import { TimeBlock } from './TimeBlock';
import { SwipeActionPanel, SwipeActionBackground } from './SwipeActionPanel';

interface SwipeableTimeBlockProps {
  /** The schedule data */
  schedule: Schedule;
  /** Calculated position */
  position: BlockPosition;
  /** Optional context for color tinting */
  context?: Context;
  /** Whether the block is selected */
  isSelected?: boolean;
  /** Click/tap handler */
  onClick?: () => void;
  /** Complete handler */
  onComplete?: () => void;
  /** Uncomplete handler (toggle back to incomplete) */
  onUncomplete?: () => void;
  /** Edit handler */
  onEdit?: () => void;
  /** Delete handler */
  onDelete?: () => Promise<void> | void;
  /** Additional class name */
  className?: string;
  /** Disable swipe gestures */
  disableSwipe?: boolean;
}

/**
 * SwipeableTimeBlock component
 * Wraps TimeBlock with swipe-to-complete and swipe-to-delete gestures
 */
export const SwipeableTimeBlock = memo(function SwipeableTimeBlock({
  schedule,
  position,
  context,
  isSelected = false,
  onClick,
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  className,
  disableSwipe = false,
}: SwipeableTimeBlockProps) {
  const [revealedAction, setRevealedAction] = useState<'complete' | 'delete' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleted = !!schedule.actualEndTimestamp;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Motion values for swipe
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Transform swipe to opacity for action panels
  const rightActionOpacity = useTransform(x, [0, SWIPE_THRESHOLD_PX], [0, 1]);
  const leftActionOpacity = useTransform(x, [-SWIPE_THRESHOLD_PX, 0], [1, 0]);

  /**
   * Track drag start
   */
  const handleDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  /**
   * Handle pan/drag end - Mobile reveal pattern
   */
  const handleDragEnd = useCallback(
    async (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info;

      // Check if this was a significant drag (not just a tap)
      const dragDistance = Math.abs(offset.x);
      const wasDragged = dragDistance > 5;

      // Check swipe direction and magnitude
      const swipedRightPast =
        offset.x > SWIPE_THRESHOLD_PX || velocity.x > SWIPE_VELOCITY_THRESHOLD;
      const swipedLeftPast =
        offset.x < -SWIPE_THRESHOLD_PX || velocity.x < -SWIPE_VELOCITY_THRESHOLD;

      // Full swipe confirmation (swipe far enough to auto-confirm)
      const confirmedRight = offset.x > SWIPE_CONFIRM_THRESHOLD_PX;
      const confirmedLeft = offset.x < -SWIPE_CONFIRM_THRESHOLD_PX;

      // Locked blocks: allow complete (right swipe), block delete (left swipe)
      const canSwipeRight = true; // Always allow complete
      const canSwipeLeft = !schedule.isLocked; // Only allow delete for non-locked

      if (confirmedRight && canSwipeRight) {
        // Full swipe right = toggle complete immediately
        if ('vibrate' in navigator) {
          navigator.vibrate([10, 50, 10]);
        }
        await controls.start({ x: 300, opacity: 0, transition: { duration: 0.2 } });

        if (isCompleted && onUncomplete) {
          onUncomplete();
        } else if (!isCompleted && onComplete) {
          onComplete();
        }

        await controls.start({ x: 0, opacity: 1 });
        setRevealedAction(null);
      } else if (confirmedLeft && onDelete && canSwipeLeft) {
        // Full swipe left = delete immediately
        if ('vibrate' in navigator) {
          navigator.vibrate([10, 50, 10]);
        }
        setIsDeleting(true);
        try {
          await onDelete();
        } finally {
          setIsDeleting(false);
        }
        setRevealedAction(null);
      } else if (swipedRightPast && canSwipeRight && (onComplete || onUncomplete)) {
        // Partial swipe right = reveal complete/uncomplete action
        if ('vibrate' in navigator) {
          navigator.vibrate(5);
        }
        await controls.start({ x: SWIPE_REVEAL_POSITION_PX, transition: SPRING_CONFIG });
        setRevealedAction('complete');
      } else if (swipedLeftPast && onDelete && canSwipeLeft) {
        // Partial swipe left = reveal delete action
        if ('vibrate' in navigator) {
          navigator.vibrate(5);
        }
        await controls.start({ x: -SWIPE_REVEAL_POSITION_PX, transition: SPRING_CONFIG });
        setRevealedAction('delete');
      } else {
        // Snap back to center
        await controls.start({ x: 0, transition: SPRING_CONFIG });
        setRevealedAction(null);
      }

      // Reset drag flag after a short delay to prevent click from firing
      if (wasDragged) {
        setTimeout(() => {
          isDragging.current = false;
        }, 100);
      } else {
        isDragging.current = false;
      }
    },
    [controls, onComplete, onUncomplete, onDelete, schedule.isLocked, isCompleted]
  );

  /**
   * Wrapped onClick that prevents firing after a drag
   */
  const handleClick = useCallback(() => {
    // Don't trigger click if we just dragged
    if (isDragging.current) return;
    onClick?.();
  }, [onClick]);

  /**
   * Close revealed action
   */
  const handleCloseReveal = useCallback(async () => {
    await controls.start({ x: 0, transition: SPRING_CONFIG });
    setRevealedAction(null);
  }, [controls]);

  /**
   * Auto-dismiss revealed action on outside interaction or scroll
   */
  useEffect(() => {
    if (!revealedAction) return;

    const handleGlobalInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      // Check if click is outside our wrapper
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        handleCloseReveal();
      }
    };

    const handleScroll = () => {
      handleCloseReveal();
    };

    // Small delay to prevent immediate dismissal from the same event
    const timeoutId = setTimeout(() => {
      document.addEventListener('touchstart', handleGlobalInteraction, { passive: true });
      document.addEventListener('mousedown', handleGlobalInteraction);

      // Listen to scroll on the timeline container
      const scrollContainer = document.querySelector('[data-timeline-scroll]');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('touchstart', handleGlobalInteraction);
      document.removeEventListener('mousedown', handleGlobalInteraction);

      const scrollContainer = document.querySelector('[data-timeline-scroll]');
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [revealedAction, handleCloseReveal]);

  /**
   * Handle revealed action tap
   */
  const handleRevealedAction = useCallback(async (action: 'complete' | 'delete') => {
    if (action === 'complete') {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      await controls.start({ x: 300, opacity: 0, transition: { duration: 0.2 } });

      if (isCompleted && onUncomplete) {
        onUncomplete();
      } else if (!isCompleted && onComplete) {
        onComplete();
      }

      await controls.start({ x: 0, opacity: 1 });
    } else if (action === 'delete' && onDelete) {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      setIsDeleting(true);
      try {
        await onDelete();
      } finally {
        setIsDeleting(false);
      }
    }
    setRevealedAction(null);
  }, [controls, onComplete, onUncomplete, onDelete, isCompleted]);

  // If swipe is disabled, render static block
  if (disableSwipe) {
    return (
      <TimeBlock
        schedule={schedule}
        position={position}
        context={context}
        isSelected={isSelected}
        onClick={onClick}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
        onEdit={onEdit}
        onDelete={onDelete}
        className={className}
      />
    );
  }

  return (
    <>
      <div
        ref={wrapperRef}
        data-swipeable-block
        className={cn('absolute overflow-hidden', revealedAction && 'z-20', className)}
        style={{
          top: position.top,
          height: Math.max(position.height, MIN_BLOCK_HEIGHT_PX),
          left: position.left,
          width: position.width,
          minHeight: `${MIN_BLOCK_HEIGHT_PX}px`,
        }}
      >
        {/* Background with action colors */}
        <SwipeActionBackground x={x} isCompleted={isCompleted} />

      {/* Left action panel (delete) - hidden for locked blocks */}
      {onDelete && !schedule.isLocked && (
        <motion.div
          style={{ opacity: revealedAction === 'delete' ? 1 : leftActionOpacity }}
          className="absolute inset-y-0 right-0"
        >
          <SwipeActionPanel
            direction="left"
            x={x}
            onAction={() => handleRevealedAction('delete')}
            isRevealed={revealedAction === 'delete'}
            isLoading={isDeleting}
          />
        </motion.div>
      )}

      {/* Right action panel (complete/uncomplete) */}
      {(onComplete || onUncomplete) && (
        <motion.div
          style={{ opacity: revealedAction === 'complete' ? 1 : rightActionOpacity }}
          className="absolute inset-y-0 left-0"
        >
          <SwipeActionPanel
            direction="right"
            x={x}
            onAction={() => handleRevealedAction('complete')}
            isCompleted={isCompleted}
            isRevealed={revealedAction === 'complete'}
          />
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        className="relative h-full gpu-accelerated touch-pan-y"
        style={{ x }}
        animate={controls}
        drag="x"
        dragConstraints={{
          left: schedule.isLocked ? 0 : -160, // Block left drag for locked
          right: 160
        }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={revealedAction ? handleCloseReveal : undefined}
      >
        <TimeBlock
          schedule={schedule}
          position={{ ...position, top: 0, left: '0', width: '100%' }}
          context={context}
          isSelected={isSelected}
          onClick={handleClick}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </motion.div>
      </div>
    </>
  );
});

export default SwipeableTimeBlock;
