import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { useNavigation } from '../contexts/NavigationContext';
import { TaskFilters, Task } from '../types/task';

/**
 * Home page - displays task list
 */
export const HomePage: React.FC = () => {
  const { setShowBatchRetry, setOnBatchRetry, setIsBatchRetrying } = useNavigation();
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    page_size: 20,
    order: 'desc',
  });
  const [activeFilter, setActiveFilter] = useState<TaskFilters['status'] | 'all'>('all');
  const {
    tasks,
    pagination,
    isLoading,
    isFetching,
    refetch,
    retryTask,
    isRetrying,
    batchRetryTasks,
    isBatchRetrying,
  } = useTasks(filters);

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
    setActiveFilter(status || 'all');
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

  const handleBatchRetry = useCallback((tasks: Task[]) => {
    batchRetryTasks(tasks, {
      onSuccess: (data) => {
        toast.success(`✓ 已提交 ${data.task_ids.length} 个任务重试`, {
          duration: 3000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
          },
        });
      },
      onError: () => {
        toast.error('✕ 重试失败，请稍后再试', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
          },
        });
      },
    });
  }, [batchRetryTasks]);

  // Update navigation context when filter or tasks change
  useEffect(() => {
    const shouldShowBatchRetry = activeFilter === 'failed' && tasks.length > 0;
    setShowBatchRetry(shouldShowBatchRetry);

    if (shouldShowBatchRetry) {
      setOnBatchRetry(() => handleBatchRetry(tasks));
    } else {
      setOnBatchRetry(undefined);
    }
  }, [activeFilter, tasks, setShowBatchRetry, setOnBatchRetry, handleBatchRetry]);

  // Update batch retrying state
  useEffect(() => {
    setIsBatchRetrying(isBatchRetrying);
  }, [isBatchRetrying, setIsBatchRetrying]);

  return (
    <>
      <div className="min-h-screen pt-24 md:pt-28 p-6 md:p-12">
        <Toaster />
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
              onBatchRetry={handleBatchRetry}
              isBatchRetrying={isBatchRetrying}
              activeFilter={activeFilter}
              isLoading={isLoading || isFetching}
            />
          </motion.div>
        </div>
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
    </>
  );
};
