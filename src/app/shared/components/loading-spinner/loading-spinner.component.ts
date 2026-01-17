import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    imports: [CommonModule],
    template: `
    <div class="loading-spinner-container" [class.fullscreen]="fullscreen">
      <div class="spinner-wrapper">
        <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
        <p *ngIf="message" class="loading-message">{{ message }}</p>
      </div>
    </div>
  `,
    styles: [`
    .loading-spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
    }

    .loading-spinner-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 15, 30, 0.9);
      z-index: var(--z-modal);
    }

    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
    }

    .spinner {
      border: 3px solid var(--bg-hover);
      border-top-color: var(--accent-500);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-message {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
    @Input() size: number = 40;
    @Input() message?: string;
    @Input() fullscreen: boolean = false;
}
