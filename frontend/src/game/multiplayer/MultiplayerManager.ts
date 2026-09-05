import { socketClient } from './socketClient';

export interface RemotePlayer {
  uid: string;
  socketId: string;
  username: string;
  title: string;
  level: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  state?: 'IDLE' | 'WALK' | 'SPRINT';
  targetPosition?: [number, number, number];
  targetRotation?: [number, number, number];
  lastUpdateTime?: number;
}

class MultiplayerManager {
  private remotePlayers: Map<string, RemotePlayer> = new Map();
  private onPlayersUpdated: ((players: RemotePlayer[]) => void) | null = null;
  private onChatReceived: ((message: any) => void) | null = null;
  private onMarkerPlaced: ((marker: any) => void) | null = null;

  public initializeListeners() {
    const socket = socketClient.getSocket();
    if (!socket) return;

    socket.on('room_state', (data) => {
      this.remotePlayers.clear();
      data.players.forEach((p: any) => {
        // Don't track self in remote players
        if (p.uid !== socketClient.getSocket()?.auth?.token) { // Rough check, auth token is just token here. better to use context uid.
          this.remotePlayers.set(p.uid, p);
        }
      });
      this.emitPlayersUpdated();
    });

    socket.on('player_joined', (player) => {
      this.remotePlayers.set(player.uid, player);
      this.emitPlayersUpdated();
    });

    socket.on('player_left', (data) => {
      this.remotePlayers.delete(data.uid);
      this.emitPlayersUpdated();
    });

    socket.on('player_moved', (data) => {
      const p = this.remotePlayers.get(data.uid);
      if (p) {
        // Interpolation targets
        if (!p.position) p.position = data.position;
        if (!p.rotation) p.rotation = data.rotation;
        
        p.targetPosition = data.position;
        p.targetRotation = data.rotation;
        p.state = data.state;
        p.lastUpdateTime = performance.now();
      }
    });

    socket.on('player_teleported', (data) => {
      const p = this.remotePlayers.get(data.uid);
      if (p) {
        p.position = data.position;
        p.targetPosition = data.position;
        p.rotation = data.rotation;
        p.targetRotation = data.rotation;
      }
    });

    socket.on('chat_message_received', (msg) => {
      if (this.onChatReceived) this.onChatReceived(msg);
    });

    socket.on('marker_placed', (marker) => {
      if (this.onMarkerPlaced) this.onMarkerPlaced(marker);
    });
  }

  public joinRoom(worldId: string, roomId: string, playerInfo: any) {
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      socket.emit('join_room', { worldId, roomId, playerInfo });
    }
  }

  public emitMovement(position: [number, number, number], rotation: [number, number, number], state: string) {
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      socket.emit('player_move', { position, rotation, state });
    }
  }

  public emitChat(message: string, channel: string, username: string, partyId?: string) {
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      socket.emit('chat_message', { message, channel, username, partyId });
    }
  }

  public emitEmote(emote: string) {
    const socket = socketClient.getSocket();
    if (socket && socket.connected) {
      socket.emit('player_emote', { emote });
    }
  }

  public setOnPlayersUpdated(cb: (players: RemotePlayer[]) => void) {
    this.onPlayersUpdated = cb;
  }

  public setOnChatReceived(cb: (msg: any) => void) {
    this.onChatReceived = cb;
  }

  public setOnMarkerPlaced(cb: (marker: any) => void) {
    this.onMarkerPlaced = cb;
  }

  public getRemotePlayers(): RemotePlayer[] {
    return Array.from(this.remotePlayers.values());
  }

  private emitPlayersUpdated() {
    if (this.onPlayersUpdated) {
      this.onPlayersUpdated(this.getRemotePlayers());
    }
  }

  // Update interpolation loop
  public updateInterpolation(deltaTime: number) {
    this.remotePlayers.forEach(p => {
      if (p.position && p.targetPosition) {
        // Simple linear interpolation
        const lerpFactor = 10 * deltaTime;
        p.position[0] += (p.targetPosition[0] - p.position[0]) * lerpFactor;
        p.position[1] += (p.targetPosition[1] - p.position[1]) * lerpFactor;
        p.position[2] += (p.targetPosition[2] - p.position[2]) * lerpFactor;
      }
      
      if (p.rotation && p.targetRotation) {
        const lerpFactor = 10 * deltaTime;
        p.rotation[0] += (p.targetRotation[0] - p.rotation[0]) * lerpFactor;
        p.rotation[1] += (p.targetRotation[1] - p.rotation[1]) * lerpFactor;
        p.rotation[2] += (p.targetRotation[2] - p.rotation[2]) * lerpFactor;
      }
    });
  }
}

export const multiplayerManager = new MultiplayerManager();
