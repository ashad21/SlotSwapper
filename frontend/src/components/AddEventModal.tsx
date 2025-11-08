import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Tag } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  open,
  onOpenChange,
  onEventCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    status: 'BUSY' as 'BUSY' | 'SWAPPABLE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    
    if (!formData.startTime) {
      toast.error('Please select start time');
      return;
    }
    
    const start = new Date(formData.startTime);
    let end = formData.endTime ? new Date(formData.endTime) : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
    
    if (formData.endTime && end <= start) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      await api.post('/events', {
        title: formData.title,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        description: formData.description,
        status: formData.status,
      });
      
      toast.success('Event created successfully!');
      onEventCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        status: 'BUSY',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Add a new time slot to your calendar. You can mark it as swappable later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Team Meeting, Lunch Break"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add any additional details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Initial Status
            </Label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="BUSY"
                  checked={formData.status === 'BUSY'}
                  onChange={(e) => setFormData({ ...formData, status: 'BUSY' })}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Busy (Not swappable)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="SWAPPABLE"
                  checked={formData.status === 'SWAPPABLE'}
                  onChange={(e) => setFormData({ ...formData, status: 'SWAPPABLE' })}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Swappable</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
