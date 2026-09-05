function setupMovement(io, socket) {
  // Throttled movement updates from client
  socket.on('player_move', (data) => {
    if (!socket.currentRoom) return;

    // data expects: { position: [x, y, z], rotation: [x, y, z], state: 'IDLE' | 'WALK' | 'SPRINT' }
    // Broadcast to everyone else in the room
    socket.to(socket.currentRoom).emit('player_moved', {
      uid: socket.user.uid,
      position: data.position,
      rotation: data.rotation,
      state: data.state
    });
  });

  socket.on('player_teleport', (data) => {
    if (!socket.currentRoom) return;
    
    // Hard teleport, no interpolation
    socket.to(socket.currentRoom).emit('player_teleported', {
      uid: socket.user.uid,
      position: data.position,
      rotation: data.rotation
    });
  });
}

module.exports = setupMovement;
