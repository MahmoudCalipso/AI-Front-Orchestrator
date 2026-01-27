// Common Types and Utility Types

export type UUID = string;
export type Timestamp = string; // ISO 8601 date string
export type JSONValue = string | number | boolean | null | JSONArray | JSONObject;
export type JSONArray = JSONValue[];
export type JSONObject = { [key: string]: JSONValue };

export interface Metadata {
  [key: string]: JSONValue;
}

export interface PaginationParams {
  page: number;
  page_size: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  language?: string;
  framework?: string;
  created_after?: Timestamp;
  created_before?: Timestamp;
  updated_after?: Timestamp;
  updated_before?: Timestamp;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  code: string;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    pagination?: PaginatedResponse<any>;
    timestamp?: Timestamp;
    request_id?: string;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  version: string;
  services: {
    [serviceName: string]: {
      status: 'up' | 'down' | 'unknown';
      response_time?: number;
      last_check?: Timestamp;
    };
  };
}

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: {
    bytes_sent: number;
    bytes_received: number;
  };
  active_connections: number;
  request_count: number;
  error_rate: number;
}

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: Timestamp;
  session_id?: string;
  user_id?: string;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: Timestamp;
  type: 'file' | 'directory';
  permissions?: string;
}

export interface GitRepository {
  url: string;
  branch: string;
  commit_hash?: string;
  last_sync?: Timestamp;
  status: 'synced' | 'out_of_sync' | 'error';
}

export interface BuildInfo {
  id: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  start_time: Timestamp;
  end_time?: Timestamp;
  duration?: number;
  logs?: string[];
  artifacts?: FileInfo[];
}

export interface DeploymentInfo {
  id: string;
  environment: string;
  status: 'pending' | 'deploying' | 'success' | 'failed';
  url?: string;
  deployed_at?: Timestamp;
  logs?: string[];
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp: Timestamp;
  ip_address?: string;
  user_agent?: string;
  details?: JSONObject;
}
