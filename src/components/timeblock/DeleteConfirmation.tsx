import { memo } from 'react';
import { Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Handler to close the dialog */
  onClose: () => void;
  /** Handler for confirm delete */
  onConfirm: () => void;
  /** Title of the block being deleted */
  blockTitle?: string;
  /** Whether delete is in progress */
  isDeleting?: boolean;
}

/**
 * DeleteConfirmation component
 * Confirmation dialog for deleting a time block
 */
export const DeleteConfirmation = memo(function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  blockTitle,
  isDeleting = false,
}: DeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Time Block</DialogTitle>
          <DialogDescription className="text-center">
            {blockTitle ? (
              <>
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">"{blockTitle}"</span>?
              </>
            ) : (
              'Are you sure you want to delete this time block?'
            )}
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

/**
 * Inline delete confirmation (for swipe actions)
 * Shows a compact confirmation within the swipe area
 */
export const InlineDeleteConfirmation = memo(function InlineDeleteConfirmation({
  onConfirm,
  onCancel,
  className,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-end gap-2 px-4 py-2 bg-destructive/10 rounded-xl ${className}`}
    >
      <span className="text-sm text-destructive font-medium mr-auto">
        Delete this block?
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="h-8 px-3"
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onConfirm}
        className="h-8 px-3"
      >
        Delete
      </Button>
    </div>
  );
});

export default DeleteConfirmation;
