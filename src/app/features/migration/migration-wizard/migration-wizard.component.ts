import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { MigrationService } from '../../../core/services/api/migration.service';
import { DatabaseService } from '../../../core/services/api/database.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MigrationStrategy } from '../../../core/models/migration/migration.model';

interface MigrationFile {
  path: string;
  originalCode: string;
  migratedCode: string;
  changes: number;
}

@Component({
  selector: 'app-migration-wizard',
  standalone: true,
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
    LoadingSpinnerComponent,
    FormsModule,
    MatCheckboxModule,
    HighlightDirective
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

  // Signals
  frameworks = signal<any[]>([]);
  sourceFrameworks = signal<any[]>([]);
  targetFrameworks = signal<any[]>([]);
  loading = signal(false);
  migrating = signal(false);
  migrationProgress = signal(0);
  migrationResult = signal<any>(null);
  selectedFile = signal<MigrationFile | null>(null);

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
    this.loading.set(true);
    this.databaseService.getLanguageRegistry().subscribe({
      next: (registry) => {
        this.frameworks.set(registry.languages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.frameworks.set([
          { name: 'python', display_name: 'Python', frameworks: [{ name: 'Django', version: '5.0' }, { name: 'FastAPI', version: '0.128.0' }] },
          { name: 'typescript', display_name: 'TypeScript', frameworks: [{ name: 'NestJS', version: '10.0' }, { name: 'Express', version: '4.18' }] }
        ]);
      }
    });
  }

  onSourceLanguageChange(language: string): void {
    const lang = this.frameworks().find(f => f.name === language);
    this.sourceFrameworks.set(lang?.frameworks || []);
    this.sourceForm.patchValue({ sourceFramework: '' });
  }

  onTargetLanguageChange(language: string): void {
    const lang = this.frameworks().find(f => f.name === language);
    this.targetFrameworks.set(lang?.frameworks || []);
    this.targetForm.patchValue({ targetFramework: '', targetVersion: '' });
  }

  onTargetFrameworkChange(framework: string): void {
    const fw = this.targetFrameworks().find(f => f.name === framework);
    if (fw) this.targetForm.patchValue({ targetVersion: fw.version });
  }

  startMigration(): void {
    if (this.sourceForm.invalid || this.targetForm.invalid) return;
    this.migrating.set(true);
    this.migrationProgress.set(0);

    const request = {
      project_path: this.sourceForm.value.projectPath,
      source_stack: { language: this.sourceForm.value.sourceLanguage, framework: this.sourceForm.value.sourceFramework },
      target_stack: { language: this.targetForm.value.targetLanguage, framework: this.targetForm.value.targetFramework, version: this.targetForm.value.targetVersion },
      migration_strategy: 'strangler-fig' as MigrationStrategy,
      include_dependencies: this.configForm.value.updateDependencies,
      dry_run: false
    };

    const progressInterval = setInterval(() => {
      this.migrationProgress.update(p => p < 90 ? p + 10 : p);
    }, 800);

    this.migrationService.migrateProject(request).subscribe({
      next: (result) => {
        clearInterval(progressInterval);
        this.migrationProgress.set(100);
        this.migrationResult.set(result);
        this.migrating.set(false);
        this.toast.success('Migration completed!');
        if (result?.migrated_files && result.migrated_files.length > 0) this.selectedFile.set(result.migrated_files[0]);
      },
      error: () => {
        clearInterval(progressInterval);
        this.migrating.set(false);
        this.migrationProgress.set(0);
        this.toast.error('Migration failed');
      }
    });
  }

  selectFile(file: MigrationFile): void {
    this.selectedFile.set(file);
  }

  downloadMigratedProject(): void {
    this.toast.info('Download functionality implemented soon');
  }

  reset(): void {
    this.sourceForm.reset();
    this.targetForm.reset();
    this.configForm.reset({ preserveStructure: true, updateDependencies: true, generateTests: true, optimizeCode: false });
    this.migrationResult.set(null);
    this.selectedFile.set(null);
    this.migrationProgress.set(0);
  }
}
