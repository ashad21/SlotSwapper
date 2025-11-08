import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SwapRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetSlot: Event | null;
  mySwappableSlots: Event[];
  onSwapRequested: () => void;
}

const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  open,
  onOpenChange,
  targetSlot,
  mySwappableSlots,
  onSwapRequested
}) => {
  const [selectedMySlot, setSelectedMySlot] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleRequestSwap = async () => {
    if (!selectedMySlot) {
      toast.error('Please select one of your slots to offer');
      return;
    }

    if (!targetSlot) return;

    setLoading(true);
    try {
      await api.post('/swap/swap-request', {
        mySlotId: selectedMySlot,
        theirSlotId: targetSlot._id,
      });
      toast.success('Swap request sent successfully!');
      onSwapRequested();
      onOpenChange(false);
      setSelectedMySlot('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  if (!targetSlot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Swap</DialogTitle>
          <DialogDescription>
            Choose one of your swappable slots to offer in exchange
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Target Slot */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">They are offering:</h3>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <h4 className="font-semibold text-lg mb-2">{targetSlot.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(targetSlot.startTime), 'PPP')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(targetSlot.startTime), 'p')} - {format(new Date(targetSlot.endTime), 'p')}
                  </span>
                </div>
                {targetSlot.description && (
                  <p className="text-sm text-gray-600 mt-2">{targetSlot.description}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* My Slots Selection */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-2">
              Select your slot to offer: <span className="text-red-500">*</span>
            </h3>
            
            {mySwappableSlots.length === 0 ? (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="py-6 text-center">
                  <p className="text-yellow-800">
                    You need at least one SWAPPABLE slot to request a swap.
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    Go to "My Calendar" and mark an event as "Swappable"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mySwappableSlots.map((slot) => (
                  <label
                    key={slot._id}
                    className={`block cursor-pointer transition-all ${
                      selectedMySlot === slot._id
                        ? 'ring-2 ring-primary'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Card>
                      <CardContent className="py-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="mySlot"
                            value={slot._id}
                            checked={selectedMySlot === slot._id}
                            onChange={(e) => setSelectedMySlot(e.target.value)}
                            className="w-4 h-4 text-primary"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{slot.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(slot.startTime), 'PP')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(slot.startTime), 'p')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedMySlot('');
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestSwap}
              disabled={!selectedMySlot || loading || mySwappableSlots.length === 0}
            >
              {loading ? 'Sending...' : 'Send Swap Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwapRequestModal;
