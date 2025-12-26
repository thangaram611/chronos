import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { db, type Schedule } from '@/lib/db';

interface OptimisticUpdateState<T> {
  /** Original data before optimistic update */
  original: T | null;
  /** Whether an optimistic update is in progress */
  isPending: boolean;
  /** Any error that occurred */
  error: Error | null;
}

/**
 * Hook for managing optimistic updates to schedules
 */
export function useOptimisticScheduleUpdate() {
  const [state, setState] = useState<OptimisticUpdateState<Schedule>>({
    original: null,
    isPending: false,
    error: null,
  });

  /**
   * Create a new schedule optimistically
   */
  const createSchedule = useCallback(
    async (
      schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<string | null> => {
      const id = crypto.randomUUID();
      const now = Date.now();

      const newSchedule: Schedule = {
        ...schedule,
        id,
        createdAt: now,
        updatedAt: now,
      };

      setState({ original: null, isPending: true, error: null });

      try {
        await db.schedules.add(newSchedule);
        setState({ original: null, isPending: false, error: null });
        toast.success('Time block created');
        return id;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to create');
        setState({ original: null, isPending: false, error: err });
        toast.error('Failed to create time block');
        return null;
      }
    },
    []
  );

  /**
   * Update a schedule optimistically
   */
  const updateSchedule = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Schedule, 'id' | 'createdAt'>>
    ): Promise<boolean> => {
      // Get original for rollback
      const original = await db.schedules.get(id);
      if (!original) {
        toast.error('Schedule not found');
        return false;
      }

      setState({ original, isPending: true, error: null });

      try {
        await db.schedules.update(id, {
          ...updates,
          updatedAt: Date.now(),
        });
        setState({ original: null, isPending: false, error: null });
        toast.success('Time block updated');
        return true;
      } catch (error) {
        // Rollback on error
        await db.schedules.put(original);
        const err = error instanceof Error ? error : new Error('Failed to update');
        setState({ original: null, isPending: false, error: err });
        toast.error('Failed to update time block');
        return false;
      }
    },
    []
  );

  /**
   * Delete a schedule optimistically
   */
  const deleteSchedule = useCallback(async (id: string): Promise<boolean> => {
    // Get original for rollback
    const original = await db.schedules.get(id);
    if (!original) {
      toast.error('Schedule not found');
      return false;
    }

    setState({ original, isPending: true, error: null });

    try {
      await db.schedules.delete(id);
      setState({ original: null, isPending: false, error: null });
      toast.success('Time block deleted');
      return true;
    } catch (error) {
      // Rollback on error
      await db.schedules.put(original);
      const err = error instanceof Error ? error : new Error('Failed to delete');
      setState({ original: null, isPending: false, error: err });
      toast.error('Failed to delete time block');
      return false;
    }
  }, []);

  /**
   * Mark a schedule as completed
   */
  const completeSchedule = useCallback(
    async (id: string): Promise<boolean> => {
      const now = Date.now();
      return updateSchedule(id, {
        actualEndTimestamp: now,
      });
    },
    [updateSchedule]
  );

  /**
   * Mark a schedule as incomplete (toggle back)
   */
  const uncompleteSchedule = useCallback(
    async (id: string): Promise<boolean> => {
      return updateSchedule(id, {
        actualEndTimestamp: undefined,
      });
    },
    [updateSchedule]
  );

  /**
   * Toggle schedule lock status
   */
  const toggleLock = useCallback(
    async (id: string, currentLockState: boolean): Promise<boolean> => {
      return updateSchedule(id, {
        isLocked: !currentLockState,
      });
    },
    [updateSchedule]
  );

  return {
    ...state,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    completeSchedule,
    uncompleteSchedule,
    toggleLock,
  };
}

/**
 * Hook for batch operations on schedules
 */
export function useScheduleBatchOperations() {
  const [isPending, setIsPending] = useState(false);

  /**
   * Delete multiple schedules
   */
  const deleteMultiple = useCallback(async (ids: string[]): Promise<boolean> => {
    if (ids.length === 0) return true;

    setIsPending(true);

    try {
      await db.schedules.bulkDelete(ids);
      toast.success(`Deleted ${ids.length} time block(s)`);
      return true;
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete time blocks');
      return false;
    } finally {
      setIsPending(false);
    }
  }, []);

  /**
   * Reschedule multiple schedules by a time offset
   */
  const rescheduleMultiple = useCallback(
    async (ids: string[], offsetMs: number): Promise<boolean> => {
      if (ids.length === 0) return true;

      setIsPending(true);

      try {
        const schedules = await db.schedules.bulkGet(ids);
        const updates = schedules
          .filter((s): s is Schedule => s !== undefined)
          .map((schedule) => ({
            ...schedule,
            startTimestamp: schedule.startTimestamp + offsetMs,
            endTimestamp: schedule.endTimestamp + offsetMs,
            updatedAt: Date.now(),
          }));

        await db.schedules.bulkPut(updates);
        toast.success(`Rescheduled ${updates.length} time block(s)`);
        return true;
      } catch (error) {
        console.error(error);
        toast.error('Failed to reschedule time blocks');
        return false;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return {
    isPending,
    deleteMultiple,
    rescheduleMultiple,
  };
}
