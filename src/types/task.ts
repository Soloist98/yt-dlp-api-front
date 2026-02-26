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
  create_time: string;
  update_time: string;
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
  page?: number;
  page_size?: number;
  order?: 'asc' | 'desc';
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

/**
 * Task list response
 */
export interface TaskListResponse {
  status: 'success' | 'error';
  data: Task[];
  pagination: PaginationInfo;
}
