import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

const EventDescriptionModal: React.FC<EventDescriptionModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Event Description
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="font-semibold text-foreground">
            {title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {description || 'No description provided.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDescriptionModal;
