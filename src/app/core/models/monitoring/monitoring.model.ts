/**
 * Monitoring Models
 * All Monitoring-related DTOs matching backend Python models
 */

// ==================== Metrics ====================
export interface MetricsDTO {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  active_models: number;
  active_projects: number;
  active_users: number;
  active_connections?: number;
  requests_per_second?: number;
  average_response_time?: number;
  error_rate?: number;
}

export type RealtimeMetrics = MetricsDTO;
export type BuildDetails = BuildInfoDTO;
export type BuildsListResponse = BuildListResponseDTO;

export interface AlertHistory {
  alerts: AlertNotification[];
  total: number;
}

// ==================== Metrics List ====================
export interface MetricsListResponseDTO {
  metrics: MetricsDTO[];
  total: number;
}

// ==================== Build Info ====================
export interface BuildInfoDTO {
  id: string;
  project_id: string;
  project_name: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration?: number;
  logs?: string[];
  error?: string;
}

// ==================== Build List ====================
export interface BuildListResponseDTO {
  builds: BuildInfoDTO[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== System Metrics ====================
export interface MonitoringSystemMetricsDTO {
  cpu: {
    usage: number;
    cores: number;
    load_average: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    in: number;
    out: number;
  };
  uptime: number;
  timestamp: string;
}

// ==================== Workbench Metrics ====================
export interface WorkbenchMetricsDTO {
  workbench_id: string;
  project_id: string;
  status: string;
  cpu_usage: number;
  memory_usage: number;
  uptime: number;
  last_activity: string;
}

// ==================== Workbench List ====================
export interface WorkbenchListResponseDTO {
  workbenches: WorkbenchMetricsDTO[];
  total: number;
}

// ==================== Build Status ====================
export enum BuildStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// ==================== Compatibility Aliases ====================
export type BuildSummaryDTO = BuildInfoDTO;
export type MetricsFilter = MetricsFilterDTO;
export interface MetricsFilterDTO {
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}
export type HistoricalMetricsRequest = MetricsFilterDTO;

export interface HistoricalMetricsResponse {
  metrics: MetricsDTO[];
  summary: {
    avg_cpu: number;
    avg_memory: number;
    total_network_in: number;
    total_network_out: number;
  };
}

// ==================== Health ====================
export interface SystemHealthResponse {
  overall_status: string;
  timestamp: string;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: string;
  details?: Record<string, any>;
}
// ==================== Alerts and Notifications ====================
export interface AlertNotification {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  is_acknowledged: boolean;
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: string;
  enabled: boolean;
}

export interface MetricsConfig {
  retention_days: number;
  scraping_interval: number;
  enabled_collectors: string[];
}

