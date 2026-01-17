/**
 * Real-time metrics
 */
export interface RealtimeMetrics {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_connections: number;
  requests_per_second: number;
  average_response_time: number;
  error_rate: number;
}

/**
 * Historical metrics request
 */
export interface HistoricalMetricsRequest {
  start_time: string;
  end_time: string;
  interval?: '1m' | '5m' | '15m' | '1h' | '1d';
  metrics?: string[];
}

/**
 * Historical metrics response
 */
export interface HistoricalMetricsResponse {
  metrics: TimeSeriesMetric[];
  start_time: string;
  end_time: string;
  interval: string;
}

/**
 * Time series metric
 */
export interface TimeSeriesMetric {
  name: string;
  data_points: DataPoint[];
  unit: string;
  aggregation: 'avg' | 'sum' | 'min' | 'max';
}

/**
 * Data point
 */
export interface DataPoint {
  timestamp: string;
  value: number;
}

/**
 * Build information
 */
export interface BuildInfo {
  build_id: string;
  project_id: string;
  project_name: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
  trigger: 'manual' | 'commit' | 'schedule' | 'api';
  branch?: string;
  commit?: string;
  started_at?: string;
  completed_at?: string;
  duration?: number;
  logs_url?: string;
}

/**
 * Builds list response
 */
export interface BuildsListResponse {
  builds: BuildInfo[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Build details
 */
export interface BuildDetails extends BuildInfo {
  steps: BuildStep[];
  artifacts?: Artifact[];
  test_results?: TestSummary;
  logs?: string;
  error?: string;
}

/**
 * Build step
 */
export interface BuildStep {
  step_id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  duration?: number;
  logs?: string;
}

/**
 * Build artifact
 */
export interface Artifact {
  name: string;
  path: string;
  size: number;
  type: string;
  download_url: string;
}

/**
 * Test summary
 */
export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage?: number;
}

/**
 * Alert rule
 */
export interface AlertRule {
  rule_id: string;
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number;
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
  notifications: NotificationChannel[];
}

/**
 * Notification channel
 */
export interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook' | 'sms';
  destination: string;
  enabled: boolean;
}

/**
 * Alert
 */
export interface Alert {
  alert_id: string;
  rule_id: string;
  rule_name: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  current_value: number;
  threshold: number;
  triggered_at: string;
  resolved_at?: string;
  status: 'firing' | 'resolved' | 'acknowledged';
}

/**
 * Service health
 */
export interface ServiceHealth {
  service_name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  last_check: string;
  response_time: number;
  error_rate: number;
  dependencies?: ServiceHealth[];
}

/**
 * System health response
 */
export interface SystemHealthResponse {
  overall_status: 'healthy' | 'degraded' | 'unhealthy';
  services: ServiceHealth[];
  timestamp: string;
}
