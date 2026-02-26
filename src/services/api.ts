import axios, { AxiosInstance } from 'axios';
import type { Task, ApiResponse, DownloadRequest, BatchDownloadRequest, TaskListResponse, TaskFilters } from '../types/task';

/**
 * API Service class following SOLID principles
 * Single Responsibility: Handles all API communication
 */
class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Submit a single download task
   */
  async submitDownload(request: DownloadRequest): Promise<{ task_id: string }> {
    const response = await this.client.post<ApiResponse<{ task_id: string }>>(
      '/download',
      request
    );
    return response.data.data || { task_id: '' };
  }

  /**
   * Submit multiple download tasks
   */
  async submitBatchDownload(request: BatchDownloadRequest): Promise<{ task_ids: string[] }> {
    const response = await this.client.post<ApiResponse<{ task_ids: string[] }>>(
      '/batch_download',
      request
    );
    return response.data.data || { task_ids: [] };
  }

  /**
   * Get single task status
   */
  async getTask(taskId: string): Promise<Task> {
    const response = await this.client.get<ApiResponse<Task>>(`/task/${taskId}`);
    return response.data.data as Task;
  }

  /**
   * List all tasks with filters, pagination and sorting (by timestamp)
   */
  async listTasks(filters?: TaskFilters): Promise<TaskListResponse> {
    const params: Record<string, any> = {};

    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.page) {
      params.page = filters.page;
    }
    if (filters?.page_size) {
      params.page_size = filters.page_size;
    }
    if (filters?.order) {
      params.order = filters.order;
    }

    const response = await this.client.get<TaskListResponse>('/tasks', { params });
    return response.data;
  }

  /**
   * Retry a failed task (resubmit with same URL)
   */
  async retryTask(task: Task): Promise<{ task_id: string }> {
    return this.submitDownload({
      url: task.url,
      output_path: task.output_path,
      format: task.format,
    });
  }
}

export const apiService = new ApiService();
