/**
 * Task status enum
 */
export type TaskStatus = 'pending' | 'completed' | 'failed';

/**
 * Task interface matching backend model
 */
export interface Task {
  id: string;
  url: string;
  video_title: string | null;
  output_path: string;
  format: string;
  status: TaskStatus;
  result: string | null;
  error: string | null;
  timestamp: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

/**
 * Download request payload
 */
export interface DownloadRequest {
  url: string;
  output_path?: string;
  format?: string;
  quiet?: boolean;
}

/**
 * Batch download request payload
 */
export interface BatchDownloadRequest {
  tasks: DownloadRequest[];
}

/**
 * Task list filters
 */
export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}
