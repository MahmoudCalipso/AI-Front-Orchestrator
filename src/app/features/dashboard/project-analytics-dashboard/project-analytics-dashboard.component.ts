import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectStore } from '../../../core/store/project/project.store';
import { MonitoringStore } from '../../../core/store/monitoring/monitoring.store';
import { AIStore } from '../../../core/store/ai/ai.store';

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  buildSuccessRate: number;
  avgBuildTime: number;
  totalBuilds: number;
  successfulBuilds: number;
  failedBuilds: number;
}

interface LanguageDistribution {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-project-analytics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="analytics-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h2>Project Analytics</h2>
        <div class="header-actions">
          <button mat-icon-button (click)="refreshData()" matTooltip="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon primary">
              <mat-icon>folder</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().totalProjects }}</span>
              <span class="stat-label">Total Projects</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon success">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().buildSuccessRate }}%</span>
              <span class="stat-label">Build Success Rate</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon accent">
              <mat-icon>build</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().totalBuilds }}</span>
              <span class="stat-label">Total Builds</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon warn">
              <mat-icon>timer</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats().avgBuildTime }}s</span>
              <span class="stat-label">Avg Build Time</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Build Status Distribution -->
      <div class="build-status-section">
        <h3>Build Status Distribution</h3>
        <div class="status-bars">
          <div class="status-item">
            <div class="status-header">
              <span class="status-label">
                <mat-icon class="success">check_circle</mat-icon>
                Successful
              </span>
              <span class="status-value">{{ stats().successfulBuilds }}</span>
            </div>
            <div class="status-bar">
              <div class="status-fill success" [style.width.%]="(stats().successfulBuilds / stats().totalBuilds * 100) || 0"></div>
            </div>
          </div>

          <div class="status-item">
            <div class="status-header">
              <span class="status-label">
                <mat-icon class="error">error</mat-icon>
                Failed
              </span>
              <span class="status-value">{{ stats().failedBuilds }}</span>
            </div>
            <div class="status-bar">
              <div class="status-fill error" [style.width.%]="(stats().failedBuilds / stats().totalBuilds * 100) || 0"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Language Distribution -->
      <div class="languages-section">
        <h3>Language Distribution</h3>
        <div class="languages-grid">
          @for (lang of languageDistribution(); track lang.language) {
            <div class="language-item">
              <div class="language-header">
                <span class="language-name">{{ lang.language || 'Unknown' }}</span>
                <span class="language-count">{{ lang.count }} projects</span>
              </div>
              <div class="language-bar">
                <div class="language-fill" [style.width.%]="lang.percentage" [style.background-color]="lang.color"></div>
              </div>
              <span class="language-percentage">{{ lang.percentage }}%</span>
            </div>
          }
          @empty {
            <div class="empty-state">
              <mat-icon>code</mat-icon>
              <p>No projects to analyze</p>
            </div>
          }
        </div>
      </div>

      <!-- Recent Builds -->
      <div class="recent-builds-section">
        <h3>Recent Builds</h3>
        <table mat-table [dataSource]="recentBuilds()" class="builds-table">
          <ng-container matColumnDef="project">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let build">{{ build.project_name }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let build">
              <mat-chip [color]="getStatusColor(build.status)" highlighted>
                {{ build.status }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="trigger">
            <th mat-header-cell *matHeaderCellDef>Trigger</th>
            <td mat-cell *matCellDef="let build">{{ build.trigger }}</td>
          </ng-container>

          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef>Duration</th>
            <td mat-cell *matCellDef="let build">{{ build.duration ? build.duration + 's' : '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="started">
            <th mat-header-cell *matHeaderCellDef>Started</th>
            <td mat-cell *matCellDef="let build">{{ build.started_at | date:'short' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="buildColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: buildColumns;"></tr>
        </table>
      </div>

      <!-- AI Operations Stats -->
      <div class="ai-operations-section">
        <h3>AI Operations</h3>
        <div class="ai-stats-grid">
          <mat-card class="ai-stat-card">
            <mat-card-content>
              <mat-icon>psychology</mat-icon>
              <div class="ai-stat-content">
                <span class="ai-stat-value">{{ aiStore.agentCount() }}</span>
                <span class="ai-stat-label">Active Agents</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="ai-stat-card">
            <mat-card-content>
              <mat-icon>model_training</mat-icon>
              <div class="ai-stat-content">
                <span class="ai-stat-value">{{ aiStore.modelCount() }}</span>
                <span class="ai-stat-label">Available Models</span>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="ai-stat-card">
            <mat-card-content>
              <mat-icon>chat</mat-icon>
              <div class="ai-stat-content">
                <span class="ai-stat-value">{{ aiStore.chatHistoryLength() }}</span>
                <span class="ai-stat-label">Chat Messages</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-dashboard {
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
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
      }

      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;

        &.primary { background-color: #e3f2fd; color: #1976d2; }
        &.success { background-color: #e8f5e9; color: #4caf50; }
        &.accent { background-color: #f3e5f5; color: #9c27b0; }
        &.warn { background-color: #fff3e0; color: #ff9800; }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .stat-content {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 24px;
          font-weight: 600;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .build-status-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .status-bars {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .status-item {
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .status-label {
            display: flex;
            align-items: center;
            gap: 8px;

            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;

              &.success { color: #4caf50; }
              &.error { color: #f44336; }
            }
          }

          .status-value {
            font-weight: 500;
          }
        }

        .status-bar {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;

          .status-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;

            &.success { background-color: #4caf50; }
            &.error { background-color: #f44336; }
          }
        }
      }
    }

    .languages-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .languages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
      }

      .language-item {
        .language-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .language-name {
            font-weight: 500;
          }

          .language-count {
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
          }
        }

        .language-bar {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;

          .language-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
          }
        }

        .language-percentage {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
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

    .recent-builds-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .builds-table {
        width: 100%;
      }
    }

    .ai-operations-section {
      h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .ai-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .ai-stat-card {
        mat-card-content {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }

        mat-icon {
          color: #7c4dff;
          font-size: 32px;
          width: 32px;
          height: 32px;
        }

        .ai-stat-content {
          display: flex;
          flex-direction: column;

          .ai-stat-value {
            font-size: 24px;
            font-weight: 600;
          }

          .ai-stat-label {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  `]
})
export class ProjectAnalyticsDashboardComponent implements OnInit {
  private readonly projectStore = inject(ProjectStore);
  readonly monitoringStore = inject(MonitoringStore);
  readonly aiStore = inject(AIStore);

  readonly buildColumns = ['project', 'status', 'trigger', 'duration', 'started'];

  // Computed stats
  readonly stats = computed<ProjectStats>(() => {
    const builds = this.monitoringStore.builds()?.builds ?? [];
    const successful = builds.filter(b => b.status === 'success').length;
    const failed = builds.filter(b => b.status === 'failed').length;
    const total = builds.length;

    return {
      totalProjects: this.projectStore.projectCount(),
      activeProjects: this.projectStore.projects().filter(p => p.status === 'active').length,
      buildSuccessRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      avgBuildTime: total > 0 ? Math.round(builds.reduce((acc, b) => acc + (b.duration || 0), 0) / total) : 0,
      totalBuilds: total,
      successfulBuilds: successful,
      failedBuilds: failed
    };
  });

  // Language distribution
  readonly languageDistribution = computed<LanguageDistribution[]>(() => {
    const projects = this.projectStore.projects();
    const languages = new Map<string, number>();

    projects.forEach(p => {
      const lang = p.language || 'Unknown';
      languages.set(lang, (languages.get(lang) || 0) + 1);
    });

    const total = projects.length;
    const colors = ['#1976d2', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4', '#795548', '#607d8b'];

    return Array.from(languages.entries())
      .map(([language, count], index) => ({
        language,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count);
  });

  // Recent builds
  readonly recentBuilds = computed(() => {
    return this.monitoringStore.builds()?.builds?.slice(0, 10) ?? [];
  });

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.projectStore.loadProjects();
    this.monitoringStore.loadBuilds({ page: 1, pageSize: 20 });
    this.aiStore.loadModels();
    this.aiStore.loadAgents();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success': return 'primary';
      case 'failed': return 'warn';
      case 'running': return 'accent';
      default: return '';
    }
  }
}
