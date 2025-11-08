import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock, User, ArrowRightLeft, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Event } from '@/types';

interface MarketplaceViewProps {
  myEvents: Event[];
  onSwapRequested: () => void;
}

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ myEvents, onSwapRequested }) => {
  const [availableSlots, setAvailableSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMySlot, setSelectedMySlot] = useState<string>('');

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/swap/swappable-slots');
      const slots = response.data.data || [];
      // Filter out your own slots
      const othersSlots = slots.filter((slot: Event) => slot.owner && typeof slot.owner === 'object' && slot.owner.id !== myEvents[0]?.owner);
      setAvailableSlots(othersSlots);
    } catch (error) {
      toast.error('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async (theirSlotId: string) => {
    if (!selectedMySlot) {
      toast.error('Please select one of your swappable slots first');
      return;
    }

    try {
      await api.post('/swap/swap-request', {
        mySlotId: selectedMySlot,
        theirSlotId: theirSlotId,
      });
      toast.success('Swap request sent successfully!');
      onSwapRequested();
      setSelectedMySlot('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    }
  };

  const filteredSlots = searchTerm.trim() 
    ? availableSlots.filter(slot =>
        slot.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableSlots;

  const mySwappableSlots = myEvents.filter(e => e.status === 'SWAPPABLE');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketplace</h2>
        <p className="text-gray-600">Browse and request swaps from other users</p>
      </div>

      {/* My Swappable Slots Selection */}
      {mySwappableSlots.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Select Your Slot to Swap
            </CardTitle>
            <CardDescription>Choose which of your slots you want to offer in exchange</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {mySwappableSlots.map((slot) => (
                <label
                  key={slot._id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMySlot === slot._id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="mySlot"
                    value={slot._id}
                    checked={selectedMySlot === slot._id}
                    onChange={(e) => setSelectedMySlot(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{slot.title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(slot.startTime), 'PPp')}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {mySwappableSlots.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-6">
            <div className="text-center">
              <p className="text-yellow-800 font-medium mb-2">
                You need to mark at least one of your events as "Swappable" before you can request swaps.
              </p>
              <p className="text-sm text-yellow-700">
                Go to "My Calendar" tab → Find an event → Click "Mark as Swappable"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search available slots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Available Slots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Available Slots ({filteredSlots.length})
          </h3>
        </div>

        {filteredSlots.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ArrowRightLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {searchTerm ? 'No slots match your search' : 'No swappable slots available from other users'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-500">
                  Other users need to mark their events as "Swappable" for them to appear here.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredSlots.map((slot) => (
              <Card key={slot._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{slot.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {typeof slot.owner === 'object' && slot.owner?.name ? slot.owner.name : 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(parseISO(slot.startTime), 'PPp')}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="success">Swappable</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Duration: {format(parseISO(slot.startTime), 'HH:mm')} - {format(parseISO(slot.endTime), 'HH:mm')}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSwapRequest(slot._id)}
                      disabled={!selectedMySlot}
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Request Swap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceView;
