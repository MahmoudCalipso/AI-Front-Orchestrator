import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-manifest-generator',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatChipsModule
    ],
    template: `
    <div class="manifest-container">
      <!-- Header -->
      <div class="manifest-header">
        <button mat-icon-button routerLink="/kubernetes" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>description</mat-icon>
            Manifest Generator
          </h1>
          <p class="subtitle">Create Kubernetes manifests with AI assistance</p>
        </div>
      </div>

      <!-- Wizard -->
      <div class="wizard-container glass-panel">
        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Resource Type -->
          <mat-step [stepControl]="typeForm">
            <ng-template matStepLabel>Resource Type</ng-template>
            <form [formGroup]="typeForm" class="step-form">
              <h2>Select Resource Type</h2>
              <div class="resource-grid">
                @for (type of resourceTypes; track type.value) {
                  <div class="resource-card" 
                       [class.selected]="typeForm.get('type')?.value === type.value"
                       (click)="selectResourceType(type.value)">
                    <mat-icon>{{ type.icon }}</mat-icon>
                    <h3>{{ type.label }}</h3>
                    <p>{{ type.description }}</p>
                  </div>
                }
              </div>
              <div class="step-actions">
                <button mat-flat-button matStepperNext color="primary" [disabled]="!typeForm.valid">
                  Next
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Basic Configuration -->
          <mat-step [stepControl]="configForm">
            <ng-template matStepLabel>Configuration</ng-template>
            <form [formGroup]="configForm" class="step-form">
              <h2>Basic Configuration</h2>
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="my-app">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Namespace</mat-label>
                <input matInput formControlName="namespace" placeholder="default">
              </mat-form-field>

              @if (typeForm.get('type')?.value === 'deployment') {
                <mat-form-field appearance="outline">
                  <mat-label>Container Image</mat-label>
                  <input matInput formControlName="image" placeholder="nginx:latest">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Replicas</mat-label>
                  <input matInput type="number" formControlName="replicas" placeholder="3">
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Container Port</mat-label>
                  <input matInput type="number" formControlName="port" placeholder="80">
                </mat-form-field>
              }

              <div class="step-actions">
                <button mat-stroked-button matStepperPrevious>Back</button>
                <button mat-flat-button matStepperNext color="primary" [disabled]="!configForm.valid">
                  Next
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Preview & Generate -->
          <mat-step>
            <ng-template matStepLabel>Preview</ng-template>
            <div class="preview-container">
              <h2>Generated Manifest</h2>
              <div class="yaml-preview">
                <pre><code>{{ generatedYaml() }}</code></pre>
              </div>
              <div class="step-actions">
                <button mat-stroked-button matStepperPrevious>Back</button>
                <button mat-flat-button (click)="downloadManifest()" color="accent">
                  <mat-icon>download</mat-icon>
                  Download
                </button>
                <button mat-flat-button (click)="deployManifest()" color="primary">
                  <mat-icon>rocket_launch</mat-icon>
                  Deploy
                </button>
              </div>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
    styleUrls: ['./manifest-generator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManifestGeneratorComponent implements OnInit {
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);

    typeForm!: FormGroup;
    configForm!: FormGroup;
    generatedYaml = signal<string>('');

    resourceTypes = [
        { value: 'deployment', label: 'Deployment', icon: 'deployed_code', description: 'Deploy containerized applications' },
        { value: 'service', label: 'Service', icon: 'cloud', description: 'Expose applications to network' },
        { value: 'configmap', label: 'ConfigMap', icon: 'settings', description: 'Store configuration data' },
        { value: 'secret', label: 'Secret', icon: 'lock', description: 'Store sensitive information' },
        { value: 'ingress', label: 'Ingress', icon: 'input', description: 'HTTP/HTTPS routing' }
    ];

    ngOnInit() {
        this.typeForm = this.fb.group({
            type: ['', Validators.required]
        });

        this.configForm = this.fb.group({
            name: ['', Validators.required],
            namespace: ['default', Validators.required],
            image: [''],
            replicas: [3],
            port: [80]
        });
    }

    selectResourceType(type: string) {
        this.typeForm.patchValue({ type });
    }

    generateYaml() {
        const type = this.typeForm.get('type')?.value;
        const config = this.configForm.value;

        if (type === 'deployment') {
            this.generatedYaml.set(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
spec:
  replicas: ${config.replicas}
  selector:
    matchLabels:
      app: ${config.name}
  template:
    metadata:
      labels:
        app: ${config.name}
    spec:
      containers:
      - name: ${config.name}
        image: ${config.image}
        ports:
        - containerPort: ${config.port}`);
        }
    }

    downloadManifest() {
        this.generateYaml();
        const blob = new Blob([this.generatedYaml()], { type: 'text/yaml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.configForm.get('name')?.value}.yaml`;
        a.click();
        this.toast.success('Manifest downloaded successfully');
    }

    deployManifest() {
        this.generateYaml();
        this.toast.success('Deployment initiated');
    }
}
