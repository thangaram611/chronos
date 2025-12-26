import { memo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { Check, Trash2, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SWIPE_ACTION_WIDTH_PX, SWIPE_THRESHOLD_PX } from '@/lib/timeline';

interface SwipeActionPanelProps {
  /** Direction of the swipe action */
  direction: 'left' | 'right';
  /** Motion value for the swipe position */
  x: MotionValue<number>;
  /** Handler for the action */
  onAction: () => void;
  /** Whether the task is already completed (for toggle) */
  isCompleted?: boolean;
  /** Whether the action is revealed and tappable */
  isRevealed?: boolean;
  /** Whether the action is loading */
  isLoading?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * SwipeActionPanel component
 * Reveals action button when swiping a time block
 * Subtle outlined icon with matching glow
 */
export const SwipeActionPanel = memo(function SwipeActionPanel({
  direction,
  x,
  onAction,
  isCompleted = false,
  isRevealed = false,
  isLoading = false,
  className,
}: SwipeActionPanelProps) {
  const isCompleteAction = direction === 'right';

  // Transform the swipe position to scale the icon
  const scale = useTransform(
    x,
    isCompleteAction
      ? [0, SWIPE_THRESHOLD_PX]
      : [-SWIPE_THRESHOLD_PX, 0],
    isCompleteAction ? [0.7, 1] : [1, 0.7]
  );

  const dynamicOpacity = useTransform(
    x,
    isCompleteAction
      ? [0, SWIPE_THRESHOLD_PX / 2, SWIPE_THRESHOLD_PX]
      : [-SWIPE_THRESHOLD_PX, -SWIPE_THRESHOLD_PX / 2, 0],
    isCompleteAction ? [0, 0.6, 1] : [1, 0.6, 0]
  );

  // Get icon color classes based on action type
  const getIconColorClass = () => {
    if (isCompleteAction) {
      return isCompleted
        ? 'text-amber-500 border-amber-400/60'
        : 'text-emerald-500 border-emerald-400/60';
    }
    return 'text-red-400 border-red-400/60';
  };

  // Get glow shadow based on action type
  const getGlowStyle = () => {
    if (isCompleteAction) {
      return isCompleted
        ? '0 0 16px rgba(245, 158, 11, 0.4)'
        : '0 0 16px rgba(52, 211, 153, 0.4)';
    }
    return '0 0 16px rgba(239, 68, 68, 0.4)';
  };

  // Get the appropriate icon
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />;
    }
    if (isCompleteAction) {
      return isCompleted ? (
        <RotateCcw className="w-5 h-5" strokeWidth={2} />
      ) : (
        <Check className="w-5 h-5" strokeWidth={2} />
      );
    }
    return <Trash2 className="w-5 h-5" strokeWidth={2} />;
  };

  // Get aria label
  const getAriaLabel = () => {
    if (isCompleteAction) {
      return isCompleted ? 'Mark incomplete' : 'Mark complete';
    }
    return 'Delete';
  };

  return (
    <div
      className={cn(
        'absolute inset-y-0 flex items-center justify-center',
        isCompleteAction ? 'left-0' : 'right-0',
        className
      )}
      style={{
        width: `${SWIPE_ACTION_WIDTH_PX}px`,
      }}
    >
      <motion.button
        className={cn(
          'flex items-center justify-center',
          'w-10 h-10 rounded-full',
          'border-2 bg-background/80 backdrop-blur-sm',
          'focus:outline-none',
          'active:scale-90 transition-transform',
          getIconColorClass(),
          isRevealed && 'pointer-events-auto'
        )}
        style={{
          scale: isRevealed ? 1 : scale,
          opacity: isRevealed ? 1 : dynamicOpacity,
          boxShadow: isRevealed ? getGlowStyle() : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoading) {
            onAction();
          }
        }}
        aria-label={getAriaLabel()}
        disabled={isLoading}
      >
        {getIcon()}
      </motion.button>
    </div>
  );
});

/**
 * Swipe action background
 * Shows the colored background behind the swipeable content
 */
export const SwipeActionBackground = memo(function SwipeActionBackground({
  x,
  isCompleted = false,
  className,
}: {
  x: MotionValue<number>;
  isCompleted?: boolean;
  className?: string;
}) {
  // Transform x position to background color with very subtle tints
  const backgroundColor = useTransform(
    x,
    [-SWIPE_THRESHOLD_PX * 1.5, 0, SWIPE_THRESHOLD_PX * 1.5],
    [
      'rgba(239, 68, 68, 0.06)', // Very subtle red for delete
      'rgba(0, 0, 0, 0)', // Transparent at center
      isCompleted
        ? 'rgba(245, 158, 11, 0.06)' // Very subtle amber for uncomplete
        : 'rgba(52, 211, 153, 0.06)', // Very subtle mint for complete
    ]
  );

  return (
    <motion.div
      className={cn(
        'absolute inset-0 rounded-xl pointer-events-none',
        className
      )}
      style={{ backgroundColor }}
    />
  );
});

export default SwipeActionPanel;
