import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../shared/services/toast.service';

interface GitChange {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed';
  staged: boolean;
}

@Component({
  selector: 'app-git-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
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
  @Output() openDiff = new EventEmitter<string>();

  private toast = inject(ToastService);

  commitMessage: string = '';
  isWorking: boolean = false;

  changes: GitChange[] = [
    { path: 'src/app/app.component.ts', status: 'modified', staged: true },
    { path: 'src/app/core/services/git.service.ts', status: 'added', staged: false },
    { path: 'package.json', status: 'modified', staged: false }
  ];

  get stagedChanges() { return this.changes.filter(c => c.staged); }
  get unstagedChanges() { return this.changes.filter(c => !c.staged); }

  toggleStage(change: GitChange): void {
    change.staged = !change.staged;
  }

  commitAndPush(): void {
    if (!this.commitMessage.trim()) {
      this.toast.error('Please enter a commit message');
      return;
    }

    this.isWorking = true;
    // Simulated backend call
    setTimeout(() => {
      this.toast.success('Changes committed and pushed to origin/main');
      this.changes = this.changes.filter(c => !c.staged);
      this.commitMessage = '';
      this.isWorking = false;
    }, 2000);
  }

  sync(): void {
    this.isWorking = true;
    setTimeout(() => {
      this.toast.success('Workspace synchronized with remote');
      this.isWorking = false;
    }, 1500);
  }

  openFileDiff(path: string): void {
    this.openDiff.emit(path);
  }
}
