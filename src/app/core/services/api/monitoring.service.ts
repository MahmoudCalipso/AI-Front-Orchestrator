import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  RealtimeMetrics,
  HistoricalMetricsRequest,
  HistoricalMetricsResponse,
  BuildsListResponse,
  BuildDetails,
  SystemHealthResponse
} from '../../models/monitoring/monitoring.model';
import { MetricsResponse } from '../../models/common/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService extends BaseApiService {

  /**
   * Get Prometheus metrics
   * GET /metrics
   */
  getMetrics(): Observable<MetricsResponse> {
    return this.get<MetricsResponse>('/metrics');
  }

  /**
   * Get historical metrics
   * GET /api/monitoring/metrics
   */
  getHistoricalMetrics(request: HistoricalMetricsRequest): Observable<HistoricalMetricsResponse> {
    return this.get<HistoricalMetricsResponse>('/api/monitoring/metrics', request);
  }

  /**
   * Get current metrics snapshot
   * GET /api/monitoring/metrics/current
   */
  getCurrentMetrics(): Observable<RealtimeMetrics> {
    return this.get<RealtimeMetrics>('/api/monitoring/metrics/current');
  }

  /**
   * List build history
   * GET /api/monitoring/builds
   */
  listBuilds(params?: { page?: number; pageSize?: number; status?: string }): Observable<BuildsListResponse> {
    return this.get<BuildsListResponse>('/api/monitoring/builds', params);
  }

  /**
   * Get build details
   * GET /api/monitoring/builds/{build_id}
   */
  getBuildDetails(buildId: string): Observable<BuildDetails> {
    return this.get<BuildDetails>(`/api/monitoring/builds/${buildId}`);
  }

  /**
   * Get system health
   * GET /api/monitoring/health
   */
  getSystemHealth(): Observable<SystemHealthResponse> {
    return this.get<SystemHealthResponse>('/api/monitoring/health');
  }
}
