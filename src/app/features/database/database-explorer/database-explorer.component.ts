import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

export interface DatabaseConnection {
    id: string;
    name: string;
    type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis';
    host: string;
    port: number;
    database: string;
    status: 'connected' | 'disconnected' | 'error';
    lastConnected?: Date;
}

@Component({
    selector: 'app-database-explorer',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule
    ],
    template: `
    <div class="database-container">
      <!-- Header -->
      <div class="database-header">
        <div class="header-content">
          <h1>
            <mat-icon>storage</mat-icon>
            Database Explorer
          </h1>
          <p class="subtitle">Connect and explore your databases</p>
        </div>
        
        <div class="header-actions">
          <button mat-flat-button class="create-btn" routerLink="connections">
            <mat-icon>add</mat-icon>
            New Connection
          </button>
        </div>
      </div>

      <!-- Connections Grid -->
      <div class="connections-grid">
        @for (connection of connections(); track connection.id) {
          <div class="connection-card glass-card" [class.connected]="connection.status === 'connected'">
            <!-- Status Indicator -->
            <div class="status-indicator" [class]="connection.status"></div>

            <div class="card-header">
              <div class="db-icon" [class]="connection.type">
                <mat-icon>{{ getDbIcon(connection.type) }}</mat-icon>
              </div>
              <div class="connection-identity">
                <h3>{{ connection.name }}</h3>
                <span class="connection-type">{{ connection.type | uppercase }}</span>
              </div>
            </div>

            <div class="card-body">
              <div class="stat-row">
                <span class="stat-label">Host</span>
                <span class="stat-value">{{ connection.host }}:{{ connection.port }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Database</span>
                <span class="stat-value">{{ connection.database }}</span>
              </div>
              @if (connection.lastConnected) {
                <div class="stat-row">
                  <span class="stat-label">Last Connected</span>
                  <span class="stat-value">{{ connection.lastConnected | date:'short' }}</span>
                </div>
              }
            </div>

            <div class="card-actions">
              <button mat-stroked-button class="action-btn" [routerLink]="[connection.id, 'schema']">
                <mat-icon>account_tree</mat-icon>
                Schema
              </button>
              <button mat-stroked-button class="action-btn" [routerLink]="[connection.id, 'query']">
                <mat-icon>code</mat-icon>
                Query
              </button>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (connections().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">storage</mat-icon>
            <h2>No Database Connections</h2>
            <p>Connect to a database to start exploring</p>
            <button mat-flat-button color="primary" routerLink="connections">
              <mat-icon>add</mat-icon>
              Add Connection
            </button>
          </div>
        }
      </div>
    </div>
  `,
    styleUrls: ['./database-explorer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatabaseExplorerComponent {
    connections = signal<DatabaseConnection[]>([
        {
            id: '1',
            name: 'Production DB',
            type: 'postgresql',
            host: 'localhost',
            port: 5432,
            database: 'orchestrator_prod',
            status: 'connected',
            lastConnected: new Date()
        },
        {
            id: '2',
            name: 'Development DB',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            database: 'orchestrator_dev',
            status: 'connected',
            lastConnected: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
            id: '3',
            name: 'Cache Store',
            type: 'redis',
            host: 'localhost',
            port: 6379,
            database: '0',
            status: 'disconnected'
        }
    ]);

    getDbIcon(type: string): string {
        switch (type) {
            case 'postgresql': return 'storage';
            case 'mysql': return 'storage';
            case 'mongodb': return 'data_object';
            case 'sqlite': return 'folder';
            case 'redis': return 'memory';
            default: return 'storage';
        }
    }
}
