import { create } from 'zustand';
import { startOfDay } from 'date-fns';
import type { Schedule } from '@/lib/db';

interface TimelineState {
  // Selected date for timeline view
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  goToToday: () => void;

  // Selected block for editing/viewing
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  clearSelection: () => void;

  // Modal states
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;

  isDetailSheetOpen: boolean;
  openDetailSheet: () => void;
  closeDetailSheet: () => void;

  isEditModalOpen: boolean;
  openEditModal: () => void;
  closeEditModal: () => void;

  // Block being edited
  editingBlock: Schedule | null;
  setEditingBlock: (block: Schedule | null) => void;

  // Pre-filled times for create modal (when tapping on timeline)
  prefillStartTime: number | null;
  prefillEndTime: number | null;
  setPrefillTimes: (start: number, end: number) => void;
  clearPrefillTimes: () => void;

  // Scroll state
  scrollPosition: number;
  setScrollPosition: (position: number) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  selectedDate: startOfDay(new Date()),
  selectedBlockId: null,
  isCreateModalOpen: false,
  isDetailSheetOpen: false,
  isEditModalOpen: false,
  editingBlock: null,
  prefillStartTime: null,
  prefillEndTime: null,
  scrollPosition: 0,
};

export const useTimelineStore = create<TimelineState>((set) => ({
  ...initialState,

  // Date navigation
  setSelectedDate: (date) => set({ selectedDate: startOfDay(date) }),
  goToToday: () => set({ selectedDate: startOfDay(new Date()) }),

  // Block selection
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  clearSelection: () => set({ selectedBlockId: null }),

  // Create modal
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () =>
    set({
      isCreateModalOpen: false,
      prefillStartTime: null,
      prefillEndTime: null,
    }),

  // Detail sheet
  openDetailSheet: () => set({ isDetailSheetOpen: true }),
  closeDetailSheet: () => set({ isDetailSheetOpen: false }),

  // Edit modal
  openEditModal: () => set({ isEditModalOpen: true }),
  closeEditModal: () =>
    set({
      isEditModalOpen: false,
      editingBlock: null,
    }),

  // Editing block
  setEditingBlock: (block) => set({ editingBlock: block }),

  // Prefill times
  setPrefillTimes: (start, end) =>
    set({
      prefillStartTime: start,
      prefillEndTime: end,
    }),
  clearPrefillTimes: () =>
    set({
      prefillStartTime: null,
      prefillEndTime: null,
    }),

  // Scroll
  setScrollPosition: (position) => set({ scrollPosition: position }),

  // Reset
  reset: () => set(initialState),
}));

// Selector hooks for common state combinations
export const useSelectedDate = () => useTimelineStore((state) => state.selectedDate);
export const useSelectedBlockId = () => useTimelineStore((state) => state.selectedBlockId);
export const useIsCreateModalOpen = () => useTimelineStore((state) => state.isCreateModalOpen);
export const useIsDetailSheetOpen = () => useTimelineStore((state) => state.isDetailSheetOpen);
export const useIsEditModalOpen = () => useTimelineStore((state) => state.isEditModalOpen);
