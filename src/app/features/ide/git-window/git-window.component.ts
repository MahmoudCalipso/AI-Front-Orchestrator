import { Component, Input, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GitService } from '../../../core/services/api/git.service';
import { GitStatus, GitChange } from '../../../core/models/git/git.model';
import { ToastService } from '../../../shared/services/toast.service';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-git-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    StatusColorPipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './git-window.html',
  styleUrl: './git-window.scss',
})
export class GitWindowComponent {
  @Input() workspaceId: string = '';
  @Input() localPath: string = '';
  @Output() openDiff = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<void>();

  private gitService = inject(GitService);
  private toast = inject(ToastService);

  commitMessage: string = '';
  isWorking: boolean = false;
  currentStatus: GitStatus | null = null;
  changes: GitChange[] = [];

  get stagedChanges() { return this.changes.filter(c => c.staged); }
  get unstagedChanges() { return this.changes.filter(c => !c.staged); }

  ngOnInit() {
    this.refreshStatus();
  }

  refreshStatus(): void {
    if (!this.workspaceId) return;
    this.isWorking = true;
    this.gitService.getRepositoryStatus(this.workspaceId, this.localPath).subscribe({
      next: (status) => {
        this.currentStatus = status;
        this.changes = [
          ...(status.staged || []).map(c => ({ ...c, staged: true })),
          ...(status.unstaged || []).map(c => ({ ...c, staged: false })),
          ...(status.untracked || []).map(path => ({ path, status: 'added' as const, staged: false }))
        ];
        this.isWorking = false;
      },
      error: (err) => {
        this.toast.error('Failed to load git status');
        this.isWorking = false;
      }
    });
  }

  toggleStage(change: GitChange): void {
    this.isWorking = true;
    // In real Git logic, staging would call git add via backend
    // Assuming backend has an endpoint or we just toggle client-side for "Prepare Commit"
    change.staged = !change.staged;
    this.isWorking = false;
  }

  commitAndPush(): void {
    if (!this.commitMessage.trim()) {
      this.toast.error('Please enter a commit message');
      return;
    }

    this.isWorking = true;
    this.gitService.pushRepository(this.workspaceId, {
      local_path: this.localPath,
      message: this.commitMessage
    }).subscribe({
      next: () => {
        this.toast.success('Changes committed and pushed successfully');
        this.commitMessage = '';
        this.refreshStatus();
        this.statusChanged.emit();
      },
      error: (err) => {
        this.toast.error('Commit/Push failed: ' + err.message);
        this.isWorking = false;
      }
    });
  }

  sync(): void {
    this.isWorking = true;
    this.gitService.pullRepository(this.workspaceId, this.localPath).subscribe({
      next: () => {
        this.toast.success('Workspace synchronized');
        this.refreshStatus();
        this.statusChanged.emit();
      },
      error: (err) => {
        this.toast.error('Sync failed: ' + err.message);
        this.isWorking = false;
      }
    });
  }

  openFileDiff(path: string): void {
    this.openDiff.emit(path);
  }
}
