import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '@core/services/api/project.service';
import { GenerationService } from '@core/services/api/generation.service';
import { RegistryService } from '@core/services/api/registry.service';
import { AuthService } from '@core/services/api/auth.service';
import { GenerationRequest, AnalysisResponse, GenerationResponse } from '@core/models/generation/generation.model';
import { ProjectResponseDTO as Project } from '@core/models/project/project.responses';
import { ProjectCreateRequest as CreateProjectRequest } from '@core/models/project/project.model';
import { LanguageRegistry } from '@core/models/database/database.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface Language {
  name: string;
  display_name: string;
  frameworks: Framework[];
}

interface Framework {
  name: string;
  version: string;
  description: string;
}

@Component({
  selector: 'app-project-generation',
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
    MatSlideToggleModule
  ],
  templateUrl: './project-generation.component.html',
  styleUrls: ['./project-generation.component.scss']
})
export class ProjectGenerationComponent implements OnInit {
  projectName = '';
  description = '';
  selectedLanguage = '';
  selectedFramework = '';
  selectedDatabase = 'postgresql';
  analysis: AnalysisResponse | null = null;
  generating = false;
  generationId: string | null = null;
  loading = false;

  // Advanced options
  includeAuth = true;
  includeRBAC = true;
  includeKubernetes = false;
  customConnectionString = '';

  languages: Language[] = [];
  frameworks: Framework[] = [];

  constructor(
    private generationService: GenerationService,
    private projectService: ProjectService,
    private registryService: RegistryService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadLanguages();
  }

  loadLanguages() {
    this.loading = true;
    this.registryService.getLanguages().subscribe({
      next: (response) => {
        this.languages = response.languages.map(lang => ({
          name: lang.name,
          display_name: lang.name.charAt(0).toUpperCase() + lang.name.slice(1),
          frameworks: [] // Will load on selection or use registry
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load languages:', error);
        this.loading = false;
      }
    });
  }

  onLanguageChange() {
    if (!this.selectedLanguage) {
      this.frameworks = [];
      return;
    }

    this.loading = true;
    this.registryService.getFrameworksByLanguage(this.selectedLanguage).subscribe({
      next: (response) => {
        const data = response.data || {};
        this.frameworks = Object.keys(data).map(name => ({
          name: name,
          version: data[name].latest_version || data[name].version || 'Unknown',
          description: data[name].description || ''
        }));
        this.selectedFramework = '';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.frameworks = [];
      }
    });
  }

  onFrameworkChange() {
    // Handle framework change if needed
  }

  analyzeDescription() {
    if (!this.description) return;

    this.generationService.analyzeDescription({ description: this.description }).subscribe((response: AnalysisResponse) => {
      this.analysis = response;
    });
  }

  generateProject() {
    if (!this.projectName || !this.selectedLanguage || !this.selectedFramework) return;

    this.generating = true;
    const request: GenerationRequest = {
      project_name: this.projectName,
      description: this.description,
      languages: [{ name: this.selectedLanguage, framework: this.selectedFramework, version: 'latest' }],
      database: { type: this.selectedDatabase as 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'elasticsearch' | 'cassandra' }
    };

    this.generationService.generateProject(request).subscribe((response: GenerationResponse) => {
      this.generationId = response.project_id;
      this.checkGenerationStatus();
    });
  }

  private checkGenerationStatus() {
    if (!this.generationId) return;

    this.generationService.getGenerationStatus(this.generationId).subscribe({
      next: (status: any) => {
        if (status.status === 'completed') {
          this.generating = false;
          // Project generation completed, navigate to IDE directly
          // The generation service creates the project in the backend
          this.router.navigate(['/ide', this.generationId]);
        } else if (status.status === 'failed') {
          this.generating = false;
          alert('Project generation failed. Please try again.');
        } else {
          // Continue checking status
          setTimeout(() => this.checkGenerationStatus(), 2000);
        }
      },
      error: (error) => {
        this.generating = false;
        console.error('Failed to check generation status:', error);
        alert('Error checking generation status. Please check your project list.');
      }
    });
  }
}
