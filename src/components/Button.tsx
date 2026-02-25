import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../utils/cn';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Liquid-styled button component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  children,
  className,
  disabled,
  type = 'button',
  onClick,
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white',
    secondary: 'glass hover:bg-white/10 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-lg hover:shadow-xl active:scale-95',
        variants[variant],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span>处理中...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};
