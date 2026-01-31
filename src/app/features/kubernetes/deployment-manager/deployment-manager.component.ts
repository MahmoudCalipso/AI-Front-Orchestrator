import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../shared/services/toast.service';

interface Deployment {
    id: string;
    name: string;
    namespace: string;
    replicas: number;
    ready_replicas: number;
    status: 'running' | 'pending' | 'failed';
    image: string;
    created_at: string;
}

@Component({
    selector: 'app-deployment-manager',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatChipsModule,
        MatMenuModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="deployment-container">
      <!-- Header -->
      <div class="deployment-header">
        <button mat-icon-button routerLink="/kubernetes" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>deployed_code</mat-icon>
            Deployment Manager
          </h1>
          <p class="subtitle">Manage Kubernetes deployments</p>
        </div>
        <div class="header-actions">
          <button mat-flat-button routerLink="/kubernetes/manifests" color="primary">
            <mat-icon>add</mat-icon>
            New Deployment
          </button>
        </div>
      </div>

      <!-- Deployments Table -->
      <div class="deployments-panel glass-panel">
        @if (loading()) {
          <div class="loading-state">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading deployments...</p>
          </div>
        } @else if (deployments().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">deployed_code</mat-icon>
            <h2>No Deployments</h2>
            <p>Create your first deployment to get started</p>
            <button mat-flat-button routerLink="/kubernetes/manifests" color="primary">
              <mat-icon>add</mat-icon>
              Create Deployment
            </button>
          </div>
        } @else {
          <table mat-table [dataSource]="deployments()" class="deployments-table">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let deployment">
                <div class="deployment-name">
                  <mat-icon>deployed_code</mat-icon>
                  <span>{{ deployment.name }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Namespace Column -->
            <ng-container matColumnDef="namespace">
              <th mat-header-cell *matHeaderCellDef>Namespace</th>
              <td mat-cell *matCellDef="let deployment">
                <mat-chip>{{ deployment.namespace }}</mat-chip>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let deployment">
                <mat-chip [class]="'status-' + deployment.status">
                  {{ deployment.status }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Replicas Column -->
            <ng-container matColumnDef="replicas">
              <th mat-header-cell *matHeaderCellDef>Replicas</th>
              <td mat-cell *matCellDef="let deployment">
                <span class="replicas">{{ deployment.ready_replicas }}/{{ deployment.replicas }}</span>
              </td>
            </ng-container>

            <!-- Image Column -->
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef>Image</th>
              <td mat-cell *matCellDef="let deployment">
                <code class="image-tag">{{ deployment.image }}</code>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let deployment">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="scaleDeployment(deployment)">
                    <mat-icon>unfold_more</mat-icon>
                    <span>Scale</span>
                  </button>
                  <button mat-menu-item (click)="viewLogs(deployment)">
                    <mat-icon>description</mat-icon>
                    <span>View Logs</span>
                  </button>
                  <button mat-menu-item (click)="restartDeployment(deployment)">
                    <mat-icon>refresh</mat-icon>
                    <span>Restart</span>
                  </button>
                  <button mat-menu-item (click)="deleteDeployment(deployment)" class="danger">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        }
      </div>
    </div>
  `,
    styleUrls: ['./deployment-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentManagerComponent implements OnInit {
    private toast = inject(ToastService);

    loading = signal(false);
    deployments = signal<Deployment[]>([]);
    displayedColumns = ['name', 'namespace', 'status', 'replicas', 'image', 'actions'];

    ngOnInit() {
        this.loadDeployments();
    }

    loadDeployments() {
        this.loading.set(true);
        // Simulate API call
        setTimeout(() => {
            this.deployments.set([
                {
                    id: '1',
                    name: 'frontend-app',
                    namespace: 'production',
                    replicas: 3,
                    ready_replicas: 3,
                    status: 'running',
                    image: 'nginx:1.21',
                    created_at: '2024-01-15T10:00:00Z'
                },
                {
                    id: '2',
                    name: 'backend-api',
                    namespace: 'production',
                    replicas: 5,
                    ready_replicas: 4,
                    status: 'pending',
                    image: 'node:18-alpine',
                    created_at: '2024-01-16T14:30:00Z'
                },
                {
                    id: '3',
                    name: 'worker-service',
                    namespace: 'staging',
                    replicas: 2,
                    ready_replicas: 2,
                    status: 'running',
                    image: 'python:3.11-slim',
                    created_at: '2024-01-17T09:15:00Z'
                }
            ]);
            this.loading.set(false);
        }, 1000);
    }

    scaleDeployment(deployment: Deployment) {
        this.toast.info(`Scaling ${deployment.name}...`);
    }

    viewLogs(deployment: Deployment) {
        this.toast.info(`Viewing logs for ${deployment.name}`);
    }

    restartDeployment(deployment: Deployment) {
        this.toast.success(`Restarting ${deployment.name}`);
    }

    deleteDeployment(deployment: Deployment) {
        this.toast.success(`Deleted ${deployment.name}`);
        this.deployments.update(deps => deps.filter(d => d.id !== deployment.id));
    }
}
