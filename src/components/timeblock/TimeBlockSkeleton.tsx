import { memo } from 'react';
import { cn } from '@/lib/utils';
import { MIN_BLOCK_HEIGHT_PX } from '@/lib/timeline';

interface TimeBlockSkeletonProps {
  /** Height of the skeleton in pixels */
  height?: number;
  /** Additional class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * TimeBlockSkeleton component
 * Loading placeholder for time blocks
 */
export const TimeBlockSkeleton = memo(function TimeBlockSkeleton({
  height = 60,
  className,
  style,
}: TimeBlockSkeletonProps) {
  const effectiveHeight = Math.max(height, MIN_BLOCK_HEIGHT_PX);

  return (
    <div
      className={cn(
        'rounded-xl border border-border/50 bg-muted/50',
        'animate-pulse overflow-hidden',
        className
      )}
      style={{ height: `${effectiveHeight}px`, ...style }}
    >
      <div className="flex flex-col gap-2 p-3">
        {/* Title placeholder */}
        <div className="h-4 w-3/4 bg-muted-foreground/20 rounded" />

        {/* Time placeholder */}
        {effectiveHeight > 50 && (
          <div className="h-3 w-1/2 bg-muted-foreground/10 rounded" />
        )}
      </div>
    </div>
  );
});

/**
 * Multiple skeleton blocks for loading state
 */
export const TimeBlockSkeletonList = memo(function TimeBlockSkeletonList({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const heights = [60, 90, 45, 120, 60]; // Varied heights for realistic look

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: count }, (_, i) => (
        <TimeBlockSkeleton
          key={i}
          height={heights[i % heights.length]}
          className="opacity-75"
          style={{
            animationDelay: `${i * 100}ms`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

export default TimeBlockSkeleton;
