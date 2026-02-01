import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '../../../core/store/auth/auth.store';
import { ProjectStore } from '../../../core/store/project/project.store';
import { AIStore } from '../../../core/store/ai/ai.store';
import { AdminService } from '../../../core/services/api/admin.service';

interface UserActivity {
  userId: string;
  userName: string;
  email: string;
  lastActive: string;
  projectsCount: number;
  role: string;
}

interface TenantStats {
  tenantId: string;
  tenantName: string;
  userCount: number;
  projectCount: number;
  storageUsed: number;
  storageLimit: number;
}

@Component({
  selector: 'app-enterprise-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="enterprise-dashboard">
      <!-- Header -->
      <div class="dashboard-header">
        <h2>Enterprise Admin Dashboard</h2>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="refreshData()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </div>

      <!-- Overview Stats -->
      <div class="overview-grid">
        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-icon primary">
              <mat-icon>people</mat-icon>
            </div>
            <div class="overview-content">
              <span class="overview-value">{{ totalUsers() }}</span>
              <span class="overview-label">Total Users</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-icon accent">
              <mat-icon>folder</mat-icon>
            </div>
            <div class="overview-content">
              <span class="overview-value">{{ totalProjects() }}</span>
              <span class="overview-label">Total Projects</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-icon success">
              <mat-icon>smart_toy</mat-icon>
            </div>
            <div class="overview-content">
              <span class="overview-value">{{ totalAgents() }}</span>
              <span class="overview-label">Active Agents</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-icon warn">
              <mat-icon>business</mat-icon>
            </div>
            <div class="overview-content">
              <span class="overview-value">{{ totalTenants() }}</span>
              <span class="overview-label">Tenants</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabs -->
      <mat-tab-group class="dashboard-tabs">
        <!-- User Activity Tab -->
        <mat-tab label="User Activity">
          <div class="tab-content">
            <h3>Recent User Activity</h3>
            <table mat-table [dataSource]="userActivities()" class="data-table">
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-cell">
                    <mat-icon>account_circle</mat-icon>
                    <div class="user-info">
                      <span class="user-name">{{ user.userName }}</span>
                      <span class="user-email">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="getRoleColor(user.role)" highlighted>
                    {{ user.role }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="projects">
                <th mat-header-cell *matHeaderCellDef>Projects</th>
                <td mat-cell *matCellDef="let user">{{ user.projectsCount }}</td>
              </ng-container>

              <ng-container matColumnDef="lastActive">
                <th mat-header-cell *matHeaderCellDef>Last Active</th>
                <td mat-cell *matCellDef="let user">{{ user.lastActive | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matTooltip]="'View Details'">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
            </table>
          </div>
        </mat-tab>

        <!-- Tenant Distribution Tab -->
        <mat-tab label="Tenant Distribution">
          <div class="tab-content">
            <h3>Tenant Resource Usage</h3>
            <div class="tenants-grid">
              @for (tenant of tenantStats(); track tenant.tenantId) {
                <mat-card class="tenant-card">
                  <mat-card-header>
                    <mat-icon mat-card-avatar>business</mat-icon>
                    <mat-card-title>{{ tenant.tenantName }}</mat-card-title>
                    <mat-card-subtitle>{{ tenant.userCount }} users · {{ tenant.projectCount }} projects</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="storage-usage">
                      <div class="storage-header">
                        <span>Storage Usage</span>
                        <span>{{ formatStorage(tenant.storageUsed) }} / {{ formatStorage(tenant.storageLimit) }}</span>
                      </div>
                      <mat-progress-bar
                        mode="determinate"
                        [value]="(tenant.storageUsed / tenant.storageLimit * 100) || 0"
                        [class.high]="tenant.storageUsed / tenant.storageLimit > 0.8">
                      </mat-progress-bar>
                      <span class="storage-percentage">
                        {{ (tenant.storageUsed / tenant.storageLimit * 100).toFixed(1) }}%
                      </span>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
              @empty {
                <div class="empty-state">
                  <mat-icon>business</mat-icon>
                  <p>No tenants found</p>
                </div>
              }
            </div>
          </div>
        </mat-tab>

        <!-- Resource Usage Tab -->
        <mat-tab label="Resource Usage">
          <div class="tab-content">
            <h3>Team Resource Usage</h3>
            <div class="resource-stats">
              <mat-card class="resource-card">
                <mat-card-content>
                  <mat-icon>storage</mat-icon>
                  <div class="resource-info">
                    <span class="resource-value">{{ formatStorage(totalStorageUsed()) }}</span>
                    <span class="resource-label">Total Storage Used</span>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="resource-card">
                <mat-card-content>
                  <mat-icon>memory</mat-icon>
                  <div class="resource-info">
                    <span class="resource-value">{{ avgCpuUsage() }}%</span>
                    <span class="resource-label">Avg CPU Usage</span>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="resource-card">
                <mat-card-content>
                  <mat-icon>speed</mat-icon>
                  <div class="resource-info">
                    <span class="resource-value">{{ totalApiCalls() }}</span>
                    <span class="resource-label">API Calls (24h)</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .enterprise-dashboard {
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

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .overview-card {
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
      }

      .overview-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;

        &.primary { background-color: #e3f2fd; color: #1976d2; }
        &.accent { background-color: #f3e5f5; color: #9c27b0; }
        &.success { background-color: #e8f5e9; color: #4caf50; }
        &.warn { background-color: #fff3e0; color: #ff9800; }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .overview-content {
        display: flex;
        flex-direction: column;

        .overview-value {
          font-size: 24px;
          font-weight: 600;
        }

        .overview-label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .dashboard-tabs {
      margin-top: 24px;

      .tab-content {
        padding: 24px;

        h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 500;
        }
      }
    }

    .data-table {
      width: 100%;

      .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;

        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
          color: rgba(0, 0, 0, 0.38);
        }

        .user-info {
          display: flex;
          flex-direction: column;

          .user-name {
            font-weight: 500;
          }

          .user-email {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }

    .tenants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 16px;
    }

    .tenant-card {
      .storage-usage {
        margin-top: 16px;

        .storage-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        mat-progress-bar {
          margin-bottom: 4px;

          &.high ::ng-deep .mat-mdc-progress-bar-fill {
            background-color: #f44336 !important;
          }
        }

        .storage-percentage {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .resource-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .resource-card {
      mat-card-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
      }

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #1976d2;
      }

      .resource-info {
        display: flex;
        flex-direction: column;

        .resource-value {
          font-size: 20px;
          font-weight: 600;
        }

        .resource-label {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: rgba(0, 0, 0, 0.38);

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
      }
    }
  `]
})
export class EnterpriseAdminDashboardComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly projectStore = inject(ProjectStore);
  private readonly aiStore = inject(AIStore);
  private readonly adminService = inject(AdminService);

  readonly userColumns = ['user', 'role', 'projects', 'lastActive', 'actions'];

  // Computed values
  readonly totalUsers = computed(() => this.authStore.user() ? 1 : 0); // Placeholder - would come from admin service
  readonly totalProjects = computed(() => this.projectStore.projectCount());
  readonly totalAgents = computed(() => this.aiStore.agentCount());
  readonly totalTenants = computed(() => 1); // Placeholder

  readonly userActivities = computed<UserActivity[]>(() => {
    // Placeholder - would come from admin service
    return [
      {
        userId: '1',
        userName: this.authStore.userName() || 'Admin',
        email: this.authStore.userEmail() || 'admin@example.com',
        lastActive: new Date().toISOString(),
        projectsCount: this.projectStore.projectCount(),
        role: this.authStore.userRole() || 'admin'
      }
    ];
  });

  readonly tenantStats = computed<TenantStats[]>(() => {
    // Placeholder - would come from admin service
    return [
      {
        tenantId: '1',
        tenantName: 'Default Tenant',
        userCount: this.totalUsers(),
        projectCount: this.totalProjects(),
        storageUsed: 1024 * 1024 * 1024, // 1GB
        storageLimit: 10 * 1024 * 1024 * 1024 // 10GB
      }
    ];
  });

  readonly totalStorageUsed = computed(() => {
    return this.tenantStats().reduce((acc, t) => acc + t.storageUsed, 0);
  });

  readonly avgCpuUsage = computed(() => 45); // Placeholder
  readonly totalApiCalls = computed(() => 1250); // Placeholder

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.projectStore.loadProjects();
    this.aiStore.loadAgents();
    // Load admin data
    this.adminService.getPlatformStatistics().subscribe({
      next: (stats: any) => {
        // Update stats
      },
      error: (error: any) => {
        console.error('Failed to load platform statistics:', error);
      }
    });
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'super_admin': return 'warn';
      case 'admin': return 'primary';
      case 'user': return 'accent';
      default: return '';
    }
  }

  formatStorage(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
