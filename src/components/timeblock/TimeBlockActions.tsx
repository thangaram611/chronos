import { memo } from 'react';
import { Check, Pencil, Trash2, Clock, Lock, Unlock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimeBlockActionsProps {
  /** Whether the block is locked */
  isLocked?: boolean;
  /** Whether the block is completed */
  isCompleted?: boolean;
  /** Handler for complete action */
  onComplete?: () => void;
  /** Handler for uncomplete action (toggle back to incomplete) */
  onUncomplete?: () => void;
  /** Handler for edit action */
  onEdit?: () => void;
  /** Handler for delete action */
  onDelete?: () => void;
  /** Handler for reschedule action */
  onReschedule?: () => void;
  /** Handler for toggle lock action */
  onToggleLock?: () => void;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'sm' | 'default';
  /** Additional class name */
  className?: string;
}

/**
 * TimeBlockActions component
 * Quick action buttons for time blocks
 */
export const TimeBlockActions = memo(function TimeBlockActions({
  isLocked = false,
  isCompleted = false,
  onComplete,
  onEdit,
  onDelete,
  onReschedule,
  onToggleLock,
  direction = 'horizontal',
  size = 'default',
  className,
}: TimeBlockActionsProps) {
  const isHorizontal = direction === 'horizontal';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';

  return (
    <div
      className={cn(
        'flex gap-2',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* Complete action */}
      {onComplete && !isCompleted && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonSize,
            'text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30'
          )}
          onClick={onComplete}
          aria-label="Mark as complete"
        >
          <Check className={iconSize} />
        </Button>
      )}

      {/* Edit action */}
      {onEdit && !isLocked && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(buttonSize, 'text-muted-foreground hover:text-foreground')}
          onClick={onEdit}
          aria-label="Edit time block"
        >
          <Pencil className={iconSize} />
        </Button>
      )}

      {/* Reschedule action */}
      {onReschedule && !isLocked && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(buttonSize, 'text-muted-foreground hover:text-foreground')}
          onClick={onReschedule}
          aria-label="Reschedule time block"
        >
          <Clock className={iconSize} />
        </Button>
      )}

      {/* Toggle lock action */}
      {onToggleLock && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonSize,
            isLocked
              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30'
              : 'text-muted-foreground hover:text-foreground'
          )}
          onClick={onToggleLock}
          aria-label={isLocked ? 'Unlock time block' : 'Lock time block'}
        >
          {isLocked ? (
            <Lock className={iconSize} />
          ) : (
            <Unlock className={iconSize} />
          )}
        </Button>
      )}

      {/* Delete action */}
      {onDelete && !isLocked && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            buttonSize,
            'text-destructive hover:text-destructive hover:bg-destructive/10'
          )}
          onClick={onDelete}
          aria-label="Delete time block"
        >
          <Trash2 className={iconSize} />
        </Button>
      )}
    </div>
  );
});

/**
 * Inline quick actions (shown on hover/focus)
 */
export const TimeBlockQuickActions = memo(function TimeBlockQuickActions({
  onComplete,
  onUncomplete,
  onEdit,
  onDelete,
  className,
}: Pick<TimeBlockActionsProps, 'onComplete' | 'onUncomplete' | 'onEdit' | 'onDelete' | 'className'>) {
  return (
    <div
      className={cn(
        'absolute top-1 right-1 flex gap-1',
        'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
        'transition-opacity duration-150',
        className
      )}
    >
      {onComplete && (
        <button
          className="p-1.5 rounded-md bg-card/90 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-muted-foreground hover:text-emerald-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          aria-label="Mark complete"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
      {onUncomplete && (
        <button
          className="p-1.5 rounded-md bg-card/90 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-muted-foreground hover:text-amber-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onUncomplete();
          }}
          aria-label="Mark incomplete"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
      {onEdit && (
        <button
          className="p-1.5 rounded-md bg-card/90 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      {onDelete && (
        <button
          className="p-1.5 rounded-md bg-card/90 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

export default TimeBlockActions;
