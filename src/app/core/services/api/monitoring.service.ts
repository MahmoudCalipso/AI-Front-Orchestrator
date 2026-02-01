import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  RealtimeMetrics,
  HistoricalMetricsRequest,
  HistoricalMetricsResponse,
  BuildsListResponse,
  BuildDetails,
  SystemHealthResponse,
  AlertNotification,
  MetricsConfig,
  AlertRule,
  AlertHistory,
  BuildSummaryDTO
} from '../../models/monitoring/monitoring.model';
import { MetricsResponse } from '../../models/common/api-response.model';

/**
 * Monitoring Service
 * Handles system monitoring, metrics collection, and alerting
 */
@Injectable({
  providedIn: 'root'
})
export class MonitoringService extends BaseApiService {

  /**
   * Get Prometheus metrics
   * GET /metrics
   */
  getMetrics(): Observable<MetricsResponse> {
    // Direct call to /metrics on the server root (bypassing /api/v1)
    // Assuming baseUrl ends with / (e.g. http://localhost:8000 or http://localhost:8000/)
    // We trim trailing slash if needed and append /metrics
    const rootUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    return this.http.get<MetricsResponse>(`${rootUrl}/metrics`);
  }

  /**
   * Get historical metrics
   * GET /api/v1/monitoring/metrics
   */
  getHistoricalMetrics(request: HistoricalMetricsRequest): Observable<HistoricalMetricsResponse> {
    return this.get<BaseResponse<HistoricalMetricsResponse>>('monitoring/metrics', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get current metrics snapshot
   * GET /api/v1/monitoring/metrics/current
   */
  getCurrentMetrics(): Observable<RealtimeMetrics> {
    return this.get<BaseResponse<RealtimeMetrics>>('monitoring/metrics/current').pipe(
      map(res => res.data!)
    );
  }

  /**
   * List build history
   * GET /api/v1/monitoring/builds
   */
  listBuilds(
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      project_id?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Observable<BuildsListResponse> {
    return this.get<BaseResponse<BuildsListResponse>>('monitoring/builds', params).pipe(
      map(res => res.data || { builds: [], total: 0, page: 1, page_size: 10 })
    );
  }

  /**
   * Get build details
   * GET /api/v1/monitoring/builds/{build_id}
   */
  getBuildDetails(buildId: string): Observable<BuildDetails> {
    return this.get<BaseResponse<BuildDetails>>(`monitoring/builds/${buildId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get system health
   * GET /api/v1/monitoring/health
   */
  getSystemHealth(): Observable<SystemHealthResponse> {
    return this.get<BaseResponse<SystemHealthResponse>>('monitoring/health').pipe(
      map(res => res.data!)
    );
  }

  // ==================== Advanced Monitoring Operations ====================

  /**
   * Get system resource usage
   * GET /api/v1/monitoring/resources
   */
  getResourceUsage(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/resources').pipe(
      map(res => res.data)
    );
  }

  /**
   * Get database performance metrics
   * GET /api/v1/monitoring/database
   */
  getDatabaseMetrics(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/database').pipe(
      map(res => res.data)
    );
  }

  /**
   * Get AI model performance metrics
   * GET /api/v1/monitoring/ai
   */
  getAIMetrics(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/ai').pipe(
      map(res => res.data)
    );
  }

  /**
   * Get user activity metrics
   * GET /api/v1/monitoring/users
   */
  getUserMetrics(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/users').pipe(
      map(res => res.data)
    );
  }

  /**
   * List build history (Alias for listBuilds to fix component error)
   */
  getBuildHistory(limit: number = 10): Observable<BuildSummaryDTO[]> {
    return this.get<BaseResponse<BuildSummaryDTO[]>>('monitoring/builds', { page_size: limit }).pipe(
      map(res => res.data || [])
    );
  }

  // ==================== Alert Management ====================

  /**
   * Get alert rules
   * GET /api/v1/monitoring/alerts/rules
   */
  getAlertRules(): Observable<AlertRule[]> {
    return this.get<BaseResponse<AlertRule[]>>('monitoring/alerts/rules').pipe(
      map(res => res.data || [])
    );
  }

  /**
   * Create alert rule
   * POST /api/v1/monitoring/alerts/rules
   */
  createAlertRule(rule: AlertRule): Observable<AlertRule> {
    return this.post<BaseResponse<AlertRule>>('monitoring/alerts/rules', rule).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Update alert rule
   * PUT /api/v1/monitoring/alerts/rules/{rule_id}
   */
  updateAlertRule(ruleId: string, rule: AlertRule): Observable<AlertRule> {
    return this.put<BaseResponse<AlertRule>>(`monitoring/alerts/rules/${ruleId}`, rule).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Delete alert rule
   * DELETE /api/v1/monitoring/alerts/rules/{rule_id}
   */
  deleteAlertRule(ruleId: string): Observable<void> {
    return this.delete<BaseResponse<void>>(`monitoring/alerts/rules/${ruleId}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get alert history
   * GET /api/v1/monitoring/alerts/history
   */
  getAlertHistory(
    params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Observable<AlertHistory> {
    return this.get<BaseResponse<AlertHistory>>('monitoring/alerts/history', params).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get active alerts
   * GET /api/v1/monitoring/alerts/active
   */
  getActiveAlerts(): Observable<AlertNotification[]> {
    return this.get<BaseResponse<AlertNotification[]>>('monitoring/alerts/active').pipe(
      map(res => res.data || [])
    );
  }

  /**
   * Acknowledge alert
   * POST /api/v1/monitoring/alerts/{alert_id}/acknowledge
   */
  acknowledgeAlert(alertId: string): Observable<void> {
    return this.post<BaseResponse<void>>(`monitoring/alerts/${alertId}/acknowledge`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Resolve alert
   * POST /api/v1/monitoring/alerts/{alert_id}/resolve
   */
  resolveAlert(alertId: string): Observable<void> {
    return this.post<BaseResponse<void>>(`monitoring/alerts/${alertId}/resolve`, {}).pipe(
      map(res => res.data)
    );
  }

  // ==================== Metrics Configuration ====================

  /**
   * Get metrics configuration
   * GET /api/v1/monitoring/config
   */
  getMetricsConfig(): Observable<MetricsConfig> {
    return this.get<BaseResponse<MetricsConfig>>('monitoring/config').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Update metrics configuration
   * PUT /api/v1/monitoring/config
   */
  updateMetricsConfig(config: MetricsConfig): Observable<MetricsConfig> {
    return this.put<BaseResponse<MetricsConfig>>('monitoring/config', config).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Real-time Monitoring ====================

  /**
   * Get real-time system metrics
   * GET /api/v1/monitoring/realtime
   */
  getRealtimeMetrics(): Observable<RealtimeMetrics> {
    return this.get<BaseResponse<RealtimeMetrics>>('monitoring/realtime').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get system events
   * GET /api/v1/monitoring/events
   */
  getSystemEvents(
    params?: {
      page?: number;
      pageSize?: number;
      level?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/events', params).pipe(
      map(res => res.data)
    );
  }

  // ==================== Performance Analysis ====================

  /**
   * Get performance bottlenecks
   * GET /api/v1/monitoring/bottlenecks
   */
  getPerformanceBottlenecks(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/bottlenecks').pipe(
      map(res => res.data)
    );
  }

  /**
   * Get resource utilization trends
   * GET /api/v1/monitoring/trends
   */
  getResourceTrends(
    params?: {
      period?: string; // 'hour', 'day', 'week', 'month'
      resource?: string; // 'cpu', 'memory', 'disk', 'network'
    }
  ): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/trends', params).pipe(
      map(res => res.data)
    );
  }

  // ==================== Custom Metrics ====================

  /**
   * Get custom metrics
   * GET /api/v1/monitoring/custom
   */
  getCustomMetrics(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/custom').pipe(
      map(res => res.data)
    );
  }

  /**
   * Record custom metric
   * POST /api/v1/monitoring/custom
   */
  recordCustomMetric(metric: any): Observable<any> {
    return this.post<BaseResponse<any>>('monitoring/custom', metric).pipe(
      map(res => res.data)
    );
  }

  // ==================== SLA Monitoring ====================

  /**
   * Get SLA metrics
   * GET /api/v1/monitoring/sla
   */
  getSLAMetrics(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/sla').pipe(
      map(res => res.data)
    );
  }

  /**
   * Get SLA compliance
   * GET /api/v1/monitoring/sla/compliance
   */
  getSLACompliance(): Observable<any> {
    return this.get<BaseResponse<any>>('monitoring/sla/compliance').pipe(
      map(res => res.data)
    );
  }
}
