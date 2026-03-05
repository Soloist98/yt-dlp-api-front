import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Task, DownloadRequest, TaskFilters, PaginationInfo } from '../types/task';

/**
 * Custom hook for task management
 * Encapsulates business logic following Clean Code principles
 */
export const useTasks = (filters?: TaskFilters) => {
  const queryClient = useQueryClient();

  // Fetch tasks with filters, pagination and sorting
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      // 构建后端查询参数
      const backendFilters: TaskFilters = {
        status: filters?.status,
        page: filters?.page || 1,
        page_size: filters?.page_size || 100,
        order: filters?.order || 'desc',
      };

      const response = await apiService.listTasks(backendFilters);
      let tasks = response.data || [];

      // 前端搜索过滤（保持原有功能）
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        tasks = tasks.filter(
          (task) =>
            task.url.toLowerCase().includes(searchLower) ||
            task.video_title?.toLowerCase().includes(searchLower)
        );
      }

      return {
        tasks,
        pagination: response.pagination,
      };
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds (1 minute)
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Submit download mutation
  const submitDownload = useMutation({
    mutationFn: (request: DownloadRequest) => apiService.submitDownload(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Retry task mutation
  const retryTask = useMutation({
    mutationFn: (task: Task) => apiService.retryTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Batch retry tasks mutation
  const batchRetryTasks = useMutation({
    mutationFn: (tasks: Task[]) => {
      const taskRequests = tasks.map(task => ({ url: task.url }));
      return apiService.submitBatchDownload({ tasks: taskRequests });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: data?.tasks || [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
    refetch,
    submitDownload: submitDownload.mutate,
    retryTask: retryTask.mutate,
    isSubmitting: submitDownload.isPending,
    isRetrying: retryTask.isPending,
    batchRetryTasks: batchRetryTasks.mutate,
    isBatchRetrying: batchRetryTasks.isPending,
  };
};
