import { memo, useState, useCallback, useEffect } from 'react';
import { Save, Lock, AlertCircle } from 'lucide-react';
import { startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { BottomSheet, BottomSheetFooter } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimePicker } from './TimePicker';
import { ContextSelector } from './ContextSelector';
import { useTimeValidation } from '@/hooks/use-time-validation';
import { useOptimisticScheduleUpdate } from '@/hooks/use-optimistic-update';
import { useDaySchedules } from '@/hooks/use-day-schedules';
import type { Schedule } from '@/lib/db';
import { formatDuration } from '@/lib/timeline';

interface BlockEditModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler to close the modal */
  onClose: () => void;
  /** The schedule being edited */
  schedule: Schedule | null;
  /** Callback after successful update */
  onUpdated?: () => void;
}

/**
 * BlockEditModal component
 * Modal for editing an existing time block
 */
export const BlockEditModal = memo(function BlockEditModal({
  isOpen,
  onClose,
  schedule,
  onUpdated,
}: BlockEditModalProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [contextId, setContextId] = useState<string | undefined>();
  const [isLocked, setIsLocked] = useState(false);
  const [startTime, setStartTime] = useState({ hours: 9, minutes: 0 });
  const [endTime, setEndTime] = useState({ hours: 10, minutes: 0 });

  // Get the date from the schedule
  const date = schedule ? new Date(schedule.startTimestamp) : new Date();
  const dayStart = startOfDay(date).getTime();

  // Get existing schedules for validation
  const schedules = useDaySchedules(date) || [];

  // Calculate timestamps
  const startTimestamp = dayStart + startTime.hours * 60 * 60 * 1000 + startTime.minutes * 60 * 1000;
  const endTimestamp = dayStart + endTime.hours * 60 * 60 * 1000 + endTime.minutes * 60 * 1000;

  // Validation (exclude current schedule from conflict check)
  const { validate } = useTimeValidation({
    existingSchedules: schedules,
    minDuration: 15,
    allowPastTimes: true,
    excludeId: schedule?.id,
  });

  const validation = validate(startTimestamp, endTimestamp);

  // Duration
  const durationMinutes = Math.max(0, (endTimestamp - startTimestamp) / 60000);

  // Optimistic update
  const { updateSchedule, isPending } = useOptimisticScheduleUpdate();

  /**
   * Initialize form with schedule values
   */
  useEffect(() => {
    if (schedule && isOpen) {
      setTitle(schedule.title);
      setContextId(schedule.contextId);
      setIsLocked(schedule.isLocked);

      const start = new Date(schedule.startTimestamp);
      const end = new Date(schedule.endTimestamp);

      setStartTime({ hours: start.getHours(), minutes: start.getMinutes() });
      setEndTime({ hours: end.getHours(), minutes: end.getMinutes() });
    }
  }, [schedule, isOpen]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!schedule || !title.trim() || !validation.isValid) return;

    const success = await updateSchedule(schedule.id, {
      title: title.trim(),
      startTimestamp,
      endTimestamp,
      isLocked,
      contextId,
    });

    if (success) {
      onUpdated?.();
      onClose();
    }
  }, [
    schedule,
    title,
    startTimestamp,
    endTimestamp,
    isLocked,
    contextId,
    validation.isValid,
    updateSchedule,
    onUpdated,
    onClose,
  ]);

  /**
   * Check if form has changes
   */
  const hasChanges = schedule
    ? title !== schedule.title ||
      contextId !== schedule.contextId ||
      isLocked !== schedule.isLocked ||
      startTimestamp !== schedule.startTimestamp ||
      endTimestamp !== schedule.endTimestamp
    : false;

  if (!schedule) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Time Block"
      maxHeight="85vh"
    >
      <div className="space-y-6 py-4">
        {/* Title input */}
        <div className="space-y-2">
          <Label htmlFor="edit-title">Title</Label>
          <Input
            id="edit-title"
            placeholder="What are you working on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
        </div>

        {/* Time pickers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Time</Label>
            <span className="text-sm text-muted-foreground">
              {formatDuration(durationMinutes)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start time */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Start
              </span>
              <div className="bg-muted/50 rounded-lg p-3">
                <TimePicker value={startTime} onChange={setStartTime} />
              </div>
            </div>

            {/* End time */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                End
              </span>
              <div className="bg-muted/50 rounded-lg p-3">
                <TimePicker value={endTime} onChange={setEndTime} />
              </div>
            </div>
          </div>

          {/* Validation errors */}
          {validation.errors.length > 0 && (
            <div className="space-y-1">
              {validation.errors.map((error, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    error.type === 'overlap'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-destructive'
                  )}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context selector */}
        <ContextSelector value={contextId} onChange={setContextId} />

        {/* Lock toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="edit-lock-toggle" className="cursor-pointer">
              Lock this block
            </Label>
            <p className="text-xs text-muted-foreground">
              Locked blocks won’t respond to swipe actions
            </p>
          </div>
          <button
            id="edit-lock-toggle"
            type="button"
            role="switch"
            aria-checked={isLocked}
            onClick={() => setIsLocked(!isLocked)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full',
              'transition-colors duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isLocked ? 'bg-amber-500' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm',
                'transition-transform duration-200',
                isLocked ? 'translate-x-5' : 'translate-x-0.5'
              )}
            >
              {isLocked && <Lock className="w-3 h-3 text-amber-500" />}
            </span>
          </button>
        </div>
      </div>

      <BottomSheetFooter className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={!title.trim() || !validation.isValid || !hasChanges || isPending}
        >
          {isPending ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </BottomSheetFooter>
    </BottomSheet>
  );
});

export default BlockEditModal;
