import React from 'react';
import { cn } from './Button';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-game-border text-gray-300 border-game-border',
    success: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    info: 'bg-game-neon/10 text-game-neon border-game-neon/20 shadow-[0_0_10px_rgba(0,240,255,0.1)]',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
