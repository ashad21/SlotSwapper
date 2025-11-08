import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket?.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
