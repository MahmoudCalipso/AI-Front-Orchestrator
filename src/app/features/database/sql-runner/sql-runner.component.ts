import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface QueryResult {
    columns: string[];
    rows: any[][];
    executionTime: number;
    rowCount: number;
}

@Component({
    selector: 'app-sql-runner',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatProgressSpinnerModule
    ],
    template: `
    <div class="sql-container">
      <!-- Header -->
      <div class="sql-header">
        <button mat-icon-button routerLink="/database" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>code</mat-icon>
            SQL Runner
          </h1>
          <p class="subtitle">{{ connectionId() }}</p>
        </div>
        <div class="header-actions">
          <button mat-stroked-button (click)="clearQuery()" class="clear-btn">
            <mat-icon>clear</mat-icon>
            Clear
          </button>
          <button mat-flat-button (click)="executeQuery()" [disabled]="isExecuting()" class="run-btn">
            <mat-icon>play_arrow</mat-icon>
            Run Query
          </button>
        </div>
      </div>

      <!-- SQL Editor -->
      <div class="sql-editor glass-panel">
        <div class="editor-toolbar">
          <span class="editor-label">Query Editor</span>
          <div class="toolbar-actions">
            <button mat-icon-button matTooltip="Format SQL">
              <mat-icon>format_align_left</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Save Query">
              <mat-icon>save</mat-icon>
            </button>
          </div>
        </div>
        <textarea 
          class="sql-textarea"
          [(ngModel)]="sqlQuery"
          placeholder="-- Enter your SQL query here
SELECT * FROM users LIMIT 10;"
          spellcheck="false"
        ></textarea>
      </div>

      <!-- Results -->
      <div class="results-section">
        @if (isExecuting()) {
          <div class="loading-state glass-panel">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Executing query...</p>
          </div>
        } @else if (queryResult()) {
          <div class="results-panel glass-panel">
            <div class="results-header">
              <div class="results-info">
                <span class="result-count">{{ queryResult()?.rowCount }} rows</span>
                <span class="execution-time">{{ queryResult()?.executionTime }}ms</span>
              </div>
              <div class="results-actions">
                <button mat-icon-button matTooltip="Export CSV">
                  <mat-icon>download</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Copy Results">
                  <mat-icon>content_copy</mat-icon>
                </button>
              </div>
            </div>

            <div class="results-table-container">
              <table class="results-table">
                <thead>
                  <tr>
                    @for (col of queryResult()?.columns || []; track col) {
                      <th>{{ col }}</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of queryResult()?.rows || []; track $index) {
                    <tr>
                      @for (cell of row; track $index) {
                        <td>{{ cell }}</td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @else {
          <div class="empty-state glass-panel">
            <mat-icon class="empty-icon">table_view</mat-icon>
            <h2>No Results</h2>
            <p>Execute a query to see results here</p>
          </div>
        }
      </div>
    </div>
  `,
    styleUrls: ['./sql-runner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SqlRunnerComponent {
    private route = inject(ActivatedRoute);

    connectionId = signal<string>('Production DB');
    sqlQuery = 'SELECT * FROM users LIMIT 10;';
    isExecuting = signal<boolean>(false);
    queryResult = signal<QueryResult | null>(null);

    executeQuery() {
        this.isExecuting.set(true);

        // Simulate query execution
        setTimeout(() => {
            this.queryResult.set({
                columns: ['id', 'email', 'name', 'created_at'],
                rows: [
                    [1, 'john@example.com', 'John Doe', '2024-01-15 10:30:00'],
                    [2, 'jane@example.com', 'Jane Smith', '2024-01-16 14:20:00'],
                    [3, 'bob@example.com', 'Bob Johnson', '2024-01-17 09:15:00'],
                    [4, 'alice@example.com', 'Alice Williams', '2024-01-18 16:45:00'],
                    [5, 'charlie@example.com', 'Charlie Brown', '2024-01-19 11:00:00']
                ],
                executionTime: 42,
                rowCount: 5
            });
            this.isExecuting.set(false);
        }, 1000);
    }

    clearQuery() {
        this.sqlQuery = '';
        this.queryResult.set(null);
    }
}
