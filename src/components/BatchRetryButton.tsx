import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types/task';
import { cn } from '../utils/cn';

interface BatchRetryButtonProps {
  tasks: Task[];
  onBatchRetry: (tasks: Task[]) => void;
  isPending: boolean;
}

/**
 * Floating batch retry button for failed tasks
 * Only visible when viewing failed tasks
 */
export const BatchRetryButton: React.FC<BatchRetryButtonProps> = ({
  tasks,
  onBatchRetry,
  isPending,
}) => {
  const taskCount = tasks.length;

  const handleClick = () => {
    if (!isPending && taskCount > 0) {
      onBatchRetry(tasks);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <button
          onClick={handleClick}
          disabled={isPending}
          className={cn(
            'px-8 py-4 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl',
            'flex items-center gap-3 transition-all duration-300',
            isPending
              ? 'bg-white/5 cursor-not-allowed opacity-70'
              : 'bg-white/10 hover:bg-white/15 hover:scale-105 active:scale-95'
          )}
        >
          {/* Icon */}
          <motion.span
            className="text-2xl"
            animate={isPending ? { rotate: 360 } : {}}
            transition={
              isPending
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : {}
            }
          >
            🔄
          </motion.span>

          {/* Text */}
          <span className="text-white font-medium text-lg">
            {isPending ? '正在重试...' : `重试 ${taskCount} 个失败任务`}
          </span>

          {/* Badge */}
          {!isPending && (
            <motion.span
              className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {taskCount}
            </motion.span>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
