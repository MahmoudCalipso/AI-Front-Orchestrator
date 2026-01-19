
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { GenerationService } from '../../../core/services/api/generation.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-project-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatListModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="analysis-container">
      <div class="page-header">
        <h1>
          <mat-icon>assessment</mat-icon>
          Project Analysis
        </h1>
        <p class="subtitle">Deep insight into your project structure and health</p>
      </div>

      @if (loading) {
        <app-loading-spinner message="Analyzing project structure..."></app-loading-spinner>
      }

      @if (!loading && analysisData) {
        <div class="dashboard-grid animate-fadeIn">
          <!-- Overview Cards -->
          <div class="stats-row">
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-value">{{ analysisData.total_files }}</div>
                <div class="stat-label">Total Files</div>
                <mat-icon class="bg-primary">description</mat-icon>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-value">{{ analysisData.total_lines }}</div>
                <div class="stat-label">Lines of Code</div>
                <mat-icon class="bg-accent">code</mat-icon>
              </mat-card-content>
            </mat-card>

            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-value">{{ analysisData.languages?.length || 0 }}</div>
                <div class="stat-label">Languages</div>
                <mat-icon class="bg-warning">language</mat-icon>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- detailed sections -->
          <div class="details-grid">
            <mat-card class="lang-card">
              <mat-card-header>
                <mat-card-title>Language Distribution</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @for (lang of analysisData.languages; track lang.name) {
                  <div class="lang-item">
                    <div class="lang-info">
                      <span class="lang-name">{{ lang.name }}</span>
                      <span class="lang-pct">{{ lang.percentage }}%</span>
                    </div>
                    <mat-progress-bar mode="determinate" [value]="lang.percentage"></mat-progress-bar>
                  </div>
                }
              </mat-card-content>
            </mat-card>

            <mat-card class="health-card">
              <mat-card-header>
                <mat-card-title>Project Health</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                 <mat-list>
                    <mat-list-item>
                      <mat-icon matListItemIcon class="text-success">check_circle</mat-icon>
                      <div matListItemTitle>Structure Valid</div>
                      <div matListItemLine>Standard folder structure detected</div>
                    </mat-list-item>
                    <mat-list-item>
                      <mat-icon matListItemIcon class="text-warning">warning</mat-icon>
                      <div matListItemTitle>Test Coverage Low</div>
                      <div matListItemLine>Only 15% coverage detected</div>
                    </mat-list-item>
                 </mat-list>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
      
      @if (!loading && !analysisData) {
        <div class="empty-state">
            <mat-icon>search_off</mat-icon>
            <h3>No Analysis Data</h3>
            <p>Select a project to analyze</p>
            <button mat-raised-button color="primary" (click)="loadSampleData()">Load Sample Data</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .analysis-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 32px;
      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 28px;
        color: var(--text-primary);
        mat-icon { font-size: 32px; width: 32px; height: 32px; }
      }
      .subtitle {
        margin: 8px 0 0 44px;
        color: var(--text-secondary);
      }
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }
    .stat-card {
      mat-card-content {
        position: relative;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .stat-value {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-primary);
      }
      .stat-label {
        color: var(--text-secondary);
        font-size: 14px;
      }
      mat-icon {
        position: absolute;
        top: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        opacity: 0.2;
        &.bg-primary { background-color: var(--primary-color); color: var(--primary-color); opacity: 1; color: white; }
        &.bg-accent { background-color: var(--accent-color); color: white; opacity: 1; }
        &.bg-warning { background-color: #ffc107; color: black; opacity: 1; }
      }
    }
    .details-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    .lang-item {
      margin-bottom: 16px;
      .lang-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        font-weight: 500;
      }
    }
    .text-success { color: var(--success-color, #4caf50); }
    .text-warning { color: var(--warning-color, #ffc107); }
    .empty-state {
        text-align: center;
        padding: 48px;
        mat-icon {
            font-size: 64px;
            width: 64px;
            height: 64px;
            color: var(--text-secondary);
            margin-bottom: 16px;
        } 
        h3 { margin: 0 0 8px; }
        p { color: var(--text-secondary); margin-bottom: 24px; }
    }
  `]
})
export class ProjectAnalysisComponent implements OnInit {
  private generationService = inject(GenerationService);
  private toast = inject(ToastService);

  loading = false;
  analysisData: any = null;

  ngOnInit() {
    // In a real scenario, we might derive project ID from route params
    this.loadSampleData();
  }

  loadSampleData() {
    this.loading = true;
    setTimeout(() => {
      this.analysisData = {
        total_files: 142,
        total_lines: 12540,
        languages: [
          { name: 'TypeScript', percentage: 65 },
          { name: 'HTML', percentage: 25 },
          { name: 'SCSS', percentage: 10 }
        ]
      };
      this.loading = false;
      this.toast.success('Analysis data loaded');
    }, 1500);
  }
}
