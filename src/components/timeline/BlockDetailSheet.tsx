import { memo } from 'react';
import { Clock, Lock, Calendar, Pencil, Trash2, Check, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { BottomSheet, BottomSheetFooter } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import type { Schedule, Context } from '@/lib/db';
import { formatTimeRange, formatDurationBetween } from '@/lib/timeline';

interface BlockDetailSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Handler to close the sheet */
  onClose: () => void;
  /** The schedule to display */
  schedule: Schedule | null;
  /** Context for the schedule */
  context?: Context;
  /** Handler for edit action */
  onEdit?: () => void;
  /** Handler for delete action */
  onDelete?: () => void;
  /** Handler for complete action */
  onComplete?: () => void;
  /** Handler for uncomplete action (toggle back to incomplete) */
  onUncomplete?: () => void;
}

/**
 * BlockDetailSheet component
 * Bottom sheet showing details of a time block
 */
export const BlockDetailSheet = memo(function BlockDetailSheet({
  isOpen,
  onClose,
  schedule,
  context,
  onEdit,
  onDelete,
  onComplete,
  onUncomplete,
}: BlockDetailSheetProps) {
  if (!schedule) return null;

  const {
    title,
    startTimestamp,
    endTimestamp,
    isLocked,
    actualEndTimestamp,
  } = schedule;

  const isCompleted = !!actualEndTimestamp;
  const timeRange = formatTimeRange(startTimestamp, endTimestamp);
  const duration = formatDurationBetween(startTimestamp, endTimestamp);
  const dateLabel = format(new Date(startTimestamp), 'EEEE, MMMM d');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} maxHeight="60vh">
      <div className="space-y-5 py-2">
        {/* Header section */}
        <div className="space-y-4">
          {/* Context indicator - subtle inline style */}
          {context && (
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: context.colorHex }}
              />
              <span className="text-sm text-muted-foreground">
                {context.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-semibold leading-tight text-foreground">{title}</h2>

          {/* Status indicators - subtle inline style */}
          <div className="flex flex-wrap items-center gap-3">
            {isLocked && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Locked</span>
              </div>
            )}
            {isCompleted && actualEndTimestamp && (
              <div className="flex items-center gap-1.5 text-secondary-foreground/70">
                <Check className="w-4 h-4" />
                <span className="text-sm">
                  Done at{' '}
                  <span className="font-medium tabular-nums">
                    {format(new Date(actualEndTimestamp), 'h:mm a')}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60" />

        {/* Details section */}
        <div className="space-y-3">
          {/* Date */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0 opacity-60" />
            <span className="text-sm">{dateLabel}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0 opacity-60" />
            <span className="text-sm">
              {timeRange}
              <span className="mx-1.5 opacity-40">·</span>
              {duration}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <BottomSheetFooter>
        <div className="flex gap-2">
          {/* Complete/Uncomplete toggle button */}
          {isCompleted ? (
            onUncomplete && (
              <Button
                variant="outline"
                onClick={() => {
                  onUncomplete();
                  onClose();
                }}
                className="flex-1 border-amber-300/50 text-amber-600 hover:text-amber-700 hover:bg-amber-50/50 dark:border-amber-700/50 dark:text-amber-400 dark:hover:bg-amber-900/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Mark Incomplete
              </Button>
            )
          ) : (
            onComplete && (
              <Button
                variant="outline"
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="flex-1 border-emerald-300/50 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:border-emerald-700/50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )
          )}

          {/* Edit button */}
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="flex-1"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}

          {/* Delete button */}
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="shrink-0 border-red-300/50 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:border-red-700/50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </BottomSheetFooter>
    </BottomSheet>
  );
});

export default BlockDetailSheet;
