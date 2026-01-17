import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GenerationService } from '../../../core/services/api/generation.service';
import { DatabaseService } from '../../../core/services/api/database.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

interface Language {
    name: string;
    displayName: string;
    frameworks: Framework[];
}

interface Framework {
    name: string;
    version: string;
    description: string;
}

@Component({
    selector: 'app-generation-wizard',
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
        MatChipsModule,
        MatProgressBarModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './generation-wizard.component.html',
    styleUrl: './generation-wizard.component.css'
})
export class GenerationWizardComponent implements OnInit {
    private fb = inject(FormBuilder);
    private generationService = inject(GenerationService);
    private databaseService = inject(DatabaseService);
    private router = inject(Router);
    private toast = inject(ToastService);

    // Form groups for each step
    descriptionForm!: FormGroup;
    languageForm!: FormGroup;
    configForm!: FormGroup;

    // Data
    languages: Language[] = [];
    selectedLanguage?: Language;
    frameworks: Framework[] = [];

    // State
    loading = false;
    analyzing = false;
    generating = false;
    generationProgress = 0;
    analysisResult: any = null;
    generationResult: any = null;

    ngOnInit(): void {
        this.initializeForms();
        this.loadLanguages();
    }

    initializeForms(): void {
        this.descriptionForm = this.fb.group({
            projectName: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(20)]]
        });

        this.languageForm = this.fb.group({
            language: ['', Validators.required],
            framework: ['', Validators.required],
            version: ['']
        });

        this.configForm = this.fb.group({
            includeDocker: [true],
            includeTests: [true],
            includeCI: [true],
            database: [''],
            authentication: ['jwt']
        });
    }

    loadLanguages(): void {
        this.loading = true;
        this.databaseService.getLanguageRegistry().subscribe({
            next: (registry) => {
                this.languages = registry.languages.map(lang => ({
                    name: lang.name,
                    displayName: lang.display_name,
                    frameworks: lang.frameworks.map(fw => ({
                        name: fw.name,
                        version: fw.version,
                        description: fw.description
                    }))
                }));
                this.loading = false;
            },
            error: (error) => {
                console.error('Failed to load languages from API:', error);
                this.loading = false;
                this.toast.error('Failed to load language registry. Please check your connection to the backend.');
                this.languages = [];
            }
        });
    }

    onLanguageChange(languageName: string): void {
        this.selectedLanguage = this.languages.find(l => l.name === languageName);
        this.frameworks = this.selectedLanguage?.frameworks || [];
        this.languageForm.patchValue({ framework: '', version: '' });
    }

    onFrameworkChange(frameworkName: string): void {
        const framework = this.frameworks.find(f => f.name === frameworkName);
        if (framework) {
            this.languageForm.patchValue({ version: framework.version });
        }
    }

    analyzeDescription(): void {
        if (this.descriptionForm.invalid) return;

        this.analyzing = true;
        const { description } = this.descriptionForm.value;

        this.generationService.analyzeDescription({ description }).subscribe({
            next: (result) => {
                this.analysisResult = result;
                this.analyzing = false;
                this.toast.success('Description analyzed successfully!');

                // Auto-fill language form if suggestions available
                const suggestions = (result as any).suggested_languages;
                if (suggestions && suggestions.length > 0) {
                    const suggested = suggestions[0];
                    this.languageForm.patchValue({
                        language: suggested.name,
                        framework: suggested.framework
                    });
                    this.onLanguageChange(suggested.name);
                }
            },
            error: (error) => {
                this.analyzing = false;
                this.toast.error('Failed to analyze description');
            }
        });
    }

    generateProject(): void {
        if (this.descriptionForm.invalid || this.languageForm.invalid) return;

        this.generating = true;
        this.generationProgress = 0;

        const request = {
            project_name: this.descriptionForm.value.projectName,
            description: this.descriptionForm.value.description,
            languages: [{
                name: this.languageForm.value.language,
                framework: this.languageForm.value.framework,
                version: this.languageForm.value.version
            }],
            options: {
                include_docker: this.configForm.value.includeDocker,
                include_tests: this.configForm.value.includeTests,
                include_ci: this.configForm.value.includeCI,
                database: this.configForm.value.database,
                authentication: this.configForm.value.authentication
            }
        };

        // Simulate progress
        const progressInterval = setInterval(() => {
            this.generationProgress += 10;
            if (this.generationProgress >= 90) {
                clearInterval(progressInterval);
            }
        }, 500);

        this.generationService.generateProject(request).subscribe({
            next: (result) => {
                clearInterval(progressInterval);
                this.generationProgress = 100;
                this.generationResult = result;
                this.generating = false;
                this.toast.success('Project generated successfully!');
            },
            error: (error) => {
                clearInterval(progressInterval);
                this.generating = false;
                this.generationProgress = 0;
                this.toast.error('Failed to generate project');
            }
        });
    }

    downloadProject(): void {
        if (!this.generationResult) return;

        // Implementation for downloading the generated project
        this.toast.info('Download functionality will be implemented');
    }

    viewInIDE(): void {
        if (!this.generationResult) return;

        this.router.navigate(['/ide'], {
            queryParams: { project: this.generationResult.project_id }
        });
    }

    reset(): void {
        this.descriptionForm.reset();
        this.languageForm.reset();
        this.configForm.reset({
            includeDocker: true,
            includeTests: true,
            includeCI: true,
            authentication: 'jwt'
        });
        this.analysisResult = null;
        this.generationResult = null;
        this.generationProgress = 0;
    }
}
