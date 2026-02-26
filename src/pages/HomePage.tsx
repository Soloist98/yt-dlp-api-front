import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { TaskFilters } from '../types/task';

/**
 * Home page - displays task list
 */
export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    page_size: 20,
    order: 'desc',
  });
  const { tasks, pagination, isLoading, isFetching, refetch, retryTask, isRetrying } = useTasks(filters);

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterChange = (status?: TaskFilters['status'], search?: string) => {
    setFilters((prev) => ({
      ...prev,
      status,
      search,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    // Scroll to top of task list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (page_size: number) => {
    setFilters((prev) => ({
      ...prev,
      page_size,
      page: 1, // Reset to first page when page size changes
    }));
  };

  return (
    <div className="min-h-screen p-6 md:p-12 md:pl-32">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 text-gradient"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            下载任务
          </motion.h1>
          <p className="text-xl text-white/60">
            {pagination ? `共 ${pagination.total} 个任务` : '管理你的下载任务'}
          </p>
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              pagination={pagination}
              onRetry={retryTask}
              isRetrying={isRetrying}
              onRefresh={handleRefresh}
              isRefreshing={isFetching}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="fixed top-40 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="fixed bottom-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 30, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
