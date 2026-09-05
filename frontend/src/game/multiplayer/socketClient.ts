import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private isConnecting: boolean = false;

  public async connect(token: string) {
    this.token = token;
    
    if (this.socket?.connected || this.isConnecting) return;
    this.isConnecting = true;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = new SocketClient();
