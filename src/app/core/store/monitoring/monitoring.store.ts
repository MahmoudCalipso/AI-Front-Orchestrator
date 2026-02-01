import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MonitoringService } from '../../services/api/monitoring.service';
import { MonitoringStreamService } from '../../services/websocket/monitoring-stream.service';
import {
  RealtimeMetrics,
  HistoricalMetricsRequest,
  HistoricalMetricsResponse,
  BuildsListResponse,
  BuildDetails,
  SystemHealthResponse
} from '../../models/monitoring/monitoring.model';

export interface MonitoringState {
  currentMetrics: RealtimeMetrics | null;
  historicalMetrics: HistoricalMetricsResponse | null;
  builds: BuildsListResponse | null;
  selectedBuild: BuildDetails | null;
  systemHealth: SystemHealthResponse | null;
  loading: boolean;
  error: string | null;
  isStreaming: boolean;
  alerts: Array<{
    id: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  }>;
  metricsHistory: RealtimeMetrics[];
}

const initialState: MonitoringState = {
  currentMetrics: null,
  historicalMetrics: null,
  builds: null,
  selectedBuild: null,
  systemHealth: null,
  loading: false,
  error: null,
  isStreaming: false,
  alerts: [],
  metricsHistory: []
};

export const MonitoringStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, monitoringService = inject(MonitoringService), streamService = inject(MonitoringStreamService)) => ({
    // Load current metrics
    loadCurrentMetrics: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => monitoringService.getCurrentMetrics().pipe(
          tapResponse({
            next: (metrics) => {
              patchState(store, (state) => ({
                currentMetrics: metrics,
                metricsHistory: [...state.metricsHistory.slice(-99), metrics],
                loading: false
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load metrics',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load historical metrics
    loadHistoricalMetrics: rxMethod<HistoricalMetricsRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((request) => monitoringService.getHistoricalMetrics(request).pipe(
          tapResponse({
            next: (metrics) => {
              patchState(store, { historicalMetrics: metrics, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load historical metrics',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load builds
    loadBuilds: rxMethod<{ page?: number; pageSize?: number; status?: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((params) => monitoringService.listBuilds(params).pipe(
          tapResponse({
            next: (builds) => {
              patchState(store, { builds, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load builds',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load build details
    loadBuildDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((buildId) => monitoringService.getBuildDetails(buildId).pipe(
          tapResponse({
            next: (build) => {
              patchState(store, { selectedBuild: build, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load build details',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Load system health
    loadSystemHealth: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => monitoringService.getSystemHealth().pipe(
          tapResponse({
            next: (health) => {
              patchState(store, { systemHealth: health, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load system health',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Start metrics streaming
    startStreaming: () => {
      patchState(store, { isStreaming: true });
      streamService.connectToMonitoring({
        metrics: true,
        alerts: true,
        logs: false,
        health: true
      }).subscribe({
        next: (message) => {
          if (message.type === 'metrics' && message.payload) {
            patchState(store, (state) => ({
              currentMetrics: message.payload,
              metricsHistory: [...state.metricsHistory.slice(-99), message.payload]
            }));
          } else if (message.type === 'alert' && message.payload) {
            patchState(store, (state) => ({
              alerts: [message.payload, ...state.alerts].slice(0, 100)
            }));
          }
        },
        error: (error) => {
          patchState(store, {
            error: error.message || 'Streaming error',
            isStreaming: false
          });
        }
      });
    },

    // Stop metrics streaming
    stopStreaming: () => {
      streamService.disconnectMonitoring();
      patchState(store, { isStreaming: false });
    },

    // Add alert
    addAlert: (alert: { id: string; severity: 'info' | 'warning' | 'critical'; message: string; timestamp: string }) => {
      patchState(store, (state) => ({
        alerts: [alert, ...state.alerts].slice(0, 100)
      }));
    },

    // Clear alerts
    clearAlerts: () => {
      patchState(store, { alerts: [] });
    },

    // Dismiss alert
    dismissAlert: (alertId: string) => {
      patchState(store, (state) => ({
        alerts: state.alerts.filter(a => a.id !== alertId)
      }));
    },

    // Select build
    selectBuild: (build: BuildDetails | null) => {
      patchState(store, { selectedBuild: build });
    },

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    },

    // Clear metrics history
    clearMetricsHistory: () => {
      patchState(store, { metricsHistory: [] });
    }
  })),
  withComputed((store) => ({
    // Check if has current metrics
    hasMetrics: computed(() => store.currentMetrics() !== null),

    // Get CPU usage
    cpuUsage: computed(() => store.currentMetrics()?.cpu_usage ?? 0),

    // Get memory usage
    memoryUsage: computed(() => store.currentMetrics()?.memory_usage ?? 0),

    // Get disk usage
    diskUsage: computed(() => store.currentMetrics()?.disk_usage ?? 0),

    // Get active connections
    activeConnections: computed(() => store.currentMetrics()?.active_connections ?? 0),

    // Get requests per second
    requestsPerSecond: computed(() => store.currentMetrics()?.requests_per_second ?? 0),

    // Get average response time
    avgResponseTime: computed(() => store.currentMetrics()?.average_response_time ?? 0),

    // Get error rate
    errorRate: computed(() => store.currentMetrics()?.error_rate ?? 0),

    // Check if system is healthy
    isHealthy: computed(() => store.systemHealth()?.overall_status === 'healthy'),

    // Get unhealthy services
    unhealthyServices: computed(() => {
      const health = store.systemHealth();
      return health ? (health.services as any[]).filter(s => s.status !== 'healthy') : [];
    }),

    // Get build count
    buildCount: computed(() => store.builds()?.total ?? 0),

    // Get successful builds count
    successfulBuilds: computed(() => {
      const builds = store.builds()?.builds ?? [];
      return builds.filter(b => b.status === 'success').length;
    }),

    // Get failed builds count
    failedBuilds: computed(() => {
      const builds = store.builds()?.builds ?? [];
      return builds.filter(b => b.status === 'failed').length;
    }),

    // Get success rate
    buildSuccessRate: computed(() => {
      const builds = store.builds()?.builds ?? [];
      if (builds.length === 0) return 0;
      const successful = builds.filter(b => b.status === 'success').length;
      return Math.round((successful / builds.length) * 100);
    }),

    // Get critical alerts count
    criticalAlerts: computed(() => {
      return store.alerts().filter(a => a.severity === 'critical').length;
    }),

    // Get warning alerts count
    warningAlerts: computed(() => {
      return store.alerts().filter(a => a.severity === 'warning').length;
    }),

    // Check if streaming
    isStreamingActive: computed(() => store.isStreaming()),

    // Get metrics history for charts
    chartData: computed(() => {
      const history = store.metricsHistory();
      return {
        timestamps: history.map(m => new Date(m.timestamp).toLocaleTimeString()),
        cpu: history.map(m => m.cpu_usage),
        memory: history.map(m => m.memory_usage),
        disk: history.map(m => m.disk_usage)
      };
    })
  }))
);
