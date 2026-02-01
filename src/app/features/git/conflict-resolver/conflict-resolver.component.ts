import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GitStore } from '../../../core/store/git/git.store';
import { GitConflictResolve } from '../../../core/models/git/git.model';
import { FormsModule } from '@angular/forms';

interface ConflictFile {
  path: string;
  ours: string;
  theirs: string;
  base?: string;
  resolution?: string;
  status: 'pending' | 'resolved' | 'error';
}

@Component({
  selector: 'app-conflict-resolver',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="conflict-resolver">
      <!-- Header -->
      <div class="resolver-header">
        <h3>Conflict Resolution</h3>
        <div class="conflict-stats">
          <mat-chip [color]="'warn'">
            <mat-icon>error</mat-icon>
            {{ pendingConflicts() }} Pending
          </mat-chip>
          <mat-chip [color]="'primary'">
            <mat-icon>check_circle</mat-icon>
            {{ resolvedConflicts() }} Resolved
          </mat-chip>
        </div>
      </div>

      <!-- Conflict List -->
      <div class="conflict-list">
        @for (conflict of conflicts(); track conflict.path) {
          <mat-card class="conflict-card" [class.resolved]="conflict.status === 'resolved'">
            <mat-card-header>
              <mat-icon mat-card-avatar>insert_drive_file</mat-icon>
              <mat-card-title>{{ conflict.path }}</mat-card-title>
              <mat-card-subtitle>
                @switch (conflict.status) {
                  @case ('resolved') {
                    <span class="status-resolved">Resolved</span>
                  }
                  @case ('error') {
                    <span class="status-error">Error</span>
                  }
                  @default {
                    <span class="status-pending">Pending Resolution</span>
                  }
                }
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <!-- Diff View -->
              @if (selectedConflict()?.path === conflict.path) {
                <div class="diff-view">
                  <div class="diff-section ours">
                    <div class="diff-header">
                      <mat-icon>person</mat-icon>
                      <span>Our Changes</span>
                    </div>
                    <pre class="diff-content">{{ conflict.ours }}</pre>
                  </div>

                  @if (conflict.base) {
                    <div class="diff-section base">
                      <div class="diff-header">
                        <mat-icon>history</mat-icon>
                        <span>Base Version</span>
                      </div>
                      <pre class="diff-content">{{ conflict.base }}</pre>
                    </div>
                  }

                  <div class="diff-section theirs">
                    <div class="diff-header">
                      <mat-icon>people</mat-icon>
                      <span>Their Changes</span>
                    </div>
                    <pre class="diff-content">{{ conflict.theirs }}</pre>
                  </div>

                  <!-- Resolution Editor -->
                  @if (conflict.status === 'pending') {
                    <div class="resolution-editor">
                      <div class="editor-header">
                        <mat-icon>edit</mat-icon>
                        <span>Resolution</span>
                      </div>
                      <textarea
                        [(ngModel)]="conflict.resolution"
                        placeholder="Enter resolved content here..."
                        rows="10"
                      ></textarea>
                    </div>
                  }

                  <!-- AI Suggestion -->
                  @if (aiSuggestion() && selectedConflict()?.path === conflict.path) {
                    <div class="ai-suggestion">
                      <div class="suggestion-header">
                        <mat-icon>smart_toy</mat-icon>
                        <span>AI Suggestion</span>
                      </div>
                      <pre class="suggestion-content">{{ aiSuggestion() }}</pre>
                      <div class="suggestion-actions">
                        <button mat-button (click)="applyAISuggestion()">
                          <mat-icon>check</mat-icon>
                          Apply Suggestion
                        </button>
                        <button mat-button (click)="dismissAISuggestion()">
                          <mat-icon>close</mat-icon>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </mat-card-content>

            <mat-card-actions>
              @if (conflict.status === 'pending') {
                <button
                  mat-button
                  (click)="selectConflict(conflict)"
                  [disabled]="isResolving()"
                >
                  <mat-icon>visibility</mat-icon>
                  View
                </button>
                <button
                  mat-button
                  color="accent"
                  (click)="getAISuggestion(conflict)"
                  [disabled]="isResolving()"
                >
                  <mat-icon>smart_toy</mat-icon>
                  AI Suggest
                </button>
                <button
                  mat-raised-button
                  color="primary"
                  (click)="resolveConflict(conflict)"
                  [disabled]="!conflict.resolution || isResolving()"
                >
                  @if (isResolving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    <mat-icon>check</mat-icon>
                  }
                  Resolve
                </button>
              } @else {
                <button mat-button (click)="reopenConflict(conflict)">
                  <mat-icon>refresh</mat-icon>
                  Reopen
                </button>
              }
            </mat-card-actions>
          </mat-card>
        }
        @empty {
          <div class="empty-state">
            <mat-icon>check_circle</mat-icon>
            <h4>No Conflicts</h4>
            <p>All conflicts have been resolved!</p>
          </div>
        }
      </div>

      <!-- Bulk Actions -->
      @if (conflicts().length > 0) {
        <div class="bulk-actions">
          <button
            mat-raised-button
            color="accent"
            (click)="resolveAllWithAI()"
            [disabled]="isResolving() || pendingConflicts() === 0"
          >
            <mat-icon>smart_toy</mat-icon>
            Resolve All with AI
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="commitResolution()"
            [disabled]="pendingConflicts() > 0 || isResolving()"
          >
            <mat-icon>check_circle</mat-icon>
            Commit Resolution
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .conflict-resolver {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
      background-color: #fafafa;
    }

    .resolver-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
      }

      .conflict-stats {
        display: flex;
        gap: 8px;
      }
    }

    .conflict-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .conflict-card {
      &.resolved {
        opacity: 0.7;
        border-left: 4px solid #4caf50;
      }

      .status-resolved {
        color: #4caf50;
      }

      .status-error {
        color: #f44336;
      }

      .status-pending {
        color: #ff9800;
      }

      .diff-view {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .diff-section, .resolution-editor, .ai-suggestion {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;

          .diff-header, .editor-header, .suggestion-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            font-weight: 500;
            font-size: 12px;
            text-transform: uppercase;
          }

          &.ours .diff-header {
            background-color: #e3f2fd;
            color: #1976d2;
          }

          &.theirs .diff-header {
            background-color: #f3e5f5;
            color: #7b1fa2;
          }

          &.base .diff-header {
            background-color: #f5f5f5;
            color: #616161;
          }

          .editor-header {
            background-color: #e8f5e9;
            color: #388e3c;
          }

          .suggestion-header {
            background-color: #fff3e0;
            color: #f57c00;
          }

          .diff-content, .suggestion-content {
            margin: 0;
            padding: 12px;
            background-color: #fafafa;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            line-height: 1.5;
            overflow-x: auto;
            max-height: 200px;
            overflow-y: auto;
          }

          textarea {
            width: 100%;
            padding: 12px;
            border: none;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            line-height: 1.5;
            resize: vertical;
            min-height: 150px;

            &:focus {
              outline: none;
            }
          }

          .suggestion-actions {
            display: flex;
            gap: 8px;
            padding: 8px 12px;
            background-color: #fafafa;
            border-top: 1px solid #e0e0e0;
          }
        }
      }

      mat-card-actions {
        display: flex;
        gap: 8px;
        padding: 8px 16px 16px;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: rgba(0, 0, 0, 0.38);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        color: #4caf50;
      }

      h4 {
        margin: 0 0 8px 0;
        font-size: 18px;
      }

      p {
        margin: 0;
      }
    }

    .bulk-actions {
      display: flex;
      gap: 16px;
      padding: 16px;
      background-color: white;
      border-top: 1px solid #e0e0e0;
      margin-top: 16px;

      button {
        flex: 1;
      }
    }
  `]
})
export class ConflictResolverComponent implements OnInit {
  private readonly gitStore = inject(GitStore);
  private readonly snackBar = inject(MatSnackBar);

  @Input() repoId: string = '';

  readonly selectedConflict = signal<ConflictFile | null>(null);
  readonly aiSuggestion = signal<string | null>(null);
  readonly isResolving = computed(() => this.gitStore.loading());

  readonly conflicts = computed<ConflictFile[]>(() => {
    const gitConflicts = this.gitStore.conflicts();
    return gitConflicts.map(c => ({
      path: c.file || c.path,
      ours: c.ours || '',
      theirs: c.theirs || '',
      base: c.base,
      status: 'pending' as const
    }));
  });

  readonly pendingConflicts = computed(() =>
    this.conflicts().filter(c => c.status === 'pending').length
  );

  readonly resolvedConflicts = computed(() =>
    this.conflicts().filter(c => c.status === 'resolved').length
  );

  ngOnInit(): void {
    // Conflicts are loaded via the GitStore
  }

  selectConflict(conflict: ConflictFile): void {
    this.selectedConflict.set(conflict);
    this.aiSuggestion.set(null);
  }

  getAISuggestion(conflict: ConflictFile): void {
    // Simulate AI suggestion - in real implementation, this would call an AI service
    const suggestion = `// AI Suggested Resolution for ${conflict.path}\n` +
      `// Combined the best of both versions:\n\n` +
      conflict.ours + '\n\n' +
      `// Plus additions from their version:\n` +
      conflict.theirs.split('\n').slice(0, 3).join('\n');

    this.aiSuggestion.set(suggestion);
  }

  applyAISuggestion(): void {
    const suggestion = this.aiSuggestion();
    const conflict = this.selectedConflict();

    if (suggestion && conflict) {
      conflict.resolution = suggestion;
      this.aiSuggestion.set(null);
    }
  }

  dismissAISuggestion(): void {
    this.aiSuggestion.set(null);
  }

  resolveConflict(conflict: ConflictFile): void {
    if (!conflict.resolution) return;

    const request: GitConflictResolve = {
      file_path: conflict.path,
      resolution: conflict.resolution,
      strategy: 'manual'
    };

    this.gitStore.resolveConflictAI({ repoId: this.repoId, request });
    conflict.status = 'resolved';
    this.selectedConflict.set(null);

    this.snackBar.open(`Resolved conflict in ${conflict.path}`, 'Dismiss', {
      duration: 3000
    });
  }

  reopenConflict(conflict: ConflictFile): void {
    conflict.status = 'pending';
    conflict.resolution = undefined;
  }

  resolveAllWithAI(): void {
    const pending = this.conflicts().filter(c => c.status === 'pending');

    pending.forEach(conflict => {
      // Simulate AI resolution
      conflict.resolution = `// AI Auto-Resolved\n` +
        `// Merged changes from both versions\n\n` +
        conflict.ours + '\n' +
        conflict.theirs;
      conflict.status = 'resolved';
    });

    this.snackBar.open(`Resolved ${pending.length} conflicts with AI`, 'Dismiss', {
      duration: 3000
    });
  }

  commitResolution(): void {
    this.snackBar.open('All conflicts resolved! Ready to commit.', 'Dismiss', {
      duration: 3000
    });
  }
}
