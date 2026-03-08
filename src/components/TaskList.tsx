import React from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { FilterBar } from './FilterBar';
import { Pagination } from './Pagination';
import { Task, TaskFilters, PaginationInfo } from '../types/task';
import { cn } from '../utils/cn';

interface TaskListProps {
  tasks: Task[];
  pagination?: PaginationInfo;
  onRetry: (task: Task) => void;
  isRetrying: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onFilterChange: (status?: TaskFilters['status'], search?: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onBatchRetry: (tasks: Task[]) => void;
  isBatchRetrying: boolean;
  activeFilter?: TaskFilters['status'] | 'all';
  isLoading?: boolean;
}

/**
 * Task list component with backend pagination and filtering
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  pagination,
  onRetry,
  isRetrying,
  onRefresh,
  isRefreshing,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onBatchRetry,
  isBatchRetrying,
  activeFilter,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={onFilterChange} activeFilter={activeFilter} />

      {/* Task count and refresh button */}
      <div className="flex items-center justify-between text-white/60">
        <span>
          {pagination ? (
            <>
              显示 <span className="text-white font-medium">{tasks.length}</span> 条，
              共 <span className="text-white font-medium">{pagination.total}</span> 条任务
            </>
          ) : (
            `共 ${tasks.length} 个任务`
          )}
        </span>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl border border-white/10 transition-all duration-300',
            isRefreshing
              ? 'opacity-50 cursor-not-allowed bg-white/5'
              : 'bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95'
          )}
          title="刷新任务列表"
        >
          <motion.span
            className="text-lg"
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          >
            🔄
          </motion.span>
          <span>刷新</span>
        </button>
      </div>

      {/* Task grid or loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : tasks.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              layout
            >
              <TaskCard task={task} onRetry={onRetry} isRetrying={isRetrying} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">📭</div>
          <p className="text-white/60 text-lg">暂无任务</p>
        </motion.div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > 0 && !isLoading && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};
