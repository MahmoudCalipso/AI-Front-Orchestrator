import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-agent-chat-layout',
  standalone: true,
  imports: [
    DatePipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule
  ],
  template: `
    <div class="chat-layout">
      <!-- Sidebar -->
      <aside class="chat-sidebar glass-panel">
        <div class="sidebar-header">
          <h2>Sessions</h2>
          <button mat-icon-button class="new-chat-btn" matTooltip="New Chat">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <div class="search-bar">
          <mat-icon>search</mat-icon>
          <input type="text" placeholder="Search sessions...">
        </div>

        <div class="sessions-list">
           @for (session of sessions(); track session.id) {
             <div class="session-item" [class.active]="activeSessionId() === session.id">
               <div class="session-icon">
                 <mat-icon>chat_bubble_outline</mat-icon>
               </div>
               <div class="session-info">
                 <span class="session-title">{{ session.title }}</span>
                 <span class="session-date">{{ session.date | date:'shortDate' }}</span>
               </div>
             </div>
           }
        </div>

        <div class="sidebar-footer">
          <button mat-button class="clear-history-btn">
            <mat-icon>delete_outline</mat-icon>
            Clear History
          </button>
        </div>
      </aside>

      <!-- Main Chat Area (Placeholder for actual chat component) -->
      <main class="chat-main">
        <!-- We will likely reuse or adapt the IDE chat component here, or build a dedicated one -->
        @if (!activeSessionId()) {
          <div class="empty-state">
            <mat-icon class="empty-icon">forum</mat-icon>
            <h2>Select a session or start a new chat</h2>
            <p>Connect with your autonomous agents to build something great.</p>
          </div>
        } @else {
          <!-- Placeholder for active chat interface -->
          <div class="active-chat-placeholder">
             <!-- Implemented in next step: AgentChatComponent -->
             <router-outlet></router-outlet>
          </div>
        }
      </main>
    </div>
  `,
  styleUrls: ['./agent-chat-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentChatLayoutComponent {
  activeSessionId = signal<string | null>('1');

  sessions = signal([
    { id: '1', title: 'Refactoring Auth Service', date: new Date() },
    { id: '2', title: 'Debugging Kubernetes', date: new Date(Date.now() - 86400000) },
    { id: '3', title: 'Frontend Architecture', date: new Date(Date.now() - 86400000 * 2) }
  ]);
}
