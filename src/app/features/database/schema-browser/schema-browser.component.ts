import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

interface TableSchema {
  name: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  rowCount: number;
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
}

@Component({
  selector: 'app-schema-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="schema-container">
      <!-- Header -->
      <div class="schema-header">
        <button mat-icon-button routerLink="/database" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>account_tree</mat-icon>
            Schema Browser
          </h1>
          <p class="subtitle">{{ connectionId() }}</p>
        </div>
      </div>

      <!-- Layout -->
      <div class="schema-layout">
        <!-- Sidebar: Table List -->
        <aside class="tables-sidebar glass-panel">
          <div class="sidebar-header">
            <h2>Tables</h2>
            <span class="table-count">{{ tables().length }}</span>
          </div>
          
          <div class="search-bar">
            <mat-icon>search</mat-icon>
            <input type="text" placeholder="Search tables...">
          </div>

          <div class="tables-list">
            @for (table of tables(); track table.name) {
              <div class="table-item" 
                   [class.active]="selectedTable() === table.name"
                   (click)="selectTable(table.name)">
                <mat-icon>table_chart</mat-icon>
                <div class="table-info">
                  <span class="table-name">{{ table.name }}</span>
                  <span class="table-rows">{{ table.rowCount }} rows</span>
                </div>
              </div>
            }
          </div>
        </aside>

        <!-- Main: Table Details -->
        <main class="schema-main">
          @if (selectedTable()) {
            <div class="table-details glass-panel">
              <div class="details-header">
                <h2>{{ selectedTable() }}</h2>
                <div class="header-actions">
                  <button mat-stroked-button [routerLink]="['../query']">
                    <mat-icon>code</mat-icon>
                    Query
                  </button>
                </div>
              </div>

              <mat-tab-group class="details-tabs">
                <!-- Columns Tab -->
                <mat-tab label="Columns">
                  <div class="tab-content">
                    <table mat-table [dataSource]="getSelectedTableSchema()?.columns || []" class="columns-table">
                      <ng-container matColumnDef="name">
                        <th mat-header-cell *matHeaderCellDef>Column</th>
                        <td mat-cell *matCellDef="let column">
                          <div class="column-name">
                            {{ column.name }}
                            @if (column.isPrimaryKey) {
                              <mat-icon class="key-icon primary">key</mat-icon>
                            }
                            @if (column.isForeignKey) {
                              <mat-icon class="key-icon foreign">link</mat-icon>
                            }
                          </div>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="type">
                        <th mat-header-cell *matHeaderCellDef>Type</th>
                        <td mat-cell *matCellDef="let column">
                          <span class="type-badge">{{ column.type }}</span>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="nullable">
                        <th mat-header-cell *matHeaderCellDef>Nullable</th>
                        <td mat-cell *matCellDef="let column">
                          <mat-chip [class.nullable]="column.nullable">
                            {{ column.nullable ? 'Yes' : 'No' }}
                          </mat-chip>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="default">
                        <th mat-header-cell *matHeaderCellDef>Default</th>
                        <td mat-cell *matCellDef="let column">
                          <code class="default-value">{{ column.defaultValue || '-' }}</code>
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="columnDisplayColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: columnDisplayColumns;"></tr>
                    </table>
                  </div>
                </mat-tab>

                <!-- Indexes Tab -->
                <mat-tab label="Indexes">
                  <div class="tab-content">
                    @for (index of getSelectedTableSchema()?.indexes || []; track index.name) {
                      <div class="index-card">
                        <div class="index-header">
                          <h4>{{ index.name }}</h4>
                          @if (index.unique) {
                            <mat-chip class="unique-chip">Unique</mat-chip>
                          }
                        </div>
                        <div class="index-columns">
                          @for (col of index.columns; track col) {
                            <mat-chip>{{ col }}</mat-chip>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </mat-tab>
              </mat-tab-group>
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon class="empty-icon">table_chart</mat-icon>
              <h2>Select a table</h2>
              <p>Choose a table from the sidebar to view its schema</p>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./schema-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchemaBrowserComponent {
  private route = inject(ActivatedRoute);

  connectionId = signal<string>('Production DB');
  selectedTable = signal<string | null>('users');
  columnDisplayColumns = ['name', 'type', 'nullable', 'default'];

  tables = signal<TableSchema[]>([
    {
      name: 'users',
      rowCount: 1247,
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'email', type: 'VARCHAR(255)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'name', type: 'VARCHAR(100)', nullable: true, isPrimaryKey: false, isForeignKey: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'NOW()', isPrimaryKey: false, isForeignKey: false }
      ],
      indexes: [
        { name: 'idx_users_email', columns: ['email'], unique: true },
        { name: 'idx_users_created', columns: ['created_at'], unique: false }
      ]
    },
    {
      name: 'projects',
      rowCount: 523,
      columns: [
        { name: 'id', type: 'INTEGER', nullable: false, isPrimaryKey: true, isForeignKey: false },
        { name: 'user_id', type: 'INTEGER', nullable: false, isPrimaryKey: false, isForeignKey: true },
        { name: 'name', type: 'VARCHAR(200)', nullable: false, isPrimaryKey: false, isForeignKey: false },
        { name: 'status', type: 'VARCHAR(50)', nullable: false, isPrimaryKey: false, isForeignKey: false }
      ],
      indexes: [
        { name: 'idx_projects_user', columns: ['user_id'], unique: false }
      ]
    }
  ]);

  selectTable(tableName: string) {
    this.selectedTable.set(tableName);
  }

  getSelectedTableSchema(): TableSchema | undefined {
    return this.tables().find(t => t.name === this.selectedTable());
  }
}
