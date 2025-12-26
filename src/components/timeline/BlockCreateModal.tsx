import { memo, useState, useCallback, useEffect } from 'react';
import { Plus, Lock, AlertCircle } from 'lucide-react';
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
import { formatDuration } from '@/lib/timeline';

interface BlockCreateModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler to close the modal */
  onClose: () => void;
  /** Selected date for the new block */
  date: Date;
  /** Prefilled start time (timestamp) */
  prefillStartTime?: number | null;
  /** Prefilled end time (timestamp) */
  prefillEndTime?: number | null;
  /** Callback after successful creation */
  onCreated?: (id: string) => void;
}

/**
 * BlockCreateModal component
 * Modal for creating a new time block
 */
export const BlockCreateModal = memo(function BlockCreateModal({
  isOpen,
  onClose,
  date,
  prefillStartTime,
  prefillEndTime,
  onCreated,
}: BlockCreateModalProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [contextId, setContextId] = useState<string | undefined>();
  const [isLocked, setIsLocked] = useState(false);
  const [startTime, setStartTime] = useState({ hours: 9, minutes: 0 });
  const [endTime, setEndTime] = useState({ hours: 10, minutes: 0 });

  // Get existing schedules for validation
  const schedules = useDaySchedules(date) || [];

  // Validation
  const dayStart = startOfDay(date).getTime();
  const startTimestamp = dayStart + startTime.hours * 60 * 60 * 1000 + startTime.minutes * 60 * 1000;
  const endTimestamp = dayStart + endTime.hours * 60 * 60 * 1000 + endTime.minutes * 60 * 1000;

  const { validate } = useTimeValidation({
    existingSchedules: schedules,
    minDuration: 15,
    allowPastTimes: true, // Allow creating blocks in the past for today
  });

  const validation = validate(startTimestamp, endTimestamp);

  // Duration
  const durationMinutes = Math.max(0, (endTimestamp - startTimestamp) / 60000);

  // Optimistic update
  const { createSchedule, isPending } = useOptimisticScheduleUpdate();

  /**
   * Initialize form with prefilled values
   */
  useEffect(() => {
    if (prefillStartTime) {
      const start = new Date(prefillStartTime);
      setStartTime({ hours: start.getHours(), minutes: start.getMinutes() });
    }
    if (prefillEndTime) {
      const end = new Date(prefillEndTime);
      setEndTime({ hours: end.getHours(), minutes: end.getMinutes() });
    }
  }, [prefillStartTime, prefillEndTime]);

  /**
   * Reset form when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      if (!prefillStartTime) {
        // Default to current hour + 1
        const now = new Date();
        const nextHour = now.getHours() + 1;
        setStartTime({ hours: nextHour % 24, minutes: 0 });
        setEndTime({ hours: (nextHour + 1) % 24, minutes: 0 });
      }
      setTitle('');
      setContextId(undefined);
      setIsLocked(false);
    }
  }, [isOpen, prefillStartTime]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !validation.isValid) return;

    const id = await createSchedule({
      title: title.trim(),
      startTimestamp,
      endTimestamp,
      isLocked,
      contextId,
    });

    if (id) {
      onCreated?.(id);
      onClose();
    }
  }, [
    title,
    startTimestamp,
    endTimestamp,
    isLocked,
    contextId,
    validation.isValid,
    createSchedule,
    onCreated,
    onClose,
  ]);

  /**
   * Handle start time change (auto-adjust end time)
   */
  const handleStartTimeChange = useCallback(
    (newStart: { hours: number; minutes: number }) => {
      setStartTime(newStart);

      // Auto-adjust end time to maintain at least 1 hour duration
      const newStartTimestamp =
        dayStart + newStart.hours * 60 * 60 * 1000 + newStart.minutes * 60 * 1000;
      const currentDuration = endTimestamp - startTimestamp;
      const minDuration = 60 * 60 * 1000; // 1 hour

      if (newStartTimestamp >= endTimestamp || currentDuration < minDuration) {
        const newEndTimestamp = newStartTimestamp + minDuration;
        const newEnd = new Date(newEndTimestamp);
        setEndTime({ hours: newEnd.getHours() % 24, minutes: newEnd.getMinutes() });
      }
    },
    [dayStart, startTimestamp, endTimestamp]
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="New Time Block"
      maxHeight="85vh"
    >
      <div className="space-y-6 py-4">
        {/* Title input */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="What are you working on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
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
                <TimePicker value={startTime} onChange={handleStartTimeChange} />
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
            <Label htmlFor="lock-toggle" className="cursor-pointer">
              Lock this block
            </Label>
            <p className="text-xs text-muted-foreground">
              Locked blocks won’t respond to swipe actions
            </p>
          </div>
          <button
            id="lock-toggle"
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
          disabled={!title.trim() || !validation.isValid || isPending}
        >
          {isPending ? (
            'Creating...'
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Block
            </>
          )}
        </Button>
      </BottomSheetFooter>
    </BottomSheet>
  );
});

export default BlockCreateModal;
