import Dexie, { type EntityTable } from 'dexie';

// --- Interfaces ---

export interface Schedule {
  id: string; // UUID
  title: string;
  startTimestamp: number; // Unix timestamp
  endTimestamp: number;
  isLocked: boolean;
  contextId?: string;
  recurrenceRule?: string; // RRULE format
  actualStartTimestamp?: number;
  actualEndTimestamp?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: string; // UUID
  scheduleId?: string; // null if in Inbox
  parentTaskId?: string; // For subtasks
  content: string;
  status: 'TODO' | 'DONE' | 'FAILED';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  iconId: string;
  colorHex?: string;
  estimatedMinutes?: number;
  priority: number; // 1-5
  createdAt: number;
  updatedAt: number;
}

export interface Context {
  id: string;
  name: string;
  colorHex: string;
  iconId: string;
  sortOrder: number;
  createdAt: number;
}

export interface EnergyLog {
  id: string;
  timestamp: number;
  level: number; // 1-10
  note?: string;
  createdAt: number;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface Setting {
  key: string; // Primary key
  value: JsonValue;
  updatedAt: number;
}

export interface SyncState {
  id: string;
  lastSyncTimestamp?: number;
  pendingChanges: number;
  googleDriveFileId?: string;
  encryptionKeyHash?: string;
}

// --- Database Class ---

const DB_NAME = 'ChronosDB';

export class ChronosDatabase extends Dexie {
  schedules!: EntityTable<Schedule, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  contexts!: EntityTable<Context, 'id'>;
  energyLogs!: EntityTable<EnergyLog, 'id'>;
  settings!: EntityTable<Setting, 'key'>;
  syncState!: EntityTable<SyncState, 'id'>;

  constructor() {
    super(DB_NAME);

    // Schema definition
    // Note: We only index fields we intend to query by.
    this.version(1).stores({
      schedules: 'id, startTimestamp, endTimestamp, contextId, createdAt',
      tasks: 'id, scheduleId, parentTaskId, status, priority, createdAt',
      contexts: 'id, name, sortOrder',
      energyLogs: 'id, timestamp',
      settings: 'key',
      syncState: 'id',
    });
  }
}

export const db = new ChronosDatabase();
