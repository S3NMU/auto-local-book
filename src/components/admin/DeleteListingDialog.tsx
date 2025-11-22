import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface DeleteListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingTitle: string;
  listingType: 'rental' | 'sale';
  onConfirm: (reason: string, sendEmail: boolean) => Promise<void>;
}

export const DeleteListingDialog = ({
  open,
  onOpenChange,
  listingTitle,
  listingType,
  onConfirm,
}: DeleteListingDialogProps) => {
  const [reason, setReason] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(reason, sendEmail);
      setReason('');
      setSendEmail(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setReason('');
    setSendEmail(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Listing</DialogTitle>
              <DialogDescription className="mt-1">
                You are about to delete the {listingType} listing
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-sm">{listingTitle}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for deletion <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for deleting this listing..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              This reason will be stored and may be shared with the provider.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked as boolean)}
            />
            <Label
              htmlFor="sendEmail"
              className="text-sm font-normal cursor-pointer"
            >
              Send email notification to the provider
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Listing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};