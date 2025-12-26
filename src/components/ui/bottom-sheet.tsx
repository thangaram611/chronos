import {
  memo,
  forwardRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SPRING_CONFIG } from '@/lib/timeline';

interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Handler to close the sheet */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Sheet content */
  children: ReactNode;
  /** Maximum height (e.g., "90vh", "80%") */
  maxHeight?: string;
  /** Whether to show the drag handle */
  showHandle?: boolean;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Additional class name for the sheet */
  className?: string;
  /** Additional class name for the content */
  contentClassName?: string;
}

const DRAG_CLOSE_THRESHOLD = 100;
const DRAG_VELOCITY_THRESHOLD = 500;

/**
 * BottomSheet component
 * Mobile-first sheet that slides up from the bottom
 */
export const BottomSheet = memo(
  forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet(
    {
      isOpen,
      onClose,
      title,
      children,
      maxHeight = '90vh',
      showHandle = true,
      showCloseButton = true,
      className,
      contentClassName,
    },
    ref
  ) {
    const dragControls = useDragControls();

    /**
     * Handle drag end
     */
    const handleDragEnd = useCallback(
      (_: unknown, info: PanInfo) => {
        const { offset, velocity } = info;

        // Close if dragged down past threshold or with enough velocity
        if (
          offset.y > DRAG_CLOSE_THRESHOLD ||
          velocity.y > DRAG_VELOCITY_THRESHOLD
        ) {
          onClose();
        }
      },
      [onClose]
    );

    /**
     * Handle escape key
     */
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    /**
     * Prevent body scroll when open
     */
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              ref={ref}
              className={cn(
                'fixed inset-x-0 bottom-0 z-50',
                'bg-background rounded-t-2xl shadow-2xl',
                'flex flex-col',
                'gpu-accelerated',
                className
              )}
              style={{ maxHeight }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={SPRING_CONFIG}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'sheet-title' : undefined}
            >
              {/* Drag handle */}
              {showHandle && (
                <div
                  className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>
              )}

              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-4 pb-2">
                  {title && (
                    <h2
                      id="sheet-title"
                      className="text-lg font-semibold"
                    >
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      className={cn(
                        'p-2 -mr-2 rounded-full',
                        'text-muted-foreground hover:text-foreground',
                        'hover:bg-accent transition-colors',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        !title && 'ml-auto'
                      )}
                      onClick={onClose}
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                className={cn(
                  'flex-1 overflow-y-auto px-4 pb-safe',
                  contentClassName
                )}
              >
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  })
);

/**
 * BottomSheetHeader component
 */
export const BottomSheetHeader = memo(function BottomSheetHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('pb-4 border-b border-border', className)}>
      {children}
    </div>
  );
});

/**
 * BottomSheetFooter component
 */
export const BottomSheetFooter = memo(function BottomSheetFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'sticky bottom-0 pt-4 pb-4 mt-auto',
        'bg-background border-t border-border',
        '-mx-4 px-4',
        className
      )}
    >
      {children}
    </div>
  );
});

export default BottomSheet;
