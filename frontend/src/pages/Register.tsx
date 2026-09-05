import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { Button } from '../components/ui/Button';
import { Gamepad2, ShieldAlert } from 'lucide-react';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      setError('Authentication is currently disabled due to missing configuration.');
      return;
    }

    if (password.length < 8) {
      return setError('Access code must be at least 8 characters.');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Store the username as temporary profile metadata in Firebase
      await updateProfile(userCredential.user, {
        displayName: username
      });
      navigate('/profile', { replace: true });
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This identity vector is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Invalid identity vector format.');
          break;
        case 'auth/weak-password':
          setError('Access code is too weak. Upgrade security protocol.');
          break;
        default:
          setError('Failed: ' + (err.code || err.message || 'Unknown error'));
          console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 relative overflow-hidden pb-12">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-game-purple/20 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-2xl border border-game-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-purple to-game-neon" />
          
          <div className="text-center mb-8">
            <Gamepad2 className="w-12 h-12 text-game-purple mx-auto mb-4 drop-shadow-[0_0_10px_rgba(138,43,226,0.5)]" />
            <h2 className="text-3xl font-display font-black text-white text-glow tracking-widest uppercase">New Legacy</h2>
            <p className="text-gray-400 mt-2">Forge your identity in the universe</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200/80">Firebase is not configured. Registration is disabled.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Callsign (Username)
              </label>
              <input 
                type="text" 
                required 
                disabled={!isFirebaseConfigured || loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-game-dark border border-game-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-game-purple focus:ring-1 focus:ring-game-purple transition-all"
                placeholder="Cipher_Vanguard"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Identity Vector (Email)
              </label>
              <input 
                type="email" 
                required 
                disabled={!isFirebaseConfigured || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-game-dark border border-game-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-game-purple focus:ring-1 focus:ring-game-purple transition-all"
                placeholder="operator@gameworld.net"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Access Code (Password)
              </label>
              <input 
                type="password" 
                required 
                disabled={!isFirebaseConfigured || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-game-dark border border-game-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-game-purple focus:ring-1 focus:ring-game-purple transition-all"
                placeholder="Min 8 characters"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 mt-6 text-lg border-game-purple hover:bg-game-purple/20 text-game-purple hover:shadow-[0_0_20px_rgba(138,43,226,0.4)]" 
              disabled={!isFirebaseConfigured || loading}
            >
              {loading ? 'FORGING...' : 'FORGE LEGACY'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already exist in the database? {' '}
            <Link to="/login" className="text-game-purple hover:text-white font-bold transition-colors">
              Initiate Sync
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
