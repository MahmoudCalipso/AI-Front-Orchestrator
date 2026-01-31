import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-billing-management',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
    template: `
    <div class="billing-container">
      <div class="header">
        <button mat-icon-button routerLink="/enterprise" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>
          <mat-icon>receipt</mat-icon>
          Billing Management
        </h1>
      </div>
      <p>Billing and subscription management - invoices, usage, and payments</p>
    </div>
  `,
    styles: [`
    .billing-container {
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
export class BillingManagementComponent { }
