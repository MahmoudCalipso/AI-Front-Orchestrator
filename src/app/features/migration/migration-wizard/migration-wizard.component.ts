import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MigrationService } from '../../../core/services/api/migration.service';
import { DatabaseService } from '../../../core/services/api/database.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

interface MigrationFile {
  path: string;
  originalCode: string;
  migratedCode: string;
  changes: number;
}

@Component({
  selector: 'app-migration-wizard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatTabsModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './migration-wizard.component.html',
  styleUrl: './migration-wizard.component.css'
})
export class MigrationWizardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private migrationService = inject(MigrationService);
  private databaseService = inject(DatabaseService);
  private toast = inject(ToastService);

  // Forms
  sourceForm!: FormGroup;
  targetForm!: FormGroup;
  configForm!: FormGroup;

  // Data
  frameworks: any[] = [];
  sourceFrameworks: any[] = [];
  targetFrameworks: any[] = [];

  // State
  loading = false;
  migrating = false;
  migrationProgress = 0;
  migrationResult: any = null;
  selectedFile: MigrationFile | null = null;

  ngOnInit(): void {
    this.initializeForms();
    this.loadFrameworks();
  }

  initializeForms(): void {
    this.sourceForm = this.fb.group({
      projectPath: ['', Validators.required],
      sourceLanguage: ['', Validators.required],
      sourceFramework: ['', Validators.required]
    });

    this.targetForm = this.fb.group({
      targetLanguage: ['', Validators.required],
      targetFramework: ['', Validators.required],
      targetVersion: ['']
    });

    this.configForm = this.fb.group({
      preserveStructure: [true],
      updateDependencies: [true],
      generateTests: [true],
      optimizeCode: [false]
    });
  }

  loadFrameworks(): void {
    this.loading = true;
    this.databaseService.getLanguageRegistry().subscribe({
      next: (registry) => {
        this.frameworks = registry.languages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load frameworks', error);
        this.loading = false;
        // Fallback
        this.frameworks = [
          { name: 'python', display_name: 'Python', frameworks: [{ name: 'Django', version: '5.0' }, { name: 'FastAPI', version: '0.128.0' }] },
          { name: 'typescript', display_name: 'TypeScript', frameworks: [{ name: 'NestJS', version: '10.0' }, { name: 'Express', version: '4.18' }] },
          { name: 'java', display_name: 'Java', frameworks: [{ name: 'Spring Boot', version: '3.2' }] }
        ];
      }
    });
  }

  onSourceLanguageChange(language: string): void {
    const lang = this.frameworks.find(f => f.name === language);
    this.sourceFrameworks = lang?.frameworks || [];
    this.sourceForm.patchValue({ sourceFramework: '' });
  }

  onTargetLanguageChange(language: string): void {
    const lang = this.frameworks.find(f => f.name === language);
    this.targetFrameworks = lang?.frameworks || [];
    this.targetForm.patchValue({ targetFramework: '', targetVersion: '' });
  }

  onTargetFrameworkChange(framework: string): void {
    const fw = this.targetFrameworks.find(f => f.name === framework);
    if (fw) {
      this.targetForm.patchValue({ targetVersion: fw.version });
    }
  }

  startMigration(): void {
    if (this.sourceForm.invalid || this.targetForm.invalid) return;

    this.migrating = true;
    this.migrationProgress = 0;

    const request = {
      project_path: this.sourceForm.value.projectPath,
      source_language: this.sourceForm.value.sourceLanguage,
      source_framework: this.sourceForm.value.sourceFramework,
      target_language: this.targetForm.value.targetLanguage,
      target_framework: this.targetForm.value.targetFramework,
      target_version: this.targetForm.value.targetVersion,
      options: {
        preserve_structure: this.configForm.value.preserveStructure,
        update_dependencies: this.configForm.value.updateDependencies,
        generate_tests: this.configForm.value.generateTests,
        optimize_code: this.configForm.value.optimizeCode
      }
    };

    // Simulate progress
    const progressInterval = setInterval(() => {
      this.migrationProgress += 10;
      if (this.migrationProgress >= 90) {
        clearInterval(progressInterval);
      }
    }, 800);

    this.migrationService.migrateProject(request).subscribe({
      next: (result) => {
        clearInterval(progressInterval);
        this.migrationProgress = 100;
        this.migrationResult = result;
        this.migrating = false;
        this.toast.success('Migration completed successfully!');

        // Set first file as selected
        if (result.migrated_files && result.migrated_files.length > 0) {
          this.selectedFile = result.migrated_files[0];
        }
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.migrating = false;
        this.migrationProgress = 0;
        this.toast.error('Migration failed');
      }
    });
  }

  selectFile(file: MigrationFile): void {
    this.selectedFile = file;
  }

  downloadMigratedProject(): void {
    this.toast.info('Download functionality will be implemented');
  }

  reset(): void {
    this.sourceForm.reset();
    this.targetForm.reset();
    this.configForm.reset({
      preserveStructure: true,
      updateDependencies: true,
      generateTests: true,
      optimizeCode: false
    });
    this.migrationResult = null;
    this.selectedFile = null;
    this.migrationProgress = 0;
  }
}
