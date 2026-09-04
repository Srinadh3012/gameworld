import React, { ComponentProps } from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

interface CardProps extends ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  glowOnHover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, glowOnHover = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={glowOnHover ? { y: -5 } : undefined}
        className={cn(
          'glass-panel rounded-lg overflow-hidden transition-all duration-300',
          glowOnHover && 'hover:border-game-purple/50 hover:shadow-[0_0_20px_rgba(138,43,226,0.15)]',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
