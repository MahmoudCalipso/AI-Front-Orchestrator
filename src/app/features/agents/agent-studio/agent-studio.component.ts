import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-agent-studio',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatSliderModule,
        MatCheckboxModule,
        MatChipsModule
    ],
    template: `
    <div class="studio-container">
      <div class="studio-header">
        <h1>
          <mat-icon>psychology</mat-icon>
          Agent Studio
        </h1>
        <p class="subtitle">Design and summon a new autonomous agent</p>
      </div>

      <div class="wizard-card glass-panel">
        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Identity -->
          <mat-step [stepControl]="identityForm">
            <form [formGroup]="identityForm">
              <ng-template matStepLabel>Identity</ng-template>
              
              <div class="step-content">
                <h2>Define Agent Identity</h2>
                <p class="step-description">Choose a role and persona for your new agent.</p>

                <div class="role-grid">
                  @for (role of roles; track role.id) {
                    <div class="role-card" 
                         [class.selected]="identityForm.get('role')?.value === role.id"
                         (click)="selectRole(role.id)">
                      <div class="role-icon" [ngClass]="role.id">
                        <mat-icon>{{ role.icon }}</mat-icon>
                      </div>
                      <h3>{{ role.label }}</h3>
                      <p>{{ role.description }}</p>
                    </div>
                  }
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Agent Name</mat-label>
                  <input matInput formControlName="name" placeholder="e.g. Senior Frontend Dev">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="3" placeholder="Describe the agent's purpose..."></textarea>
                </mat-form-field>
              </div>

              <div class="step-actions">
                 <button mat-button routerLink="..">Cancel</button>
                 <button mat-flat-button color="primary" matStepperNext [disabled]="identityForm.invalid">Next</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Intelligence -->
          <mat-step [stepControl]="modelForm">
            <form [formGroup]="modelForm">
              <ng-template matStepLabel>Intelligence</ng-template>
              
              <div class="step-content">
                <h2>Configure Model</h2>
                <p class="step-description">Select the underlying AI model and parameters.</p>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Model</mat-label>
                  <mat-select formControlName="model">
                    <mat-option value="gpt-4">GPT-4 (OpenAI)</mat-option>
                    <mat-option value="claude-3-opus">Claude 3 Opus (Anthropic)</mat-option>
                    <mat-option value="gemini-pro">Gemini Pro (Google)</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="slider-group">
                  <label>Temperature (Creativity): {{ modelForm.get('temperature')?.value }}</label>
                  <mat-slider min="0" max="2" step="0.1" showTickMarks discrete>
                    <input matSliderThumb formControlName="temperature">
                  </mat-slider>
                  <div class="slider-labels">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div class="slider-group">
                  <label>Max Tokens: {{ modelForm.get('maxTokens')?.value }}</label>
                  <mat-slider min="100" max="8000" step="100" showTickMarks discrete>
                    <input matSliderThumb formControlName="maxTokens">
                  </mat-slider>
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-flat-button color="primary" matStepperNext>Next</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Tools -->
          <mat-step [stepControl]="toolsForm">
            <form [formGroup]="toolsForm">
              <ng-template matStepLabel>Tools</ng-template>
              
              <div class="step-content">
                <h2>Equip Tools</h2>
                <p class="step-description">Grant powers to your agent.</p>

                <div class="tools-list">
                  <div class="tool-item">
                    <mat-checkbox formControlName="codeExecution">
                      <div class="tool-info">
                        <strong>Code Execution</strong>
                        <span>Can run code in secure sandbox</span>
                      </div>
                    </mat-checkbox>
                  </div>
                  <div class="tool-item">
                    <mat-checkbox formControlName="webSearch">
                      <div class="tool-info">
                        <strong>Web Search</strong>
                        <span>Can browse the internet for docs</span>
                      </div>
                    </mat-checkbox>
                  </div>
                  <div class="tool-item">
                    <mat-checkbox formControlName="fileSystem">
                      <div class="tool-info">
                        <strong>File System</strong>
                        <span>Can read/write project files</span>
                      </div>
                    </mat-checkbox>
                  </div>
                   <div class="tool-item">
                    <mat-checkbox formControlName="database">
                      <div class="tool-info">
                        <strong>Database Access</strong>
                        <span>Can query connected databases</span>
                      </div>
                    </mat-checkbox>
                  </div>
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-flat-button color="primary" matStepperNext>Next</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 4: Persona -->
          <mat-step [stepControl]="promptForm">
            <form [formGroup]="promptForm">
              <ng-template matStepLabel>Persona</ng-template>
              
              <div class="step-content">
                <h2>System Prompt</h2>
                <p class="step-description">Define the agent's core instructions and behavior.</p>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>System Instructions</mat-label>
                  <textarea matInput formControlName="systemPrompt" rows="10" class="code-font"></textarea>
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>Back</button>
                <button mat-flat-button color="primary" matStepperNext>Review</button>
              </div>
            </form>
          </mat-step>

          <!-- Step 5: Review -->
          <mat-step>
            <ng-template matStepLabel>Review</ng-template>
            
            <div class="step-content">
              <h2>Review Configuration</h2>
              <p class="step-description">Confirm these details to summon your agent.</p>

              <div class="review-card">
                 <div class="review-row">
                   <span class="label">Name</span>
                   <span class="value">{{ identityForm.get('name')?.value }}</span>
                 </div>
                 <div class="review-row">
                   <span class="label">Role</span>
                   <div class="role-badge">{{ identityForm.get('role')?.value | uppercase }}</div>
                 </div>
                 <div class="review-row">
                   <span class="label">Model</span>
                   <span class="value">{{ modelForm.get('model')?.value }}</span>
                 </div>
                 <div class="review-row">
                   <span class="label">Temp</span>
                   <span class="value">{{ modelForm.get('temperature')?.value }}</span>
                 </div>
                 <div class="review-row">
                   <span class="label">Tools</span>
                   <mat-chip-listbox>
                      @if (toolsForm.get('codeExecution')?.value) { <mat-chip>Code Exec</mat-chip> }
                      @if (toolsForm.get('webSearch')?.value) { <mat-chip>Web Search</mat-chip> }
                      @if (toolsForm.get('fileSystem')?.value) { <mat-chip>File System</mat-chip> }
                   </mat-chip-listbox>
                 </div>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-flat-button color="primary" (click)="summonAgent()">
                <mat-icon>auto_awesome</mat-icon>
                Summon Agent
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
    styleUrls: ['./agent-studio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentStudioComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    roles = [
        { id: 'frontend', label: 'Frontend', icon: 'web', description: 'UI/UX, Angular, CSS' },
        { id: 'backend', label: 'Backend', icon: 'dns', description: 'API, Database, Logic' },
        { id: 'devops', label: 'DevOps', icon: 'cloud_queue', description: 'CI/CD, Docker, K8s' },
        { id: 'qa', label: 'QA', icon: 'bug_report', description: 'Testing, Validation' },
        { id: 'security', label: 'Security', icon: 'security', description: 'Auditing, Safety' },
        { id: 'generalist', label: 'Generalist', icon: 'smart_toy', description: 'Jack of all trades' }
    ];

    identityForm = this.fb.group({
        name: ['', Validators.required],
        role: ['', Validators.required],
        description: ['']
    });

    modelForm = this.fb.group({
        model: ['gpt-4', Validators.required],
        temperature: [0.7],
        maxTokens: [4000]
    });

    toolsForm = this.fb.group({
        codeExecution: [true],
        webSearch: [false],
        fileSystem: [true],
        database: [false]
    });

    promptForm = this.fb.group({
        systemPrompt: ['You are a helpful AI assistant.', Validators.required]
    });

    selectRole(roleId: string) {
        this.identityForm.patchValue({ role: roleId });
    }

    summonAgent() {
        // Collect all data
        const agentData = {
            ...this.identityForm.value,
            ...this.modelForm.value,
            tools: this.toolsForm.value,
            systemPrompt: this.promptForm.value.systemPrompt
        };

        console.log('Summoning agent:', agentData);
        // TODO: Call service
        this.router.navigate(['/agents']);
    }
}
