import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'failed';
  className?: string;
}

/**
 * Status badge component with liquid animations
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: {
      label: '下载中',
      color: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      icon: '⏳',
    },
    completed: {
      label: '已完成',
      color: 'bg-green-500/20 text-green-300 border-green-400/30',
      icon: '✓',
    },
    failed: {
      label: '失败',
      color: 'bg-red-500/20 text-red-300 border-red-400/30',
      icon: '✕',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm text-sm font-medium',
        config.color,
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-base">{config.icon}</span>
      <span>{config.label}</span>
    </motion.div>
  );
};
