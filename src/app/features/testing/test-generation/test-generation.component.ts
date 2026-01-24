import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { AiAgentService } from '../../../core/services/api/ai-agent.service';
import { SignalStoreService } from '../../../core/services/signal-store.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-test-generation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatProgressBarModule,
        MatExpansionModule
    ],
    template: `
    <div class="test-gen-container">
      <header class="page-header">
        <h1><mat-icon>science</mat-icon> AI Test Generation</h1>
        <p>Generate high-coverage unit and integration tests using AI</p>
      </header>

      <div class="config-grid">
        <mat-card class="config-card">
          <mat-card-header>
            <mat-card-title>Configuration</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Framework</mat-label>
                <mat-select [(ngModel)]="framework">
                  <mat-option value="jest">Jest</mat-option>
                  <mat-option value="vitest">Vitest</mat-option>
                  <mat-option value="pytest">Pytest</mat-option>
                  <mat-option value="junit">JUnit</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Coverage Target</mat-label>
                <mat-select [(ngModel)]="targetCoverage">
                  <mat-option [value]="80">80% (Standard)</mat-option>
                  <mat-option [value]="90">90% (High)</mat-option>
                  <mat-option [value]="100">100% (Critical)</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Source File / Component</mat-label>
              <input matInput [(ngModel)]="filePath" placeholder="src/app/core/auth.service.ts">
              <button mat-icon-button matSuffix><mat-icon>folder</mat-icon></button>
            </mat-form-field>

            <div class="actions">
              <button mat-flat-button color="primary" 
                      [disabled]="generating() || !filePath()"
                      (click)="generateTests()">
                <mat-icon>auto_awesome</mat-icon>
                Generate Tests
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="status-card">
          <mat-card-header>
            <mat-card-title>Generation Status</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (generating()) {
              <div class="progress-zone">
                <p>{{ currentStep() }}</p>
                <mat-progress-bar mode="buffer" [value]="progress()"></mat-progress-bar>
              </div>
            } @else if (results().length === 0) {
                <div class="empty-status">
                    <mat-icon>history</mat-icon>
                    <p>No tests generated yet</p>
                </div>
            } @else {
                <div class="stats-summary">
                    <div class="stat">
                        <span class="val">{{ results().length }}</span>
                        <span class="lab">Test Cases</span>
                    </div>
                    <div class="stat">
                        <span class="val">{{ predictedCoverage() }}%</span>
                        <span class="lab">Predicted Coverage</span>
                    </div>
                </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      @if (results().length > 0) {
        <div class="results-zone animate-fadeIn">
          <h2>Test Suite Preview</h2>
          <mat-accordion multi>
            @for (test of results(); track test.id) {
              <mat-expansion-panel>
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <mat-icon class="test-icon">check_circle</mat-icon>
                    {{ test.name }}
                  </mat-panel-title>
                  <mat-panel-description>
                    {{ test.description }}
                  </mat-panel-description>
                </mat-expansion-panel-header>
                
                <div class="code-preview">
                  <pre><code>{{ test.code }}</code></pre>
                </div>

                <mat-action-row>
                  <button mat-button color="primary">Add to Suite</button>
                </mat-action-row>
              </mat-expansion-panel>
            }
          </mat-accordion>
        </div>
      }
    </div>
  `,
    styles: [`
    .test-gen-container { padding: 32px; max-width: 1200px; margin: 0 auto; color: #fff; }
    .page-header { margin-bottom: 32px; h1 { display: flex; align-items: center; gap: 12px; margin: 0; font-size: 32px; font-weight: 700; color: #f8fafc; } p { color: #94a3b8; margin: 8px 0 0 44px; } }
    .config-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
    .config-card, .status-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; }
    .form-row { display: flex; gap: 16px; margin-bottom: 8px; > * { flex: 1; } }
    .full-width { width: 100%; }
    .actions { display: flex; justify-content: flex-end; margin-top: 16px; }
    .empty-status { text-align: center; padding: 40px; color: #64748b; mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; } }
    .progress-zone { padding: 20px 0; p { margin-bottom: 12px; font-size: 14px; color: #38bdf8; } }
    .results-zone { h2 { margin-bottom: 20px; font-size: 20px; } }
    .test-icon { color: #10b981; margin-right: 12px; }
    .mat-expansion-panel { background: #1e293b; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px !important; }
    .code-preview { background: #0f172a; padding: 16px; border-radius: 8px; pre { margin: 0; font-family: 'Fira Code', monospace; font-size: 13px; color: #e2e8f0; } }
    .stats-summary { display: flex; gap: 24px; padding: 20px; border-radius: 12px; background: rgba(56, 189, 248, 0.1); .stat { display: flex; flex-direction: column; .val { font-size: 24px; font-weight: 700; color: #38bdf8; } .lab { font-size: 12px; color: #94a3b8; } } }
    @media (max-width: 992px) { .config-grid { grid-template-columns: 1fr; } }
  `]
})
export class TestGenerationComponent {
    private aiService = inject(AiAgentService);
    private store = inject(SignalStoreService);
    private toast = inject(ToastService);

    framework = signal('jest');
    targetCoverage = signal(80);
    filePath = signal('');
    generating = signal(false);
    progress = signal(0);
    currentStep = signal('');
    results = signal<any[]>([]);
    predictedCoverage = signal(0);

    generateTests() {
        this.generating.set(true);
        this.results.set([]);
        this.progress.set(10);
        this.currentStep.set('Analyzing component structure...');

        // Simulate AI Multi-step process for high UX fidelity
        setTimeout(() => {
            this.progress.set(40);
            this.currentStep.set('Identifying edge cases...');
            setTimeout(() => {
                this.progress.set(70);
                this.currentStep.set('Synthesizing test suite...');
                setTimeout(() => {
                    this.mockData();
                    this.generating.set(false);
                    this.toast.success('Test suite generated successfully');
                }, 1000);
            }, 1200);
        }, 1500);
    }

    private mockData() {
        this.results.set([
            {
                id: 1,
                name: 'should initialize correctly',
                description: 'Verifies the component renders with initial state',
                code: `it('should initialize correctly', () => {\n  const component = render();\n  expect(component.state).toBeDefined();\n});`
            },
            {
                id: 2,
                name: 'should handle user login success',
                description: 'Tests the happy path for auth flow',
                code: `it('should handle login success', async () => {\n  authService.login.mockResolvedValue({ user: 'test' });\n  await component.submit();\n  expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);\n});`
            },
            {
                id: 3,
                name: 'should throw error on invalid credentials',
                description: 'Edge case: Invalid API response',
                code: `it('should throw on invalid credentials', async () => {\n  authService.login.mockRejectedValue(new Error('Invalid'));\n  await component.submit();\n  expect(toast.error).toHaveBeenCalled();\n});`
            }
        ]);
        this.predictedCoverage.set(88);
        this.store.setTestResults(this.results());
    }
}
