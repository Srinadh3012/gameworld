import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Gamepad2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Discover', path: '/discover' },
  { name: 'World', path: '/world' },
  { name: 'Arena', path: '/arena' },
  { name: 'Create', path: '/create' },
  { name: 'Community', path: '/community' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-x-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <Gamepad2 className="h-8 w-8 text-game-neon group-hover:text-game-purple transition-colors duration-300" />
                <span className="font-display font-bold text-2xl tracking-widest text-white">
                  GAME<span className="text-game-neon">WORLD</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-game-neon text-glow' : 'text-gray-400 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 hover:bg-game-border/50 p-2 rounded-full transition-colors focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-game-dark border border-game-neon overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.displayName || 'User'}&backgroundColor=0a0a0a`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-white hidden lg:block">
                      {currentUser?.displayName || 'Operator'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg glass-panel border border-game-border overflow-hidden"
                      >
                        <div className="py-1">
                          <Link 
                            to="/profile" 
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-game-neon/10 hover:text-game-neon transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <User className="w-4 h-4" /> Profile
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" /> Disconnect
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-400 hover:text-white text-sm font-semibold uppercase tracking-wider transition-colors">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button size="sm" variant="primary">Join Now</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-game-darker pt-20 md:hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-4 text-base font-medium uppercase tracking-wider border-b border-game-border ${
                      isActive ? 'text-game-neon' : 'text-gray-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" className="w-full justify-center">View Profile</Button>
                    </Link>
                    <Button variant="danger" className="w-full justify-center" onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" className="w-full justify-center">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-center">Join Now</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
