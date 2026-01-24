import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BaseWebSocketService, WebSocketMessage } from './base-websocket.service';

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  memory_total: number;
  memory_available: number;
  disk_usage: number;
  disk_total: number;
  disk_available: number;
  network_in: number;
  network_out: number;
  timestamp: number;
}

export interface BuildProgress {
  build_id: string;
  project_id: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  progress: number;
  current_step: string;
  logs: string[];
  started_at: string;
  completed_at?: string;
}

export interface AlertNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

/**
 * Monitoring WebSocket Service
 * Handles real-time metrics streaming
 */
@Injectable({
  providedIn: 'root'
})
export class MonitoringWebSocketService extends BaseWebSocketService {
  private metricsSubject = new BehaviorSubject<SystemMetrics | null>(null);
  private buildProgressSubject = new Subject<BuildProgress>();
  private alertsSubject = new Subject<AlertNotification>();
  private metricsHistorySubject = new BehaviorSubject<SystemMetrics[]>([]);

  public metrics$ = this.metricsSubject.asObservable();
  public buildProgress$ = this.buildProgressSubject.asObservable();
  public alerts$ = this.alertsSubject.asObservable();
  public metricsHistory$ = this.metricsHistorySubject.asObservable();

  private maxHistoryLength = 100;

  /**
   * Connect to monitoring stream
   */
  connectToMonitoring(): void {
    this.connect('/monitoring/stream');

    // Subscribe to messages
    this.messages$.subscribe(msg => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(msg: WebSocketMessage): void {
    switch (msg.type) {
      case 'metrics':
        this.handleMetrics(msg.payload);
        break;
      case 'build_progress':
        this.buildProgressSubject.next(msg.payload);
        break;
      case 'alert':
        this.alertsSubject.next(msg.payload);
        break;
      default:
        // Handle raw metrics data
        if (msg.cpu_usage !== undefined) {
          this.handleMetrics(msg as any);
        }
    }
  }

  /**
   * Handle metrics update
   */
  private handleMetrics(metrics: SystemMetrics): void {
    const metricsWithTimestamp = {
      ...metrics,
      timestamp: metrics.timestamp || Date.now()
    };

    this.metricsSubject.next(metricsWithTimestamp);

    // Update history
    const history = this.metricsHistorySubject.value;
    const newHistory = [...history, metricsWithTimestamp];

    // Keep only last N entries
    if (newHistory.length > this.maxHistoryLength) {
      newHistory.shift();
    }

    this.metricsHistorySubject.next(newHistory);
  }

  /**
   * Disconnect from monitoring
   */
  disconnectFromMonitoring(): void {
    this.disconnect();
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): SystemMetrics | null {
    return this.metricsSubject.value;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(): SystemMetrics[] {
    return this.metricsHistorySubject.value;
  }

  /**
   * Clear metrics history
   */
  clearHistory(): void {
    this.metricsHistorySubject.next([]);
  }

  /**
   * Subscribe to specific build progress
   */
  getBuildProgress(buildId: string): Observable<BuildProgress> {
    return this.buildProgress$.pipe(
      filter(progress => progress.build_id === buildId)
    );
  }

  /**
   * Subscribe to project builds
   */
  getProjectBuilds(projectId: string): Observable<BuildProgress> {
    return this.buildProgress$.pipe(
      filter(progress => progress.project_id === projectId)
    );
  }
}
