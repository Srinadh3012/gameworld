import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-game-darker text-white">
      <Navbar />
      <main className="flex-grow pt-20 relative">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-game-border py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 GAMEWORLD. The world is your game.</p>
        </div>
      </footer>
    </div>
  );
}
