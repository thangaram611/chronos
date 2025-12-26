import { memo, useCallback, useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimelineStore } from '@/stores/timeline-store';
import { usePositionedSchedules } from '@/hooks/use-day-schedules';
import { useTimelineScroll, useIsCurrentTimeVisible } from '@/hooks/use-timeline-scroll';
import { useOptimisticScheduleUpdate } from '@/hooks/use-optimistic-update';
import { useContexts } from '@/hooks/use-db';
import { Button } from '@/components/ui/button';
import { TimelineGrid } from './TimelineGrid';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { TimelineScrollContainer, TimelineBlocksContainer } from './TimelineScrollContainer';
import { DaySelector } from './DaySelector';
import { TodayButton } from './TodayButton';
import { SwipeableTimeBlock } from '@/components/timeblock';
import { TimeBlockSkeletonList } from '@/components/timeblock';
import { BlockCreateModal } from './BlockCreateModal';
import { BlockDetailSheet } from './BlockDetailSheet';
import { BlockEditModal } from './BlockEditModal';
import { DeleteConfirmation } from '@/components/timeblock';
import { formatRelativeDay } from '@/lib/timeline';

interface TimelineProps {
  /** Additional class name */
  className?: string;
}

/**
 * Timeline component
 * Main orchestrator for the timeline view
 */
export const Timeline = memo(function Timeline({ className }: TimelineProps) {
  // Store state
  const selectedDate = useTimelineStore((state) => state.selectedDate);
  const setSelectedDate = useTimelineStore((state) => state.setSelectedDate);
  const goToToday = useTimelineStore((state) => state.goToToday);
  const isCreateModalOpen = useTimelineStore((state) => state.isCreateModalOpen);
  const openCreateModal = useTimelineStore((state) => state.openCreateModal);
  const closeCreateModal = useTimelineStore((state) => state.closeCreateModal);
  const prefillStartTime = useTimelineStore((state) => state.prefillStartTime);
  const prefillEndTime = useTimelineStore((state) => state.prefillEndTime);

  // Local state for selected block
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Data hooks
  const { positionedSchedules, isLoading } = usePositionedSchedules(selectedDate);
  const contexts = useContexts();

  // Create context lookup map
  const contextMap = useMemo(() => {
    return new Map(contexts?.map((ctx) => [ctx.id, ctx]) || []);
  }, [contexts]);

  // Scroll management
  const { scrollContainerRef, scrollToCurrentTime } = useTimelineScroll({
    date: selectedDate,
    scrollToCurrentOnMount: true,
  });

  // Track if current time indicator is visible
  const isCurrentTimeVisible = useIsCurrentTimeVisible(scrollContainerRef, selectedDate);

  // CRUD operations
  const { deleteSchedule, completeSchedule, uncompleteSchedule, isPending } = useOptimisticScheduleUpdate();

  // Get the currently selected schedule
  const selectedSchedule = useMemo(() => {
    return positionedSchedules.find((s) => s.id === selectedBlockId) || null;
  }, [positionedSchedules, selectedBlockId]);

  const selectedContext = selectedSchedule?.contextId
    ? contextMap.get(selectedSchedule.contextId)
    : undefined;

  /**
   * Handle block tap
   */
  const handleBlockTap = useCallback((id: string) => {
    setSelectedBlockId(id);
    setIsDetailSheetOpen(true);
  }, []);

  /**
   * Handle edit from detail sheet
   */
  const handleEdit = useCallback(() => {
    setIsDetailSheetOpen(false);
    setIsEditModalOpen(true);
  }, []);

  /**
   * Handle delete from detail sheet
   */
  const handleDeleteRequest = useCallback(() => {
    setIsDetailSheetOpen(false);
    setIsDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedBlockId) return;
    await deleteSchedule(selectedBlockId);
    setIsDeleteDialogOpen(false);
    setSelectedBlockId(null);
  }, [selectedBlockId, deleteSchedule]);

  /**
   * Handle complete
   */
  const handleComplete = useCallback(
    async (id: string) => {
      await completeSchedule(id);
    },
    [completeSchedule]
  );

  /**
   * Handle uncomplete (toggle back to incomplete)
   */
  const handleUncomplete = useCallback(
    async (id: string) => {
      await uncompleteSchedule(id);
    },
    [uncompleteSchedule]
  );

  /**
   * Handle block deletion (for swipe)
   */
  const handleBlockDelete = useCallback(
    async (id: string) => {
      await deleteSchedule(id);
    },
    [deleteSchedule]
  );

  /**
   * Close all sheets/modals
   */
  const handleCloseAll = useCallback(() => {
    setIsDetailSheetOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedBlockId(null);
  }, []);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header with day selector */}
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="px-4 py-3">
          {/* Date title */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">
              {formatRelativeDay(selectedDate)}
            </h1>
            <TodayButton
              selectedDate={selectedDate}
              onGoToToday={() => {
                goToToday();
                setTimeout(() => scrollToCurrentTime(true), 100);
              }}
              className="hidden sm:flex"
            />
          </div>

          {/* Day selector */}
          <DaySelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </header>

      {/* Timeline content */}
      <TimelineScrollContainer ref={scrollContainerRef}>
        {/* Background grid */}
        <TimelineGrid />

        {/* Current time indicator */}
        <CurrentTimeIndicator date={selectedDate} />

        {/* Time blocks */}
        <TimelineBlocksContainer>
          {isLoading ? (
            <TimeBlockSkeletonList count={3} className="px-2" />
          ) : (
            <AnimatePresence mode="popLayout">
              {positionedSchedules.map((schedule) => (
                <SwipeableTimeBlock
                  key={schedule.id}
                  schedule={schedule}
                  position={schedule.position}
                  context={schedule.context}
                  isSelected={schedule.id === selectedBlockId}
                  onClick={() => handleBlockTap(schedule.id)}
                  onComplete={() => handleComplete(schedule.id)}
                  onUncomplete={() => handleUncomplete(schedule.id)}
                  onEdit={() => {
                    setSelectedBlockId(schedule.id);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleBlockDelete(schedule.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </TimelineBlocksContainer>
      </TimelineScrollContainer>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg',
            'hover:shadow-xl transition-shadow'
          )}
          onClick={openCreateModal}
          aria-label="Create new time block"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Floating today button (mobile) - shows when current time is out of view */}
      <TodayButton
        selectedDate={selectedDate}
        onGoToToday={() => {
          goToToday();
          setTimeout(() => scrollToCurrentTime(true), 100);
        }}
        variant="floating"
        isCurrentTimeVisible={isCurrentTimeVisible}
        className="sm:hidden"
      />

      {/* Modals and sheets */}
      <BlockCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        date={selectedDate}
        prefillStartTime={prefillStartTime}
        prefillEndTime={prefillEndTime}
      />

      <BlockDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        schedule={selectedSchedule}
        context={selectedContext}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onComplete={
          selectedSchedule && !selectedSchedule.actualEndTimestamp
            ? () => {
                handleComplete(selectedSchedule.id);
                setIsDetailSheetOpen(false);
              }
            : undefined
        }
        onUncomplete={
          selectedSchedule && selectedSchedule.actualEndTimestamp
            ? () => {
                handleUncomplete(selectedSchedule.id);
                setIsDetailSheetOpen(false);
              }
            : undefined
        }
      />

      <BlockEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlockId(null);
        }}
        schedule={selectedSchedule}
        onUpdated={handleCloseAll}
      />

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedBlockId(null);
        }}
        onConfirm={handleConfirmDelete}
        blockTitle={selectedSchedule?.title}
        isDeleting={isPending}
      />
    </div>
  );
});

export default Timeline;
