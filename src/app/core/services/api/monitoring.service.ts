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
      map(res => res.data)
    );
  }

  /**
   * Get current metrics snapshot
   * GET /api/v1/monitoring/metrics/current
   */
  getCurrentMetrics(): Observable<RealtimeMetrics> {
    return this.get<BaseResponse<RealtimeMetrics>>('monitoring/metrics/current').pipe(
      map(res => res.data)
    );
  }

  /**
   * List build history
   * GET /api/v1/monitoring/builds
   */
  listBuilds(params?: { page?: number; pageSize?: number; status?: string }): Observable<BuildsListResponse> {
    return this.get<BaseResponse<BuildsListResponse>>('monitoring/builds', params).pipe(
      map(res => res.data)
    );
  }

  getBuildHistory(limit: number): Observable<any[]> {
    return this.get<BaseResponse<any[]>>('monitoring/builds', { pageSize: limit }).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get build details
   * GET /api/v1/monitoring/builds/{build_id}
   */
  getBuildDetails(buildId: string): Observable<BuildDetails> {
    return this.get<BaseResponse<BuildDetails>>(`monitoring/builds/${buildId}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get system health
   * GET /api/v1/monitoring/health
   */
  getSystemHealth(): Observable<SystemHealthResponse> {
    return this.get<BaseResponse<SystemHealthResponse>>('monitoring/health').pipe(
      map(res => res.data)
    );
  }
}
