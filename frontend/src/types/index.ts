export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  owner: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface SwapRequest {
  _id: string;
  requester: User;
  requesterSlot: Event;
  recipient: User;
  recipientSlot: Event;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
