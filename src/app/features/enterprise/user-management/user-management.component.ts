import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
    template: `
    <div class="user-management-container">
      <div class="header">
        <button mat-icon-button routerLink="/enterprise" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>
          <mat-icon>people</mat-icon>
          User Management
        </h1>
      </div>
      <p>User management interface - manage users, roles, and permissions</p>
    </div>
  `,
    styles: [`
    .user-management-container {
      padding: var(--space-8);
    }
    .header {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }
    .header h1 {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent { }
