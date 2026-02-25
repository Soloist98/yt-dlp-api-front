import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { FilterBar } from './FilterBar';
import { Task, TaskFilters } from '../types/task';
import { cn } from '../utils/cn';

interface TaskListProps {
  tasks: Task[];
  onRetry: (task: Task) => void;
  isRetrying: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

/**
 * Task list component with pagination and filtering
 */
export const TaskList: React.FC<TaskListProps> = ({ tasks, onRetry, isRetrying, onRefresh, isRefreshing }) => {
  const [filters, setFilters] = useState<TaskFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleFilterChange = (status?: TaskFilters['status'], search?: string) => {
    setFilters({ status, search });
    setCurrentPage(1);
  };

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.url.toLowerCase().includes(searchLower) ||
        task.video_title?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Task count */}
      <div className="flex items-center justify-between text-white/60">
        <span>共 {filteredTasks.length} 个任务</span>
        <div className="flex items-center gap-4">
          {totalPages > 1 && (
            <span>
              第 {currentPage} / {totalPages} 页
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl glass transition-all duration-300',
              isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-105 active:scale-95'
            )}
            title="刷新任务列表"
          >
            <span className={cn('text-lg', isRefreshing && 'animate-spin')}>🔄</span>
            <span>刷新</span>
          </button>
        </div>
      </div>

      {/* Task grid */}
      {paginatedTasks.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {paginatedTasks.map((task, index) => (
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
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={cn(
              'px-4 py-2 rounded-xl glass transition-all duration-300',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-105 active:scale-95'
            )}
          >
            上一页
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                'px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95',
                page === currentPage
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'glass hover:bg-white/10 text-white/80'
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              'px-4 py-2 rounded-xl glass transition-all duration-300',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:scale-105 active:scale-95'
            )}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};
