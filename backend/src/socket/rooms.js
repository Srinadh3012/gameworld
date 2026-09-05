// In-memory room state
const rooms = {};

function setupRooms(io, socket) {
  socket.on('join_room', ({ worldId, roomId, playerInfo }) => {
    const fullRoomId = `${worldId}:${roomId}`;
    socket.join(fullRoomId);
    
    // Initialize room state if it doesn't exist
    if (!rooms[fullRoomId]) {
      rooms[fullRoomId] = {
        worldId,
        roomId,
        players: {},
        createdAt: Date.now()
      };
    }

    // Add player to room state
    const uid = socket.user.uid;
    rooms[fullRoomId].players[uid] = {
      uid,
      socketId: socket.id,
      username: playerInfo.username || 'Explorer',
      title: playerInfo.title || 'Wanderer',
      level: playerInfo.level || 1,
      joinedAt: Date.now()
    };

    socket.currentRoom = fullRoomId;

    // Notify others in the room
    socket.to(fullRoomId).emit('player_joined', rooms[fullRoomId].players[uid]);

    // Send current room state to the joining player
    socket.emit('room_state', {
      players: Object.values(rooms[fullRoomId].players)
    });
    
    console.log(`Player ${uid} joined room ${fullRoomId}`);
  });

  socket.on('leave_room', () => {
    if (socket.currentRoom && rooms[socket.currentRoom]) {
      const uid = socket.user.uid;
      delete rooms[socket.currentRoom].players[uid];
      socket.to(socket.currentRoom).emit('player_left', { uid });
      socket.leave(socket.currentRoom);
      console.log(`Player ${uid} left room ${socket.currentRoom}`);
      socket.currentRoom = null;
    }
  });

  socket.on('disconnect', () => {
    if (socket.currentRoom && rooms[socket.currentRoom]) {
      const uid = socket.user.uid;
      delete rooms[socket.currentRoom].players[uid];
      socket.to(socket.currentRoom).emit('player_left', { uid });
      
      // Clean up empty rooms
      if (Object.keys(rooms[socket.currentRoom].players).length === 0) {
        delete rooms[socket.currentRoom];
      }
    }
  });
}

function getRoomState(fullRoomId) {
  return rooms[fullRoomId];
}

module.exports = setupRooms;
module.exports.getRoomState = getRoomState;
