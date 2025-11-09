import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, ArrowRightLeft, CheckCircle, XCircle, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Event, SwapRequest } from '@/types';

interface UserProfileProps {
  events: Event[];
  swapRequests: SwapRequest[];
}

const UserProfile: React.FC<UserProfileProps> = ({ events, swapRequests }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const stats = {
    totalEvents: events.length,
    swappableEvents: events.filter(e => e.status === 'SWAPPABLE').length,
    busyEvents: events.filter(e => e.status === 'BUSY').length,
    pendingSwaps: swapRequests.filter(r => r.status === 'PENDING').length,
    acceptedSwaps: swapRequests.filter(r => r.status === 'ACCEPTED').length,
    rejectedSwaps: swapRequests.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </CardDescription>
                <Badge className="mt-2" variant="success">Active Member</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Settings className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="flex gap-2">
              <Button>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.totalEvents}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Events</p>
                </div>
                <Calendar className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.swappableEvents}</p>
                  <p className="text-sm text-muted-foreground mt-1">Swappable</p>
                </div>
                <ArrowRightLeft className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-muted-foreground">{stats.busyEvents}</p>
                  <p className="text-sm text-muted-foreground mt-1">Busy</p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingSwaps}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pending Swaps</p>
                </div>
                <ArrowRightLeft className="w-8 h-8 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.acceptedSwaps}</p>
                  <p className="text-sm text-muted-foreground mt-1">Accepted</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.rejectedSwaps}</p>
                  <p className="text-sm text-muted-foreground mt-1">Rejected</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Your SlotSwapper journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-semibold">
                {stats.acceptedSwaps + stats.rejectedSwaps > 0
                  ? Math.round((stats.acceptedSwaps / (stats.acceptedSwaps + stats.rejectedSwaps)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Swap Requests</span>
              <span className="font-semibold">{swapRequests.length}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
