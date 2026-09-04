import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { Button } from '../components/ui/Button';
import { Gamepad2, ShieldAlert } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseConfigured) {
      setError('Authentication is currently disabled due to missing configuration.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
          console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-game-neon/20 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-2xl border border-game-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-game-neon to-game-purple" />
          
          <div className="text-center mb-8">
            <Gamepad2 className="w-12 h-12 text-game-neon mx-auto mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            <h2 className="text-3xl font-display font-black text-white text-glow tracking-widest uppercase">Sync Interface</h2>
            <p className="text-gray-400 mt-2">Initialize identity protocol</p>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200/80">Firebase is not configured. Login is disabled.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Identity Vector (Email)
              </label>
              <input 
                type="email" 
                required 
                disabled={!isFirebaseConfigured || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-game-dark border border-game-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-game-neon focus:ring-1 focus:ring-game-neon transition-all"
                placeholder="operator@gameworld.net"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Access Code (Password)
                </label>
                <button type="button" className="text-xs text-game-neon hover:text-white transition-colors">
                  Forgot?
                </button>
              </div>
              <input 
                type="password" 
                required 
                disabled={!isFirebaseConfigured || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-game-dark border border-game-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-game-neon focus:ring-1 focus:ring-game-neon transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 mt-6 text-lg" 
              disabled={!isFirebaseConfigured || loading}
            >
              {loading ? 'SYNCING...' : 'INITIATE SYNC'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            No active identity? {' '}
            <Link to="/register" className="text-game-neon hover:text-white font-bold transition-colors">
              Establish Legacy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
