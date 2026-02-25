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
    <GlassCard hover className="group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate mb-2">
              {task.video_title || '未知标题'}
            </h3>
            <p className="text-sm text-white/60 break-all">
              {truncateUrl(task.url)}
            </p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-white/40">📁</span>
            <span className="truncate">{task.output_path}</span>
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <span className="text-white/40">🕐</span>
            <span>{formatDate(task.timestamp)}</span>
          </div>
          {task.format && (
            <div className="flex items-center gap-2 text-white/60">
              <span className="text-white/40">🎬</span>
              <span className="truncate">{task.format}</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {task.status === 'failed' && task.error && (
          <motion.div
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-red-300">
              <span className="font-semibold">错误: </span>
              {task.error}
            </p>
          </motion.div>
        )}

        {/* Actions */}
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
    </GlassCard>
  );
};
