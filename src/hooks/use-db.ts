import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useSchedules(startDate?: number, endDate?: number) {
  return useLiveQuery(async () => {
    if (startDate && endDate) {
      return await db.schedules.where('startTimestamp').between(startDate, endDate).toArray();
    }
    return await db.schedules.toArray();
  }, [startDate, endDate]);
}

export function useTasks(scheduleId?: string) {
  return useLiveQuery(async () => {
    if (scheduleId) {
      return await db.tasks.where('scheduleId').equals(scheduleId).toArray();
    }
    // Return inbox tasks (no scheduleId) by default if no ID provided, or maybe all?
    // Let's interpret 'useTasks()' as fetching all, and 'useTasks(id)' as filtering.
    // However, usually we want inbox tasks specifically.
    // Let's stick to simple filtering for now.
    return await db.tasks.toArray();
  }, [scheduleId]);
}

export function useInboxTasks() {
  return useLiveQuery(async () => {
    return await db.tasks.filter((task) => !task.scheduleId).sortBy('priority'); // Higher priority first? Or just sort by some field.
  });
}

export function useContexts() {
  return useLiveQuery(async () => {
    return await db.contexts.orderBy('sortOrder').toArray();
  });
}
