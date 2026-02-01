import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IDEStore } from '../../../core/store/ide/ide.store';
import { AIStore } from '../../../core/store/ai/ai.store';

interface CompletionItem {
  id: string;
  label: string;
  detail?: string;
  documentation?: string;
  insertText: string;
  kind: 'method' | 'function' | 'variable' | 'class' | 'interface' | 'keyword' | 'snippet';
  source: 'ai' | 'lsp' | 'snippet';
  confidence?: number;
}

@Component({
  selector: 'app-ai-completion-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  template: `
    <div class="completion-panel">
      <div class="panel-header">
        <h4>AI Completions</h4>
        <div class="header-actions">
          <button mat-icon-button (click)="refreshCompletions()" matTooltip="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
          <button mat-icon-button (click)="closePanel()" matTooltip="Close">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          <span>AI is thinking...</span>
        </div>
      }

      <div class="completions-list">
        @for (completion of completions(); track completion.id) {
          <div
            class="completion-item"
            [class.selected]="selectedIndex() === $index"
            [class.ai-generated]="completion.source === 'ai'"
            (click)="selectCompletion($index)"
            (dblclick)="acceptCompletion(completion)"
          >
            <div class="completion-icon">
              <mat-icon [class]="'icon-' + completion.kind">
                {{ getIconForKind(completion.kind) }}
              </mat-icon>
            </div>
            <div class="completion-content">
              <div class="completion-label">
                <span class="label-text">{{ completion.label }}</span>
                @if (completion.source === 'ai') {
                  <span class="ai-badge">AI</span>
                }
              </div>
              @if (completion.detail) {
                <div class="completion-detail">{{ completion.detail }}</div>
              }
            </div>
            @if (completion.confidence) {
              <div class="completion-confidence" [matTooltip]="'Confidence: ' + (completion.confidence * 100).toFixed(0) + '%'">
                <div class="confidence-bar">
                  <div class="confidence-fill" [style.width.%]="completion.confidence * 100"></div>
                </div>
              </div>
            }
          </div>
        }
        @empty {
          <div class="empty-state">
            <mat-icon>code</mat-icon>
            <p>No completions available</p>
            <span class="hint">Start typing to see suggestions</span>
          </div>
        }
      </div>

      @if (selectedCompletion()) {
        <div class="completion-details">
          <div class="details-header">
            <mat-icon>info</mat-icon>
            <span>Details</span>
          </div>
          <div class="details-content">
            <code class="insert-text">{{ selectedCompletion()?.insertText }}</code>
            @if (selectedCompletion()?.documentation) {
              <p class="documentation">{{ selectedCompletion()?.documentation }}</p>
            }
          </div>
          <div class="details-actions">
            <button mat-raised-button color="primary" (click)="acceptCompletion(selectedCompletion()!)">
              <mat-icon>check</mat-icon>
              Accept (Tab)
            </button>
            <button mat-button (click)="dismissCompletion()">
              <mat-icon>close</mat-icon>
              Dismiss (Esc)
            </button>
          </div>
        </div>
      }

      <div class="panel-footer">
        <div class="keyboard-hints">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Tab</kbd> Accept</span>
          <span><kbd>Esc</kbd> Dismiss</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .completion-panel {
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

      h4 {
        margin: 0;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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

    .loading-state {
      padding: 16px;
      text-align: center;

      span {
        display: block;
        margin-top: 8px;
        font-size: 12px;
        color: #858585;
      }
    }

    .completions-list {
      flex: 1;
      overflow-y: auto;
    }

    .completion-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      cursor: pointer;
      border-left: 2px solid transparent;

      &:hover, &.selected {
        background-color: #2a2d2e;
      }

      &.selected {
        border-left-color: #007acc;
      }

      &.ai-generated {
        .completion-label .label-text {
          color: #4ec9b0;
        }
      }

      .completion-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;

          &.icon-method { color: #dcdcaa; }
          &.icon-function { color: #dcdcaa; }
          &.icon-variable { color: #9cdcfe; }
          &.icon-class { color: #4ec9b0; }
          &.icon-interface { color: #4ec9b0; }
          &.icon-keyword { color: #569cd6; }
          &.icon-snippet { color: #ce9178; }
        }
      }

      .completion-content {
        flex: 1;
        min-width: 0;

        .completion-label {
          display: flex;
          align-items: center;
          gap: 6px;

          .label-text {
            font-weight: 500;
          }

          .ai-badge {
            font-size: 9px;
            padding: 1px 4px;
            background-color: #4ec9b0;
            color: #1e1e1e;
            border-radius: 3px;
            font-weight: 600;
          }
        }

        .completion-detail {
          font-size: 11px;
          color: #858585;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .completion-confidence {
        width: 30px;

        .confidence-bar {
          height: 3px;
          background-color: #3c3c3c;
          border-radius: 2px;
          overflow: hidden;

          .confidence-fill {
            height: 100%;
            background-color: #4ec9b0;
            border-radius: 2px;
          }
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px;
      color: #6e6e6e;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        margin-bottom: 8px;
      }

      p {
        margin: 0 0 4px 0;
      }

      .hint {
        font-size: 11px;
      }
    }

    .completion-details {
      border-top: 1px solid #3c3c3c;
      padding: 12px;
      background-color: #1e1e1e;

      .details-header {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        font-size: 11px;
        color: #858585;
        text-transform: uppercase;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }

      .details-content {
        margin-bottom: 12px;

        .insert-text {
          display: block;
          padding: 8px;
          background-color: #252526;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-all;
          color: #d4d4d4;
        }

        .documentation {
          margin: 8px 0 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: #cccccc;
        }
      }

      .details-actions {
        display: flex;
        gap: 8px;

        button {
          flex: 1;
          font-size: 12px;
        }
      }
    }

    .panel-footer {
      padding: 8px 12px;
      border-top: 1px solid #3c3c3c;
      background-color: #1e1e1e;

      .keyboard-hints {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: #6e6e6e;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        kbd {
          padding: 1px 4px;
          background-color: #3c3c3c;
          border-radius: 3px;
          font-family: inherit;
        }
      }
    }
  `]
})
export class AICompletionPanelComponent {
  private readonly ideStore = inject(IDEStore);
  private readonly aiStore = inject(AIStore);

  @Input() position: { line: number; column: number } = { line: 1, column: 1 };
  @Output() completionAccepted = new EventEmitter<CompletionItem>();
  @Output() panelClosed = new EventEmitter<void>();

  readonly selectedIndex = signal(0);
  readonly isLoading = computed(() => this.aiStore.isOperating());

  readonly completions = computed<CompletionItem[]>(() => {
    const aiCompletions = this.aiStore.lastOperationResult()?.completions || [];
    const lspCompletions = this.ideStore.aiCompletions();

    return [
      ...aiCompletions.map((c: any, index: number) => ({
        id: `ai-${index}`,
        label: c.label,
        detail: c.detail,
        documentation: c.documentation,
        insertText: c.insertText,
        kind: c.kind || 'snippet',
        source: 'ai' as const,
        confidence: c.confidence || 0.9
      })),
      ...lspCompletions.map((c, index) => ({
        id: `lsp-${index}`,
        label: c.label,
        detail: c.detail,
        documentation: c.documentation,
        insertText: c.insertText,
        kind: c.kind || 'variable',
        source: 'lsp' as const
      }))
    ];
  });

  readonly selectedCompletion = computed(() => {
    const index = this.selectedIndex();
    const items = this.completions();
    return items[index] || null;
  });

  selectCompletion(index: number): void {
    this.selectedIndex.set(index);
  }

  acceptCompletion(completion: CompletionItem): void {
    this.completionAccepted.emit(completion);
  }

  dismissCompletion(): void {
    this.panelClosed.emit();
  }

  closePanel(): void {
    this.panelClosed.emit();
  }

  refreshCompletions(): void {
    // Trigger a new completion request
    const activeFile = this.ideStore.activeFile();
    if (activeFile) {
      // In a real implementation, this would call the AI service
      // this.aiStore.getCompletions({...})
    }
  }

  getIconForKind(kind: string): string {
    const iconMap: Record<string, string> = {
      method: 'functions',
      function: 'functions',
      variable: 'data_object',
      class: 'class',
      interface: 'account_tree',
      keyword: 'vpn_key',
      snippet: 'code'
    };
    return iconMap[kind] || 'code';
  }

  // Keyboard navigation
  navigateUp(): void {
    this.selectedIndex.update(i => Math.max(0, i - 1));
  }

  navigateDown(): void {
    this.selectedIndex.update(i => Math.min(this.completions().length - 1, i + 1));
  }
}
