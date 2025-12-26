import { db, type Context, type Task, type Schedule } from './db';

// Helper for UUIDs
function generateId() {
  return crypto.randomUUID();
}

let isSeeding = false;

export async function seedDatabase() {
  if (isSeeding) return;
  isSeeding = true;

  try {
    const contextCount = await db.contexts.count();
    if (contextCount > 0) return; // Already seeded

    const now = Date.now();

  // 1. Seed Contexts
  const contexts: Context[] = [
    {
      id: generateId(),
      name: 'Work',
      colorHex: '#3b82f6', // Blue-500
      iconId: 'briefcase',
      sortOrder: 0,
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Health',
      colorHex: '#10b981', // Emerald-500
      iconId: 'heart',
      sortOrder: 1,
      createdAt: now,
    },
    {
      id: generateId(),
      name: 'Personal',
      colorHex: '#8b5cf6', // Violet-500
      iconId: 'user',
      sortOrder: 2,
      createdAt: now,
    },
  ];

  await db.contexts.bulkAdd(contexts);

  // 2. Seed Tasks (Inbox)
  const tasks: Task[] = [
    {
      id: generateId(),
      content: 'Review quarterly goals',
      status: 'TODO',
      difficulty: 'HARD',
      iconId: 'target',
      priority: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      content: 'Buy groceries',
      status: 'TODO',
      difficulty: 'EASY',
      iconId: 'shopping-cart',
      priority: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      content: 'Call Mom',
      status: 'TODO',
      difficulty: 'MEDIUM',
      iconId: 'phone',
      priority: 4,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.tasks.bulkAdd(tasks);

  // 3. Seed Schedule (Today)
  const startOfDay = new Date();
  startOfDay.setHours(9, 0, 0, 0);

  const schedules: Schedule[] = [
    {
      id: generateId(),
      title: 'Morning Standup',
      startTimestamp: startOfDay.getTime(),
      endTimestamp: startOfDay.getTime() + 30 * 60 * 1000, // 30 mins
      isLocked: true,
      contextId: contexts[0].id,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      title: 'Deep Work Session',
      startTimestamp: startOfDay.getTime() + 60 * 60 * 1000, // 1 hour later
      endTimestamp: startOfDay.getTime() + 3 * 60 * 60 * 1000, // 2 hours duration
      isLocked: false,
      contextId: contexts[0].id,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.schedules.bulkAdd(schedules);

  console.log('Database seeded successfully!');
  } finally {
    isSeeding = false;
  }
}
