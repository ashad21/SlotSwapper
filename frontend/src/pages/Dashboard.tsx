import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, RefreshCw, Plus, LogOut, Bell, ArrowRightLeft, Trash2, User as UserIcon, LayoutGrid } from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { Event, SwapRequest } from '@/types';
import { getSocket } from '@/lib/socket';
import AddEventModal from '@/components/AddEventModal';
import CalendarView from '@/components/CalendarView';
import EnhancedMarketplace from '@/components/EnhancedMarketplace';
import RequestsView from '@/components/RequestsView';
import UserProfile from '@/components/UserProfile';
import { ThemeToggle } from '@/components/ThemeToggle';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'marketplace' | 'requests' | 'profile'>('calendar');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchData();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    const socket = getSocket();
    if (socket) {
      socket.on('swap-request', () => {
        toast.success('New swap request received!');
        fetchSwapRequests();
      });

      socket.on('swap-response', (data: SwapRequest) => {
        toast.success(`Swap request ${data.status.toLowerCase()}!`);
        fetchData();
      });
    }
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchEvents(), fetchSwapRequests()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
  };

  const fetchSwapRequests = async () => {
    try {
      const response = await api.get('/swap/my-requests');
      setSwapRequests(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch swap requests');
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      await api.put(`/events/${eventId}`, { status: newStatus });
      toast.success('Event status updated!');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning'> = {
      BUSY: 'default',
      SWAPPABLE: 'success',
      SWAP_PENDING: 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const pendingRequests = swapRequests.filter(
    (req) => req.status === 'PENDING' && req.recipient.id === user?.id
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">SlotSwapper</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}!</p>
              </div>
            </button>
            <div className="flex items-center space-x-3">
              {pendingRequests.length > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                </div>
              )}
              <ThemeToggle />
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-card rounded-lg p-1 shadow-sm border border-border">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'calendar'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            My Calendar
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'marketplace'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 inline mr-2" />
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'requests'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <UserIcon className="w-4 h-4 inline mr-2" />
            Profile
          </button>
        </div>

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Events</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  {viewMode === 'list' ? 'Grid View' : 'List View'}
                </Button>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Calendar Grid View */}
            {viewMode === 'grid' && (
              <CalendarView events={events} />
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <>
                {events.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No events yet. Create your first event!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {events.map((event) => (
                      <Card key={event._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{event.title}</CardTitle>
                              <CardDescription className="flex items-center mt-2">
                                <Clock className="w-4 h-4 mr-1" />
                                {format(new Date(event.startTime), 'PPp')} -{' '}
                                {format(new Date(event.endTime), 'p')}
                              </CardDescription>
                            </div>
                            {getStatusBadge(event.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex space-x-2">
                            {event.status === 'BUSY' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(event._id, 'SWAPPABLE')}
                              >
                                Mark as Swappable
                              </Button>
                            )}
                            {event.status === 'SWAPPABLE' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(event._id, 'BUSY')}
                              >
                                Mark as Busy
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <EnhancedMarketplace 
            myEvents={events}
            onSwapRequested={fetchData}
          />
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <RequestsView 
            swapRequests={swapRequests}
            onRequestsUpdated={fetchData}
          />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <UserProfile 
            events={events}
            swapRequests={swapRequests}
          />
        )}
      </main>

      {/* Add Event Modal */}
      <AddEventModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onEventCreated={fetchEvents}
      />
    </div>
  );
};

export default Dashboard;
