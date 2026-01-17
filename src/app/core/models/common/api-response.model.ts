/**
 * Common response wrapper for all API responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  services?: {
    [key: string]: {
      status: 'up' | 'down';
      latency?: number;
    };
  };
}

/**
 * System status response
 */
export interface StatusResponse {
  status: string;
  version: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  services: {
    [key: string]: boolean;
  };
}

/**
 * Metrics response
 */
export interface MetricsResponse {
  uptime: number;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  tokensUsed: number;
  activeConnections: number;
  timestamp: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  details?: any;
}

/**
 * Generic request with task tracking
 */
export interface TaskRequest {
  taskId?: string;
  priority?: 'low' | 'medium' | 'high';
  timeout?: number;
}

/**
 * Task status
 */
export interface TaskStatus {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message?: string;
  result?: any;
  error?: string;
  startTime: string;
  endTime?: string;
}
