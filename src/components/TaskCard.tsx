import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Task } from '../types/task';
import { GlassCard } from './GlassCard';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
  onRetry: (task: Task) => void;
  isRetrying: boolean;
}

/**
 * Task card component displaying task information
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onRetry, isRetrying }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
    } catch {
      return dateString;
    }
  };

  const truncateUrl = (url: string, maxLength: number = 60) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <GlassCard hover className="group h-full">
      <div className="flex flex-col h-full space-y-4">
        {/* Header - Title only */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-3" title={task.video_title || '未知标题'}>
            {task.video_title || '未知标题'}
          </h3>
        </div>

        {/* Link and Status Badge */}
        <div className="flex items-center justify-between gap-3">
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 group/link"
          >
            <span>点击查看</span>
            <motion.span
              className="text-xs"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </a>
          <div className="flex-shrink-0">
            <StatusBadge status={task.status} compact />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-white/40">📁</span>
            <span className="truncate">{task.output_path}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-white/40">🕐</span>
            <span>{formatDate(task.update_time)}</span>
          </div>
        </div>

        {/* Error message */}
        {task.status === 'failed' && task.error && (
          <motion.div
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-red-300 line-clamp-2">
              <span className="font-semibold">错误: </span>
              {task.error}
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-auto">
          {task.status === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="danger"
                onClick={() => onRetry(task)}
                loading={isRetrying}
                className="w-full"
              >
                重试下载
              </Button>
            </motion.div>
          )}

          {/* Pending animation */}
          {task.status === 'pending' && (
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-white/50"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
