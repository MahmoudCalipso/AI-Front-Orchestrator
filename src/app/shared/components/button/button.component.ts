import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'base' | 'lg';

/**
 * Button Component
 * Modern button with multiple variants and sizes
 */
@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)">
      @if (loading) {
        <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="3" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-width="3" stroke-linecap="round"/>
        </svg>
      }
      @if (icon && !loading) {
        <i [class]="icon"></i>
      }
      <ng-content></ng-content>
    </button>
  `,
    styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      border-radius: 0.75rem;
      border: none;
      cursor: pointer;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Sizes */
    .btn-sm {
      height: 2rem;
      padding: 0 0.75rem;
      font-size: 0.75rem;
    }

    .btn-base {
      height: 2.5rem;
      padding: 0 1rem;
      font-size: 0.875rem;
    }

    .btn-lg {
      height: 3rem;
      padding: 0 1.5rem;
      font-size: 1rem;
    }

    /* Variants */
    .btn-primary {
      background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 20px rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #374151;
      color: #f9fafb;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .btn-secondary:hover:not(:disabled) {
      background: #4b5563;
      border-color: rgba(255, 255, 255, 0.25);
    }

    .btn-ghost {
      background: transparent;
      color: #d1d5db;
    }

    .btn-ghost:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      color: #f9fafb;
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .btn-danger:hover:not(:disabled) {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 20px rgba(239, 68, 68, 0.5);
      transform: translateY(-1px);
    }

    .btn-success {
      background: linear-gradient(135deg, #059669 0%, #34d399 100%);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .btn-success:hover:not(:disabled) {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 20px rgba(16, 185, 129, 0.5);
      transform: translateY(-1px);
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() size: ButtonSize = 'base';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
    @Input() icon?: string;
    @Input() fullWidth: boolean = false;

    @Output() clicked = new EventEmitter<MouseEvent>();

    get buttonClasses(): string {
        const classes = [
            `btn-${this.variant}`,
            `btn-${this.size}`
        ];

        if (this.fullWidth) {
            classes.push('w-full');
        }

        return classes.join(' ');
    }

    handleClick(event: MouseEvent): void {
        if (!this.disabled && !this.loading) {
            this.clicked.emit(event);
        }
    }
}
