import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-settings-layout',
    imports: [CommonModule],
    template: `
    <div class="settings-layout">
      <h1>Settings</h1>
      <p>Coming soon - Application settings, API configuration, and user preferences.</p>
    </div>
  `,
    styles: [`
    .settings-layout {
      padding: var(--spacing-xl);
    }
  `]
})
export class SettingsLayoutComponent { }
