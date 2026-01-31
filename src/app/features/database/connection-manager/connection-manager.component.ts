import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-connection-manager',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatCheckboxModule
    ],
    template: `
    <div class="connection-container">
      <div class="connection-header">
        <h1>
          <mat-icon>add_circle</mat-icon>
          New Database Connection
        </h1>
        <p class="subtitle">Configure connection to your database</p>
      </div>

      <div class="connection-form glass-panel">
        <form [formGroup]="connectionForm" (ngSubmit)="testConnection()">
          <div class="form-section">
            <h2>Connection Details</h2>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Connection Name</mat-label>
              <input matInput formControlName="name" placeholder="Production DB">
              <mat-icon matPrefix>label</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Database Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="postgresql">PostgreSQL</mat-option>
                <mat-option value="mysql">MySQL</mat-option>
                <mat-option value="mongodb">MongoDB</mat-option>
                <mat-option value="sqlite">SQLite</mat-option>
                <mat-option value="redis">Redis</mat-option>
              </mat-select>
              <mat-icon matPrefix>storage</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-section">
            <h2>Server Configuration</h2>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Host</mat-label>
                <input matInput formControlName="host" placeholder="localhost">
                <mat-icon matPrefix>dns</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="port-field">
                <mat-label>Port</mat-label>
                <input matInput type="number" formControlName="port" placeholder="5432">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Database Name</mat-label>
              <input matInput formControlName="database" placeholder="my_database">
              <mat-icon matPrefix>folder</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-section">
            <h2>Authentication</h2>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="postgres">
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
            </mat-form-field>

            <mat-checkbox formControlName="ssl" class="ssl-checkbox">
              <div class="checkbox-content">
                <strong>Use SSL/TLS</strong>
                <span>Encrypt connection for security</span>
              </div>
            </mat-checkbox>
          </div>

          <div class="form-actions">
            <button mat-button type="button" routerLink="..">Cancel</button>
            <button mat-stroked-button type="button" (click)="testConnection()" class="test-btn">
              <mat-icon>network_check</mat-icon>
              Test Connection
            </button>
            <button mat-flat-button type="submit" color="primary" [disabled]="connectionForm.invalid">
              <mat-icon>save</mat-icon>
              Save Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styleUrls: ['./connection-manager.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionManagerComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    connectionForm = this.fb.group({
        name: ['', Validators.required],
        type: ['postgresql', Validators.required],
        host: ['localhost', Validators.required],
        port: [5432, [Validators.required, Validators.min(1), Validators.max(65535)]],
        database: ['', Validators.required],
        username: [''],
        password: [''],
        ssl: [false]
    });

    testConnection() {
        if (this.connectionForm.valid) {
            console.log('Testing connection:', this.connectionForm.value);
            // TODO: Call service to test connection
            alert('Connection test successful!');
        }
    }

    saveConnection() {
        if (this.connectionForm.valid) {
            console.log('Saving connection:', this.connectionForm.value);
            // TODO: Call service to save connection
            this.router.navigate(['/database']);
        }
    }
}
