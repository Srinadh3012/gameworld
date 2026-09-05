// Chat rate limiting storage
const rateLimits = new Map();

function checkRateLimit(uid) {
  const now = Date.now();
  if (rateLimits.has(uid)) {
    const lastMsgTime = rateLimits.get(uid);
    if (now - lastMsgTime < 1000) { // 1 message per second limit
      return false; 
    }
  }
  rateLimits.set(uid, now);
  return true;
}

function setupSocial(io, socket) {
  // Emotes
  socket.on('player_emote', (data) => {
    if (!socket.currentRoom) return;
    
    // Broadcast emote
    socket.to(socket.currentRoom).emit('player_emoted', {
      uid: socket.user.uid,
      emote: data.emote // e.g., 'WAVE', 'POINT'
    });
  });

  // World Chat
  socket.on('chat_message', (data) => {
    if (!socket.currentRoom) return;

    if (!checkRateLimit(socket.user.uid)) {
      socket.emit('chat_error', { message: 'You are sending messages too quickly.' });
      return;
    }

    const messageContent = data.message.substring(0, 200); // Max 200 chars

    const chatData = {
      id: Date.now().toString(),
      uid: socket.user.uid,
      username: data.username || 'Explorer',
      message: messageContent,
      channel: data.channel || 'WORLD',
      timestamp: Date.now()
    };

    if (chatData.channel === 'LOCAL') {
      // For LOCAL, we just emit to the room (which is the current world instance)
      // Ideally, distance calculation could happen on frontend, or we create smaller grid rooms.
      // For this phase, room = local instance.
      io.to(socket.currentRoom).emit('chat_message_received', chatData);
    } else if (chatData.channel === 'WORLD') {
      // WORLD channel spans all instances of this world
      // Assuming socket.currentRoom is `worldId:roomId`, we can broadcast to a global world room if we wanted
      // For now, broadcast to current room as well to keep it simple, or implement full global rooms.
      io.to(socket.currentRoom).emit('chat_message_received', chatData);
    } else if (chatData.channel === 'PARTY') {
      if (data.partyId) {
        io.to(`party:${data.partyId}`).emit('chat_message_received', chatData);
      }
    }
  });

  // Social Discovery Markers
  socket.on('place_marker', (data) => {
    if (!socket.currentRoom) return;
    
    // data: { type: 'MEMORY'|'EVENT', position: [x,y,z], text: string }
    const marker = {
      id: Date.now().toString() + '_' + socket.user.uid,
      uid: socket.user.uid,
      username: data.username,
      type: data.type,
      position: data.position,
      text: data.text,
      expiresAt: Date.now() + 60000 // 60 seconds
    };

    io.to(socket.currentRoom).emit('marker_placed', marker);
  });

  // Party joining for chat
  socket.on('join_party_room', (partyId) => {
    socket.join(`party:${partyId}`);
  });
  
  socket.on('leave_party_room', (partyId) => {
    socket.leave(`party:${partyId}`);
  });
}

module.exports = setupSocial;
