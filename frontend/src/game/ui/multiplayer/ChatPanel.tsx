import React, { useState, useEffect, useRef } from 'react';
import { multiplayerManager } from '../../multiplayer/MultiplayerManager';
import { useAuth } from '../../../context/AuthContext';

export function ChatPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [channel, setChannel] = useState('WORLD');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    multiplayerManager.setOnChatReceived((msg) => {
      setMessages(prev => [...prev.slice(-49), msg]);
    });
    return () => multiplayerManager.setOnChatReceived(() => {});
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    multiplayerManager.emitChat(input.trim(), channel, currentUser?.displayName || 'Explorer');
    setInput('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 left-4 bg-black/50 hover:bg-black/80 border border-cyan-900/50 text-cyan-500 p-2 rounded backdrop-blur transition-all"
      >
        <span className="text-xs tracking-widest">OPEN CHAT</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 w-80 h-64 bg-black/70 backdrop-blur border border-cyan-900/50 rounded flex flex-col z-50">
      <div className="flex justify-between items-center bg-cyan-900/20 p-2 border-b border-cyan-900/50">
        <div className="flex space-x-2 text-xs">
          <button 
            onClick={() => setChannel('WORLD')}
            className={`px-2 py-1 ${channel === 'WORLD' ? 'text-cyan-300 border-b border-cyan-300' : 'text-gray-500'}`}
          >
            WORLD
          </button>
          <button 
            onClick={() => setChannel('LOCAL')}
            className={`px-2 py-1 ${channel === 'LOCAL' ? 'text-cyan-300 border-b border-cyan-300' : 'text-gray-500'}`}
          >
            LOCAL
          </button>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm font-mono scrollbar-hide">
        {messages.filter(m => m.channel === channel || channel === 'WORLD').map((m, i) => (
          <div key={i} className="break-words">
            <span className="text-cyan-600">[{m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}] </span>
            <span className={m.uid === currentUser?.uid ? 'text-amber-400' : 'text-cyan-400'}>{m.username}: </span>
            <span className="text-gray-300">{m.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-cyan-900/50 p-2 flex bg-black/50">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-cyan-100 placeholder-cyan-900/50 font-mono"
          maxLength={200}
        />
      </form>
    </div>
  );
}
