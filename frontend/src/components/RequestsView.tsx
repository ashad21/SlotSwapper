import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, ArrowRightLeft, CheckCircle, XCircle, Loader, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { SwapRequest } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface RequestsViewProps {
  swapRequests: SwapRequest[];
  onRequestsUpdated: () => void;
}

const RequestsView: React.FC<RequestsViewProps> = ({ swapRequests, onRequestsUpdated }) => {
  const { user } = useAuth();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Debug: Log swap requests
  console.log('RequestsView - Total swap requests:', swapRequests.length);
  console.log('RequestsView - Current user ID:', user?.id);
  console.log('RequestsView - Swap requests:', swapRequests);

  const handleSwapResponse = async (requestId: string, accept: boolean) => {
    setRespondingTo(requestId);
    try {
      await api.post(`/swap/swap-response/${requestId}`, { accept });
      toast.success(accept ? 'Swap accepted!' : 'Swap rejected!');
      onRequestsUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to respond to swap request');
    } finally {
      setRespondingTo(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setCancelling(requestId);
    try {
      await api.delete(`/swap/swap-request/${requestId}`);
      toast.success('Swap request cancelled!');
      onRequestsUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel swap request');
    } finally {
      setCancelling(null);
    }
  };

  // Helper function to get user ID from user object or string
  const getUserId = (userField: any): string => {
    if (!userField) return '';
    if (typeof userField === 'string') return userField;
    return userField.id || userField._id || '';
  };

  const incomingRequests = swapRequests.filter((req) => {
    const recipientId = getUserId(req.recipient);
    const isIncoming = req.status === 'PENDING' && recipientId === user?.id;
    console.log('Checking incoming:', { recipientId, userId: user?.id, isIncoming, req });
    return isIncoming;
  });

  const outgoingRequests = swapRequests.filter((req) => {
    const requesterId = getUserId(req.requester);
    const isOutgoing = requesterId === user?.id;
    console.log('Checking outgoing:', { requesterId, userId: user?.id, isOutgoing, req });
    return isOutgoing;
  });

  console.log('Incoming requests:', incomingRequests.length);
  console.log('Outgoing requests:', outgoingRequests.length);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'success' | 'warning', icon: React.ReactNode }> = {
      PENDING: { variant: 'warning', icon: <Clock className="w-3 h-3" /> },
      ACCEPTED: { variant: 'success', icon: <CheckCircle className="w-3 h-3" /> },
      REJECTED: { variant: 'default', icon: <XCircle className="w-3 h-3" /> },
    };
    const config = variants[status] || variants.PENDING;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Swap Requests</h2>
        <p className="text-muted-foreground mt-1">Manage your incoming and outgoing swap requests</p>
      </div>

      {/* Incoming Requests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">
            Incoming Requests ({incomingRequests.length})
          </h3>
        </div>

        {incomingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No incoming swap requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {incomingRequests.map((request) => (
              <Card key={request._id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        From {typeof request.requester === 'object' ? request.requester?.name : 'User'}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(request.createdAt), 'PPp')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">THEY OFFER</p>
                      <h4 className="font-semibold text-foreground">{request.requesterSlot?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.requesterSlot?.startTime && format(new Date(request.requesterSlot.startTime), 'PPp')}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">YOUR SLOT</p>
                      <h4 className="font-semibold text-foreground">{request.recipientSlot?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.recipientSlot?.startTime && format(new Date(request.recipientSlot.startTime), 'PPp')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSwapResponse(request._id, true)}
                      disabled={respondingTo === request._id}
                      className="flex-1"
                    >
                      {respondingTo === request._id ? <Loader className="w-4 h-4 animate-spin" /> : 'Accept'}
                    </Button>
                    <Button
                      onClick={() => handleSwapResponse(request._id, false)}
                      disabled={respondingTo === request._id}
                      variant="outline"
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">
            Outgoing Requests ({outgoingRequests.length})
          </h3>
        </div>

        {outgoingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No outgoing swap requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {outgoingRequests.map((request) => (
              <Card key={request._id} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        To {typeof request.recipient === 'object' ? request.recipient?.name : 'User'}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(request.createdAt), 'PPp')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">YOU OFFERED</p>
                      <h4 className="font-semibold text-foreground">{request.requesterSlot?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.requesterSlot?.startTime && format(new Date(request.requesterSlot.startTime), 'PPp')}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">FOR THEIR SLOT</p>
                      <h4 className="font-semibold text-foreground">{request.recipientSlot?.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.recipientSlot?.startTime && format(new Date(request.recipientSlot.startTime), 'PPp')}
                      </p>
                    </div>
                  </div>
                  {request.status === 'PENDING' && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm text-yellow-800">Waiting for response...</p>
                      </div>
                      <Button
                        onClick={() => handleCancelRequest(request._id)}
                        disabled={cancelling === request._id}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        {cancelling === request._id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin mr-2" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel Request
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsView;
