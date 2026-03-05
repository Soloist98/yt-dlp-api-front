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
  const handleClick = () => {
    if (!isPending && tasks.length > 0) {
      onBatchRetry(tasks);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-20 top-1/2 -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <button
          onClick={handleClick}
          disabled={isPending}
          className={cn(
            'px-4 py-6 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl',
            'flex flex-col items-center gap-3 transition-all duration-300',
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

          {/* Text - Vertical */}
          <span className="text-white font-medium text-base" style={{ writingMode: 'vertical-rl' }}>
            {isPending ? '正在重试...' : '重试当前页面所有失败任务'}
          </span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
