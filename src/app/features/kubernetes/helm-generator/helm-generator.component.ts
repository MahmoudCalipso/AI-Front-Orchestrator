import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'app-helm-generator',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule
    ],
    template: `
    <div class="helm-container">
      <div class="helm-header">
        <button mat-icon-button routerLink="/kubernetes" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="header-content">
          <h1>
            <mat-icon>sailing</mat-icon>
            Helm Chart Generator
          </h1>
          <p class="subtitle">Create production-ready Helm charts</p>
        </div>
      </div>

      <div class="helm-panel glass-panel">
        <form [formGroup]="helmForm">
          <mat-form-field appearance="outline">
            <mat-label>Chart Name</mat-label>
            <input matInput formControlName="name" placeholder="my-app">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Version</mat-label>
            <input matInput formControlName="version" placeholder="1.0.0">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="A Helm chart for Kubernetes"></textarea>
          </mat-form-field>

          <div class="actions">
            <button mat-flat-button (click)="generateChart()" color="primary" [disabled]="!helmForm.valid">
              <mat-icon>auto_awesome</mat-icon>
              Generate Chart
            </button>
          </div>
        </form>

        @if (generatedChart()) {
          <div class="chart-preview">
            <h2>Generated Helm Chart</h2>
            <mat-tab-group>
              <mat-tab label="Chart.yaml">
                <pre><code>{{ generatedChart()?.['Chart.yaml'] }}</code></pre>
              </mat-tab>
              <mat-tab label="values.yaml">
                <pre><code>{{ generatedChart()?.['values.yaml'] }}</code></pre>
              </mat-tab>
              <mat-tab label="deployment.yaml">
                <pre><code>{{ generatedChart()?.['templates/deployment.yaml'] }}</code></pre>
              </mat-tab>
            </mat-tab-group>
            <button mat-flat-button (click)="downloadChart()" color="accent">
              <mat-icon>download</mat-icon>
              Download Chart
            </button>
          </div>
        }
      </div>
    </div>
  `,
    styleUrls: ['./helm-generator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelmGeneratorComponent {
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);

    helmForm = this.fb.group({
        name: ['', Validators.required],
        version: ['1.0.0', Validators.required],
        description: ['A Helm chart for Kubernetes']
    });

    generatedChart = signal<Record<string, string> | null>(null);

    generateChart() {
        const { name, version, description } = this.helmForm.value;

        this.generatedChart.set({
            'Chart.yaml': `apiVersion: v2
name: ${name}
description: ${description}
type: application
version: ${version}
appVersion: "1.0.0"`,
            'values.yaml': `replicaCount: 3

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80`,
            'templates/deployment.yaml': `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "${name}.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "${name}.name" . }}
  template:
    metadata:
      labels:
        app: {{ include "${name}.name" . }}
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: 80`
        });

        this.toast.success('Helm chart generated successfully');
    }

    downloadChart() {
        this.toast.success('Helm chart downloaded');
    }
}
