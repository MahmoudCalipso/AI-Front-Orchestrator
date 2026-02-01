import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { IDEStore } from '../../../core/store/ide/ide.store';

interface DiagnosticItem {
  id: string;
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code?: string;
  source?: string;
}

@Component({
  selector: 'app-diagnostics-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  template: `
    <div class="diagnostics-panel">
      <div class="panel-header">
        <div class="header-title">
          <h4>Diagnostics</h4>
          <div class="diagnostic-counts">
            <span class="count error" [matBadge]="errorCount()" [matBadgeHidden]="errorCount() === 0">
              <mat-icon>error</mat-icon>
              Errors
            </span>
            <span class="count warning" [matBadge]="warningCount()" [matBadgeHidden]="warningCount() === 0">
              <mat-icon>warning</mat-icon>
              Warnings
            </span>
            <span class="count info" [matBadge]="infoCount()" [matBadgeHidden]="infoCount() === 0">
              <mat-icon>info</mat-icon>
              Info
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="refreshDiagnostics()" matTooltip="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
          <button mat-icon-button (click)="clearAllDiagnostics()" matTooltip="Clear All">
            <mat-icon>clear_all</mat-icon>
          </button>
          <button mat-icon-button (click)="collapseAll()" matTooltip="Collapse All">
            <mat-icon>unfold_less</mat-icon>
          </button>
        </div>
      </div>

      <div class="panel-filters">
        <mat-chip-listbox>
          <mat-chip-option [selected]="showErrors()" (selectionChange)="toggleErrors()">
            Errors
          </mat-chip-option>
          <mat-chip-option [selected]="showWarnings()" (selectionChange)="toggleWarnings()">
            Warnings
          </mat-chip-option>
          <mat-chip-option [selected]="showInfo()" (selectionChange)="toggleInfo()">
            Info
          </mat-chip-option>
        </mat-chip-listbox>
      </div>

      <div class="diagnostics-list">
        @for (diagnostic of filteredDiagnostics(); track diagnostic.id) {
          <div
            class="diagnostic-item"
            [class]="'severity-' + diagnostic.severity"
            (click)="goToDiagnostic(diagnostic)"
          >
            <div class="diagnostic-icon">
              <mat-icon>{{ getSeverityIcon(diagnostic.severity) }}</mat-icon>
            </div>
            <div class="diagnostic-content">
              <div class="diagnostic-message">{{ diagnostic.message }}</div>
              <div class="diagnostic-location">
                <span class="file">{{ diagnostic.file }}</span>
                <span class="position">Line {{ diagnostic.line }}, Col {{ diagnostic.column }}</span>
              </div>
              @if (diagnostic.code) {
                <div class="diagnostic-code">
                  <code>{{ diagnostic.code }}</code>
                </div>
              }
            </div>
            <div class="diagnostic-actions">
              <button mat-icon-button (click)="quickFix(diagnostic); $event.stopPropagation()" matTooltip="Quick Fix">
                <mat-icon>auto_fix</mat-icon>
              </button>
              <button mat-icon-button (click)="dismissDiagnostic(diagnostic); $event.stopPropagation()" matTooltip="Dismiss">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>
        }
        @empty {
          <div class="empty-state">
            <mat-icon>check_circle</mat-icon>
            <p>No diagnostics</p>
            <span class="hint">Your code looks good!</span>
          </div>
        }
      </div>

      <div class="panel-footer">
        <span class="footer-info">{{ filteredDiagnostics().length }} of {{ totalDiagnostics() }} shown</span>
      </div>
    </div>
  `,
  styles: [`
    .diagnostics-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #252526;
      color: #cccccc;
      font-size: 13px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #3c3c3c;

      .header-title {
        display: flex;
        align-items: center;
        gap: 16px;

        h4 {
          margin: 0;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .diagnostic-counts {
          display: flex;
          gap: 12px;

          .count {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;

            mat-icon {
              font-size: 14px;
              width: 14px;
              height: 14px;
            }

            &.error {
              color: #f48771;
            }

            &.warning {
              color: #dcdcaa;
            }

            &.info {
              color: #75beff;
            }
          }
        }
      }

      .header-actions {
        display: flex;
        gap: 4px;

        button {
          width: 24px;
          height: 24px;
          line-height: 24px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    .panel-filters {
      padding: 8px 12px;
      border-bottom: 1px solid #3c3c3c;
    }

    .diagnostics-list {
      flex: 1;
      overflow-y: auto;
    }

    .diagnostic-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      border-left: 2px solid transparent;

      &:hover {
        background-color: #2a2d2e;
      }

      &.severity-error {
        border-left-color: #f48771;

        .diagnostic-icon {
          color: #f48771;
        }
      }

      &.severity-warning {
        border-left-color: #dcdcaa;

        .diagnostic-icon {
          color: #dcdcaa;
        }
      }

      &.severity-info {
        border-left-color: #75beff;

        .diagnostic-icon {
          color: #75beff;
        }
      }

      .diagnostic-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-top: 2px;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }

      .diagnostic-content {
        flex: 1;
        min-width: 0;

        .diagnostic-message {
          font-size: 13px;
          line-height: 1.4;
          margin-bottom: 2px;
        }

        .diagnostic-location {
          display: flex;
          gap: 8px;
          font-size: 11px;
          color: #858585;

          .file {
            color: #9cdcfe;
          }
        }

        .diagnostic-code {
          margin-top: 4px;

          code {
            display: inline-block;
            padding: 2px 6px;
            background-color: #1e1e1e;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 11px;
            color: #ce9178;
          }
        }
      }

      .diagnostic-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s;

        button {
          width: 24px;
          height: 24px;
          line-height: 24px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      &:hover .diagnostic-actions {
        opacity: 1;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 16px;
      color: #6e6e6e;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        color: #4caf50;
      }

      p {
        margin: 0 0 4px 0;
        font-size: 14px;
      }

      .hint {
        font-size: 12px;
      }
    }

    .panel-footer {
      padding: 8px 12px;
      border-top: 1px solid #3c3c3c;
      background-color: #1e1e1e;

      .footer-info {
        font-size: 11px;
        color: #6e6e6e;
      }
    }
  `]
})
export class DiagnosticsPanelComponent {
  private readonly ideStore = inject(IDEStore);

  readonly showErrors = signal(true);
  readonly showWarnings = signal(true);
  readonly showInfo = signal(true);

  readonly errorCount = computed(() => this.ideStore.errorCount());
  readonly warningCount = computed(() => this.ideStore.warningCount());
  readonly infoCount = computed(() => this.ideStore.infoCount());
  readonly totalDiagnostics = computed(() => this.ideStore.diagnostics().length);

  readonly filteredDiagnostics = computed<DiagnosticItem[]>(() => {
    return this.ideStore.diagnostics()
      .filter(d => {
        if (d.severity === 'error' && !this.showErrors()) return false;
        if (d.severity === 'warning' && !this.showWarnings()) return false;
        if (d.severity === 'info' && !this.showInfo()) return false;
        return true;
      })
      .map((d, index) => ({
        id: `${d.file}-${d.line}-${d.column}-${index}`,
        file: d.file,
        line: d.line,
        column: d.column,
        severity: d.severity,
        message: d.message,
        code: (d as any).code,
        source: (d as any).source
      }));
  });

  toggleErrors(): void {
    this.showErrors.update(v => !v);
  }

  toggleWarnings(): void {
    this.showWarnings.update(v => !v);
  }

  toggleInfo(): void {
    this.showInfo.update(v => !v);
  }

  goToDiagnostic(diagnostic: DiagnosticItem): void {
    // Navigate to the file and position
    this.ideStore.updateCursorPosition(diagnostic.file, diagnostic.line, diagnostic.column);
  }

  quickFix(diagnostic: DiagnosticItem): void {
    // Apply quick fix for the diagnostic
    console.log('Applying quick fix for:', diagnostic);
  }

  dismissDiagnostic(diagnostic: DiagnosticItem): void {
    // Remove the diagnostic from the list
    const currentDiagnostics = this.ideStore.diagnostics();
    const updatedDiagnostics = currentDiagnostics.filter(
      d => !(d.file === diagnostic.file && d.line === diagnostic.line && d.column === diagnostic.column)
    );
    this.ideStore.setDiagnostics(updatedDiagnostics);
  }

  clearAllDiagnostics(): void {
    this.ideStore.clearDiagnostics();
  }

  refreshDiagnostics(): void {
    // Trigger a new diagnostic check
    const activeFile = this.ideStore.activeFile();
    if (activeFile) {
      // In a real implementation, this would call the language server
      // this.ideService.checkDiagnostics(activeFile.node.path)
    }
  }

  collapseAll(): void {
    // Collapse all diagnostic groups
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'help';
    }
  }
}
