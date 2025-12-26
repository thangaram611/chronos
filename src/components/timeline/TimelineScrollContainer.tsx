import { memo, forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TIMELINE_HEIGHT_PX, TIME_GUTTER_WIDTH_PX } from '@/lib/timeline';

interface TimelineScrollContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * TimelineScrollContainer component
 * Scrollable container for the timeline with GPU acceleration
 */
export const TimelineScrollContainer = memo(
  forwardRef<HTMLDivElement, TimelineScrollContainerProps>(
    function TimelineScrollContainer({ children, className }, ref) {
      return (
        <div
          ref={ref}
          data-timeline-scroll
          className={cn(
            'relative flex-1 overflow-y-auto overflow-x-hidden',
            'gpu-scroll touch-pan-y',
            className
          )}
        >
          {/* Timeline content area */}
          <div
            className="relative"
            style={{
              height: `${TIMELINE_HEIGHT_PX}px`,
              minHeight: `${TIMELINE_HEIGHT_PX}px`,
            }}
          >
            {children}
          </div>
        </div>
      );
    }
  )
);

/**
 * TimelineBlocksContainer component
 * Container for positioning time blocks
 */
export const TimelineBlocksContainer = memo(function TimelineBlocksContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 z-10',
        className
      )}
      style={{
        left: `${TIME_GUTTER_WIDTH_PX}px`,
        right: '8px', // Right padding
      }}
    >
      {children}
    </div>
  );
});

export default TimelineScrollContainer;
