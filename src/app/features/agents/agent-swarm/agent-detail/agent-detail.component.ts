import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-agent-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="agent-detail">
      <h1>Agent Detail</h1>
      <p>Agent configuration and management interface</p>
    </div>
  `,
    styles: [`
    .agent-detail {
      padding: var(--space-8);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentDetailComponent { }
