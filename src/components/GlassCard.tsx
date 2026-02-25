import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Glass morphism card component
 * Reusable UI component following Single Responsibility Principle
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = false
}) => {
  return (
    <motion.div
      className={cn(
        'glass rounded-3xl p-6 shadow-2xl',
        hover && 'transition-all duration-300 hover:bg-white/10 hover:shadow-3xl',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};
