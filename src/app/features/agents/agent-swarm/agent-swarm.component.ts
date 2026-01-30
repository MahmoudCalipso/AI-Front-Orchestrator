import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Add this interface locally for now, later move to models
export interface Agent {
    id: string;
    name: string;
    role: 'frontend' | 'backend' | 'devops' | 'qa' | 'security' | 'generalist';
    status: 'idle' | 'busy' | 'error' | 'offline';
    model: string;
    temperature: number;
    lastActive: Date;
    avatar?: string;
}

@Component({
    selector: 'app-agent-swarm',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatTooltipModule,
        MatProgressBarModule
    ],
    template: `
    <div class="swarm-container">
      <!-- Header -->
      <div class="swarm-header">
        <div class="header-content">
          <h1>
            <mat-icon>hub</mat-icon>
            Agent Swarm
          </h1>
          <p class="subtitle">Orchestrate your autonomous AI workforce</p>
        </div>
        
        <div class="header-actions">
          <button mat-flat-button class="create-btn" routerLink="new">
            <mat-icon>add</mat-icon>
            Summon Agent
          </button>
        </div>
      </div>

      <!-- Filters (Placeholder for now) -->
      <div class="filters-bar glass-panel">
        <div class="filter-group">
          <span class="filter-label">Status:</span>
          <mat-chip-listbox>
            <mat-chip-option selected>All</mat-chip-option>
            <mat-chip-option>Idle</mat-chip-option>
            <mat-chip-option>Busy</mat-chip-option>
          </mat-chip-listbox>
        </div>
      </div>

      <!-- Grid -->
      <div class="agents-grid">
        @for (agent of agents(); track agent.id) {
          <div class="agent-card glass-card">
            <!-- Status Indicator -->
            <div class="status-indicator" [class]="agent.status"></div>

            <div class="card-header">
              <div class="avatar-wrapper" [class]="agent.role">
                <mat-icon>{{ getRoleIcon(agent.role) }}</mat-icon>
              </div>
              <div class="agent-identity">
                <h3>{{ agent.name }}</h3>
                <span class="agent-role">{{ agent.role }}</span>
              </div>
              <button mat-icon-button class="more-btn">
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>

            <div class="card-body">
              <div class="stat-row">
                <span class="stat-label">Model</span>
                <span class="stat-value">{{ agent.model }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Temp</span>
                <span class="stat-value">{{ agent.temperature }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Last Active</span>
                <span class="stat-value">{{ agent.lastActive | date:'shortTime' }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button mat-stroked-button class="action-btn chat-btn" [routerLink]="[agent.id, 'chat']">
                <mat-icon>chat</mat-icon>
                Chat
              </button>
              <button mat-stroked-button class="action-btn config-btn" [routerLink]="[agent.id]">
                <mat-icon>settings</mat-icon>
                Config
              </button>
            </div>
            
            @if (agent.status === 'busy') {
              <mat-progress-bar mode="indeterminate" class="activity-bar"></mat-progress-bar>
            }
          </div>
        }
      </div>
    </div>
  `,
    styleUrls: ['./agent-swarm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentSwarmComponent implements OnInit {
    agents = signal<Agent[]>([
        {
            id: '1',
            name: 'Frontend Architect',
            role: 'frontend',
            status: 'idle',
            model: 'GPT-4',
            temperature: 0.7,
            lastActive: new Date()
        },
        {
            id: '2',
            name: 'Backend Specialist',
            role: 'backend',
            status: 'busy',
            model: 'Claude 3 Opus',
            temperature: 0.5,
            lastActive: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
            id: '3',
            name: 'Security Auditor',
            role: 'security',
            status: 'idle',
            model: 'Gemini Pro',
            temperature: 0.2,
            lastActive: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
            id: '4',
            name: 'DevOps Engineer',
            role: 'devops',
            status: 'offline',
            model: 'GPT-4',
            temperature: 0.4,
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
    ]);

    ngOnInit(): void {
        // Load agents from service (mocked for now)
    }

    getRoleIcon(role: string): string {
        switch (role) {
            case 'frontend': return 'web';
            case 'backend': return 'dns';
            case 'devops': return 'cloud_queue';
            case 'security': return 'security';
            case 'qa': return 'bug_report';
            default: return 'smart_toy'; // Robot icon
        }
    }
}
