import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRightLeft, Clock, Calendar, User, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Event } from '@/types';
import SwapRequestModal from './SwapRequestModal';

interface EnhancedMarketplaceProps {
  myEvents: Event[];
  onSwapRequested: () => void;
}

const EnhancedMarketplace: React.FC<EnhancedMarketplaceProps> = ({ myEvents, onSwapRequested }) => {
  const [availableSlots, setAvailableSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedTargetSlot, setSelectedTargetSlot] = useState<Event | null>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await api.get('/swap/swappable-slots');
      setAvailableSlots(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot: Event) => {
    setSelectedTargetSlot(slot);
    setShowSwapModal(true);
  };

  const handleSwapRequested = () => {
    onSwapRequested();
    fetchAvailableSlots();
  };

  const filteredSlots = searchTerm.trim()
    ? availableSlots.filter(slot =>
        slot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (slot.description && slot.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : availableSlots;

  const mySwappableSlots = myEvents.filter(e => e.status === 'SWAPPABLE');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Marketplace</h2>
          <p className="text-muted-foreground mt-1">Browse and request swaps from other users</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAvailableSlots}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Info Card */}
      {mySwappableSlots.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <ArrowRightLeft className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <p className="font-medium text-yellow-900">
                  You need swappable slots to request swaps
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Go to "My Calendar" → Select an event → Click "Mark as Swappable"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search available slots by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Available Slots Count */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Available Slots ({filteredSlots.length})
        </h3>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </Button>
        )}
      </div>

      {/* Slots Grid */}
      {filteredSlots.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ArrowRightLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {searchTerm
                ? 'No slots match your search'
                : 'No swappable slots available from other users'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-500">
                Other users need to mark their events as "Swappable" for them to appear here.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSlots.map((slot) => (
            <Card key={slot._id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{slot.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {typeof slot.owner === 'object' && slot.owner?.name
                          ? slot.owner.name
                          : 'Unknown User'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(slot.startTime), 'PPP')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(slot.startTime), 'p')} - {format(new Date(slot.endTime), 'p')}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="success">Swappable</Badge>
                </div>
              </CardHeader>
              {slot.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">{slot.description}</p>
                </CardContent>
              )}
              <CardContent className="pt-0">
                <Button
                  onClick={() => handleRequestSwap(slot)}
                  className="w-full"
                  disabled={mySwappableSlots.length === 0}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Request Swap
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Swap Request Modal */}
      <SwapRequestModal
        open={showSwapModal}
        onOpenChange={setShowSwapModal}
        targetSlot={selectedTargetSlot}
        mySwappableSlots={mySwappableSlots}
        onSwapRequested={handleSwapRequested}
      />
    </div>
  );
};

export default EnhancedMarketplace;
