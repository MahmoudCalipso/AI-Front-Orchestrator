import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, interval } from 'rxjs';
import { MonitoringStore } from '../../../core/store/monitoring/monitoring.store';
import { AIStore } from '../../../core/store/ai/ai.store';

interface MetricCard {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
}

@Component({
  selector: 'app-system-metrics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="metrics-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h2>System Metrics</h2>
        <div class="header-actions">
          <mat-chip-listbox>
            <mat-chip [color]="isStreaming() ? 'primary' : 'warn'" highlighted>
              {{ isStreaming() ? 'Live' : 'Offline' }}
            </mat-chip>
          </mat-chip-listbox>
          <button mat-icon-button (click)="toggleStreaming()" [matTooltip]="isStreaming() ? 'Stop Streaming' : 'Start Streaming'">
            <mat-icon>{{ isStreaming() ? 'pause' : 'play_arrow' }}</mat-icon>
          </button>
          <button mat-icon-button (click)="refreshMetrics()" matTooltip="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="metrics-grid">
        @for (metric of metricCards(); track metric.title) {
          <mat-card class="metric-card" [class]="'metric-' + metric.color">
            <mat-card-content>
              <div class="metric-header">
                <mat-icon [class]="'metric-icon ' + metric.color">{{ metric.icon }}</mat-icon>
                <div class="metric-trend" [class]="metric.trend">
                  <mat-icon>{{ metric.trend === 'up' ? 'trending_up' : metric.trend === 'down' ? 'trending_down' : 'trending_flat' }}</mat-icon>
                  <span>{{ metric.trendValue }}</span>
                </div>
              </div>
              <div class="metric-value">
                <span class="value">{{ metric.value }}</span>
                <span class="unit">{{ metric.unit }}</span>
              </div>
              <div class="metric-title">{{ metric.title }}</div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Resource Usage Section -->
      <div class="resources-section">
        <h3>Resource Usage</h3>
        <div class="resource-bars">
          <div class="resource-item">
            <div class="resource-label">
              <mat-icon>memory</mat-icon>
              <span>CPU Usage</span>
              <span class="resource-value">{{ cpuUsage() | number:'1.1-1' }}%</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="cpuUsage()" [class.high]="cpuUsage() > 80" [class.medium]="cpuUsage() > 50"></mat-progress-bar>
          </div>

          <div class="resource-item">
            <div class="resource-label">
              <mat-icon>storage</mat-icon>
              <span>Memory Usage</span>
              <span class="resource-value">{{ memoryUsage() | number:'1.1-1' }}%</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="memoryUsage()" [class.high]="memoryUsage() > 80" [class.medium]="memoryUsage() > 50"></mat-progress-bar>
          </div>

          <div class="resource-item">
            <div class="resource-label">
              <mat-icon>disc_full</mat-icon>
              <span>Disk Usage</span>
              <span class="resource-value">{{ diskUsage() | number:'1.1-1' }}%</span>
            </div>
            <mat-progress-bar mode="determinate" [value]="diskUsage()" [class.high]="diskUsage() > 80" [class.medium]="diskUsage() > 50"></mat-progress-bar>
          </div>
        </div>
      </div>

      <!-- Active Models Section -->
      <div class="models-section">
        <h3>Active AI Models</h3>
        <div class="models-grid">
          @for (model of loadedModels(); track model.id) {
            <mat-card class="model-card">
              <mat-card-content>
                <div class="model-header">
                  <mat-icon>smart_toy</mat-icon>
                  <span class="model-name">{{ model.name }}</span>
                  <mat-chip [color]="'primary'" highlighted>Active</mat-chip>
                </div>
                <div class="model-stats">
                  <div class="stat">
                    <span class="stat-label">Type</span>
                    <span class="stat-value">{{ model.type || 'LLM' }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Size</span>
                    <span class="stat-value">{{ model.size || 'N/A' }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
          @empty {
            <div class="empty-state">
              <mat-icon>smart_toy</mat-icon>
              <p>No active models</p>
            </div>
          }
        </div>
      </div>

      <!-- Alerts Section -->
      @if (hasAlerts()) {
        <div class="alerts-section">
          <h3>Active Alerts</h3>
          <div class="alerts-list">
            @for (alert of alerts(); track alert.id) {
              <div class="alert-item" [class]="'alert-' + alert.severity">
                <mat-icon>{{ alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info' }}</mat-icon>
                <span class="alert-message">{{ alert.message }}</span>
                <span class="alert-time">{{ alert.timestamp | date:'shortTime' }}</span>
                <button mat-icon-button (click)="dismissAlert(alert.id)" matTooltip="Dismiss">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .metrics-dashboard {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metric-card {
      mat-card-content {
        padding: 16px;
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .metric-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;

          &.primary { color: #1976d2; }
          &.accent { color: #7c4dff; }
          &.warn { color: #ff9800; }
          &.success { color: #4caf50; }
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;

          &.up { color: #4caf50; }
          &.down { color: #f44336; }
          &.stable { color: #9e9e9e; }

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .metric-value {
        margin-bottom: 4px;

        .value {
          font-size: 32px;
          font-weight: 600;
        }

        .unit {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          margin-left: 4px;
        }
      }

      .metric-title {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .resources-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .resource-bars {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .resource-item {
        .resource-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          mat-icon {
            color: rgba(0, 0, 0, 0.54);
          }

          .resource-value {
            margin-left: auto;
            font-weight: 500;
          }
        }

        mat-progress-bar {
          &.high ::ng-deep .mat-mdc-progress-bar-fill {
            background-color: #f44336 !important;
          }

          &.medium ::ng-deep .mat-mdc-progress-bar-fill {
            background-color: #ff9800 !important;
          }
        }
      }
    }

    .models-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .models-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }

      .model-card {
        mat-card-content {
          padding: 16px;
        }

        .model-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;

          mat-icon {
            color: #1976d2;
          }

          .model-name {
            flex: 1;
            font-weight: 500;
          }
        }

        .model-stats {
          display: flex;
          gap: 24px;

          .stat {
            display: flex;
            flex-direction: column;

            .stat-label {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.6);
            }

            .stat-value {
              font-size: 14px;
              font-weight: 500;
            }
          }
        }
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32px;
        color: rgba(0, 0, 0, 0.38);

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          margin-bottom: 8px;
        }
      }
    }

    .alerts-section {
      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .alerts-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .alert-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;

        &.alert-critical {
          background-color: #ffebee;
          color: #c62828;
        }

        &.alert-warning {
          background-color: #fff3e0;
          color: #ef6c00;
        }

        &.alert-info {
          background-color: #e3f2fd;
          color: #1565c0;
        }

        .alert-message {
          flex: 1;
        }

        .alert-time {
          font-size: 12px;
          opacity: 0.7;
        }
      }
    }
  `]
})
export class SystemMetricsDashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly monitoringStore = inject(MonitoringStore);
  private readonly aiStore = inject(AIStore);

  // Signals from stores
  readonly cpuUsage = computed(() => this.monitoringStore.cpuUsage());
  readonly memoryUsage = computed(() => this.monitoringStore.memoryUsage());
  readonly diskUsage = computed(() => this.monitoringStore.diskUsage());
  readonly activeConnections = computed(() => this.monitoringStore.activeConnections());
  readonly requestsPerSecond = computed(() => this.monitoringStore.requestsPerSecond());
  readonly avgResponseTime = computed(() => this.monitoringStore.avgResponseTime());
  readonly errorRate = computed(() => this.monitoringStore.errorRate());
  readonly isStreaming = computed(() => this.monitoringStore.isStreamingActive());
  readonly alerts = computed(() => this.monitoringStore.alerts());
  readonly hasAlerts = computed(() => this.monitoringStore.alerts().length > 0);
  readonly loadedModels = computed(() => this.aiStore.loadedModels());

  // Computed metric cards
  readonly metricCards = computed<MetricCard[]>(() => [
    {
      title: 'CPU Usage',
      value: this.cpuUsage().toFixed(1),
      unit: '%',
      icon: 'memory',
      color: this.cpuUsage() > 80 ? 'warn' : 'primary',
      trend: this.getTrend(this.cpuUsage(), 50),
      trendValue: `${Math.abs(this.cpuUsage() - 50).toFixed(1)}%`
    },
    {
      title: 'Memory Usage',
      value: this.memoryUsage().toFixed(1),
      unit: '%',
      icon: 'storage',
      color: this.memoryUsage() > 80 ? 'warn' : 'accent',
      trend: this.getTrend(this.memoryUsage(), 60),
      trendValue: `${Math.abs(this.memoryUsage() - 60).toFixed(1)}%`
    },
    {
      title: 'Active Connections',
      value: this.activeConnections(),
      unit: '',
      icon: 'people',
      color: 'success',
      trend: 'stable',
      trendValue: '0%'
    },
    {
      title: 'Requests/sec',
      value: this.requestsPerSecond().toFixed(0),
      unit: 'req/s',
      icon: 'speed',
      color: 'primary',
      trend: this.requestsPerSecond() > 100 ? 'up' : 'stable',
      trendValue: `${this.requestsPerSecond().toFixed(0)}/s`
    },
    {
      title: 'Avg Response Time',
      value: this.avgResponseTime().toFixed(0),
      unit: 'ms',
      icon: 'timer',
      color: this.avgResponseTime() > 500 ? 'warn' : 'success',
      trend: this.avgResponseTime() > 200 ? 'up' : 'down',
      trendValue: `${this.avgResponseTime().toFixed(0)}ms`
    },
    {
      title: 'Error Rate',
      value: (this.errorRate() * 100).toFixed(2),
      unit: '%',
      icon: 'error_outline',
      color: this.errorRate() > 0.05 ? 'warn' : 'success',
      trend: this.errorRate() > 0.01 ? 'up' : 'down',
      trendValue: `${(this.errorRate() * 100).toFixed(2)}%`
    }
  ]);

  ngOnInit(): void {
    // Load initial metrics
    this.monitoringStore.loadCurrentMetrics();
    this.aiStore.loadModels();

    // Start auto-refresh every 30 seconds if not streaming
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.isStreaming()) {
          this.monitoringStore.loadCurrentMetrics();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.monitoringStore.stopStreaming();
  }

  toggleStreaming(): void {
    if (this.isStreaming()) {
      this.monitoringStore.stopStreaming();
    } else {
      this.monitoringStore.startStreaming();
    }
  }

  refreshMetrics(): void {
    this.monitoringStore.loadCurrentMetrics();
    this.aiStore.loadModels();
  }

  dismissAlert(alertId: string): void {
    this.monitoringStore.dismissAlert(alertId);
  }

  private getTrend(current: number, baseline: number): 'up' | 'down' | 'stable' {
    const diff = current - baseline;
    if (Math.abs(diff) < 5) return 'stable';
    return diff > 0 ? 'up' : 'down';
  }
}
