import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Task, DownloadRequest, TaskFilters } from '../types/task';

/**
 * Custom hook for task management
 * Encapsulates business logic following Clean Code principles
 */
export const useTasks = (filters?: TaskFilters) => {
  const queryClient = useQueryClient();

  // Fetch all tasks with auto-refresh
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const allTasks = await apiService.listTasks();

      // Apply filters
      let filtered = allTasks;

      if (filters?.status) {
        filtered = filtered.filter((task) => task.status === filters.status);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (task) =>
            task.url.toLowerCase().includes(searchLower) ||
            task.video_title?.toLowerCase().includes(searchLower)
        );
      }

      // Sort by timestamp (newest first)
      return filtered.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    refetchInterval: 60000, // Auto-refresh every 60 seconds (1 minute)
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

  return {
    tasks,
    isLoading,
    isFetching,
    error,
    refetch,
    submitDownload: submitDownload.mutate,
    retryTask: retryTask.mutate,
    isSubmitting: submitDownload.isPending,
    isRetrying: retryTask.isPending,
  };
};
