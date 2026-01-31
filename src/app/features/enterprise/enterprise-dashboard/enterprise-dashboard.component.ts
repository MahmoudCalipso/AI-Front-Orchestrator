import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface KPI {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
}

@Component({
    selector: 'app-enterprise-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    template: `
    <div class="enterprise-container">
      <div class="enterprise-header">
        <h1>
          <mat-icon>business</mat-icon>
          Enterprise Console
        </h1>
        <p class="subtitle">Monitor and manage your organization</p>
      </div>

      <!-- KPIs -->
      <div class="kpi-grid">
        @for (kpi of kpis(); track kpi.label) {
          <div class="kpi-card glass-panel">
            <div class="kpi-icon">
              <mat-icon>{{ kpi.icon }}</mat-icon>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">{{ kpi.label }}</span>
              <h2 class="kpi-value">{{ kpi.value }}</h2>
              <span class="kpi-change" [class.positive]="kpi.trend === 'up'" [class.negative]="kpi.trend === 'down'">
                <mat-icon>{{ kpi.trend === 'up' ? 'trending_up' : 'trending_down' }}</mat-icon>
                {{ kpi.change }}
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <button mat-flat-button routerLink="/enterprise/users" class="action-card">
            <mat-icon>people</mat-icon>
            <span>Manage Users</span>
          </button>
          <button mat-flat-button routerLink="/enterprise/billing" class="action-card">
            <mat-icon>receipt</mat-icon>
            <span>View Billing</span>
          </button>
          <button mat-flat-button routerLink="/enterprise/analytics" class="action-card">
            <mat-icon>analytics</mat-icon>
            <span>Analytics</span>
          </button>
          <button mat-flat-button routerLink="/settings" class="action-card">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section glass-panel">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          @for (activity of recentActivity(); track activity.id) {
            <div class="activity-item">
              <mat-icon [class]="'activity-icon ' + activity.type">{{ activity.icon }}</mat-icon>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./enterprise-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterpriseDashboardComponent implements OnInit {
    kpis = signal<KPI[]>([]);
    recentActivity = signal<any[]>([]);

    ngOnInit() {
        this.kpis.set([
            { label: 'Total Users', value: '1,247', change: '+12% this month', trend: 'up', icon: 'people' },
            { label: 'Active Projects', value: '342', change: '+8% this month', trend: 'up', icon: 'folder' },
            { label: 'Monthly Revenue', value: '$45,230', change: '+15% this month', trend: 'up', icon: 'attach_money' },
            { label: 'API Calls', value: '2.4M', change: '-3% this month', trend: 'down', icon: 'api' }
        ]);

        this.recentActivity.set([
            { id: '1', type: 'user', icon: 'person_add', text: 'New user registered: john@example.com', time: '2 minutes ago' },
            { id: '2', type: 'project', icon: 'folder', text: 'Project "E-commerce API" created', time: '15 minutes ago' },
            { id: '3', type: 'billing', icon: 'receipt', text: 'Invoice #1234 generated', time: '1 hour ago' },
            { id: '4', type: 'deployment', icon: 'rocket_launch', text: 'Deployment to production completed', time: '2 hours ago' }
        ]);
    }
}
