import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Card Component
 * Glassmorphic card with hover effects
 */
@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="card" 
      [class.hover-effect]="hoverable"
      [class.clickable]="clickable"
      [ngClass]="customClass">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .card {
      background: rgba(31, 41, 55, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      border-radius: 1rem;
      padding: 1.5rem;
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card.hover-effect:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .card.clickable {
      cursor: pointer;
    }
  `]
})
export class CardComponent {
    @Input() hoverable: boolean = false;
    @Input() clickable: boolean = false;
    @Input() customClass: string = '';
}
