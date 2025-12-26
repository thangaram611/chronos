import { memo } from 'react';
import { Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeRange, formatDurationBetween } from '@/lib/timeline';

interface TimeBlockContentProps {
  /** Block title */
  title: string;
  /** Start timestamp */
  startTimestamp: number;
  /** End timestamp */
  endTimestamp: number;
  /** Whether the block is locked */
  isLocked?: boolean;
  /** Compact mode for smaller blocks */
  compact?: boolean;
  /** Whether the block is completed */
  isCompleted?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * TimeBlockContent component
 * Displays the content inside a time block (title, time, duration)
 */
export const TimeBlockContent = memo(function TimeBlockContent({
  title,
  startTimestamp,
  endTimestamp,
  isLocked = false,
  compact = false,
  isCompleted = false,
  className,
}: TimeBlockContentProps) {
  const timeRange = formatTimeRange(startTimestamp, endTimestamp);
  const duration = formatDurationBetween(startTimestamp, endTimestamp);

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-2 min-w-0 px-3 py-2',
        isCompleted && 'pr-16', // Add padding for badge
        className
      )}>
        <span className={cn(
          'font-medium text-sm truncate flex-1',
          isCompleted && 'line-through text-muted-foreground'
        )}>{title}</span>
        {isLocked && (
          <>
            <Lock className="w-3 h-3 shrink-0 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
              {timeRange} ({duration})
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col gap-1 min-w-0 px-3 py-2.5',
      isCompleted && 'pr-20', // Add padding for badge
      className
    )}>
      {/* Header row: title + lock icon */}
      <div className="flex items-center gap-1.5 min-w-0">
        <h3 className={cn(
          'font-medium text-sm leading-tight truncate',
          isCompleted && 'line-through text-muted-foreground'
        )}>
          {title}
        </h3>
        {isLocked && (
          <Lock className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
        )}
      </div>

      {/* Time info */}
      <div className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground',
        isCompleted && 'opacity-70'
      )}>
        <Clock className="w-3 h-3 shrink-0" />
        <span className="truncate">{timeRange}</span>
        <span className="text-muted-foreground/60">·</span>
        <span className="shrink-0">{duration}</span>
      </div>
    </div>
  );
});

/**
 * Minimal block content for very small blocks
 */
export const TimeBlockContentMinimal = memo(function TimeBlockContentMinimal({
  title,
  isCompleted = false,
  isLocked = false,
  startTimestamp,
  endTimestamp,
  className,
}: {
  title: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  startTimestamp?: number;
  endTimestamp?: number;
  className?: string;
}) {
  // For minimal blocks, we might just show start time if locked
  const timeStr = startTimestamp && endTimestamp 
    ? formatTimeRange(startTimestamp, endTimestamp).split(' - ')[0] // Just start time to save space
    : '';

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2 py-1',
      isCompleted && 'pr-8',
      className
    )}>
      <span className={cn(
        'font-medium text-xs truncate flex-1',
        isCompleted && 'line-through text-muted-foreground'
      )}>{title}</span>
      
      {isLocked && (
        <>
          <Lock className="w-2.5 h-2.5 shrink-0 text-muted-foreground" />
          {timeStr && (
            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
              {timeStr}
            </span>
          )}
        </>
      )}
    </div>
  );
});

export default TimeBlockContent;
