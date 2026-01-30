import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MigrationService } from '@core/services/api/migration.service';
import { RegistryService } from '@core/services/api/registry.service';
import { ToastService } from '../../../shared/services/toast.service';
import { MigrationWorkflowRequest, MigrationWorkflowResponse } from '@core/models/migration/migration.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-project-migration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './project-migration.component.html',
  styleUrls: ['./project-migration.component.scss']
})
export class ProjectMigrationComponent {
  sourcePath = '';
  selectedSourceLanguage = '';
  selectedSourceFramework = '';
  selectedTargetLanguage = '';
  selectedTargetFramework = '';

  languages: any[] = [];
  sourceFrameworks: any[] = [];
  targetFrameworks: any[] = [];

  isMigrating = false;
  migrationProgress = 0;
  currentStep = '';
  migrationId: string | null = null;
  loading = false;

  constructor(
    private migrationService: MigrationService,
    private registryService: RegistryService,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadLanguages();
  }

  loadLanguages() {
    this.loading = true;
    this.registryService.getLanguages().subscribe({
      next: (response) => {
        this.languages = response.languages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSourceLanguageChange() {
    if (!this.selectedSourceLanguage) {
      this.sourceFrameworks = [];
      return;
    }
    this.registryService.getFrameworksByLanguage(this.selectedSourceLanguage).subscribe(res => {
      const data = res.data || {};
      this.sourceFrameworks = Object.keys(data).map(name => ({ name }));
    });
  }

  onTargetLanguageChange() {
    if (!this.selectedTargetLanguage) {
      this.targetFrameworks = [];
      return;
    }
    this.registryService.getFrameworksByLanguage(this.selectedTargetLanguage).subscribe(res => {
      const data = res.data || {};
      this.targetFrameworks = Object.keys(data).map(name => ({ name }));
    });
  }

  startMigration() {
    if (!this.sourcePath || !this.selectedSourceLanguage || !this.selectedTargetLanguage) {
      this.toast.error('Please fill in all required fields');
      return;
    }

    this.isMigrating = true;
    this.migrationProgress = 0;
    this.currentStep = 'Initializing migration...';

    const request: MigrationWorkflowRequest = {
      project_path: this.sourcePath,
      source_stack: { language: this.selectedSourceLanguage, framework: this.selectedSourceFramework },
      target_stack: { language: this.selectedTargetLanguage, framework: this.selectedTargetFramework },
      include_dependencies: true,
      dry_run: false
    };

    this.migrationService.startMigrationWorkflow(request).subscribe({
      next: (response: MigrationWorkflowResponse) => {
        this.migrationId = response.migration_id;
        this.toast.success('Migration started successfully');
        this.checkMigrationStatus();
      },
      error: (error) => {
        this.isMigrating = false;
        this.toast.error('Failed to start migration');
        console.error('Migration start error:', error);
      }
    });
  }

  private checkMigrationStatus() {
    if (!this.migrationId) return;

    this.migrationService.getMigrationStatus(this.migrationId).subscribe({
      next: (status: MigrationWorkflowResponse) => {
        this.migrationProgress = status.progress || 0;
        this.currentStep = status.current_phase || 'Processing...';

        if (status.status === 'completed') {
          this.isMigrating = false;
          this.toast.success('Migration completed successfully!');
          // Optionally navigate to the migrated project
          // this.router.navigate(['/projects', status.project_id]);
        } else if (status.status === 'failed') {
          this.isMigrating = false;
          this.toast.error('Migration failed. Please check the logs and try again.');
        } else {
          // Continue checking status
          setTimeout(() => this.checkMigrationStatus(), 2000);
        }
      },
      error: (error) => {
        this.isMigrating = false;
        this.toast.error('Error checking migration status');
        console.error('Migration status check error:', error);
      }
    });
  }
}
