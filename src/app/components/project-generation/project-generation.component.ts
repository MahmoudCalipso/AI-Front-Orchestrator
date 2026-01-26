import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService } from '../../core/services/api/generation.service';
import { ProjectService } from '../../core/services/api/project.service';
import { DatabaseService } from '../../core/services/api/database.service';
import { GenerationRequest, AnalysisResponse } from '../../core/models/generation/generation.model';
import { CreateProjectRequest } from '../../core/models/project/project.model';
import { LanguageRegistry } from '../../core/models/database/database.model';

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
  imports: [CommonModule, FormsModule],
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

  languages: Language[] = [];
  frameworks: Framework[] = [];

  constructor(
    private generationService: GenerationService,
    private projectService: ProjectService,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLanguages();
  }

  loadLanguages() {
    this.loading = true;
    this.databaseService.getLanguageRegistry().subscribe({
      next: (response: LanguageRegistry) => {
        this.languages = [];
        // Transform backend data structure to component format
        Object.keys(response.languages).forEach(language => {
          const languageData = (response.languages as any)[language];
          if (languageData && languageData.frameworks) {
            const frameworks: Framework[] = [];
            Object.keys(languageData.frameworks).forEach(framework => {
              const fwData = languageData.frameworks[framework];
              frameworks.push({
                name: framework,
                version: fwData.version || 'Unknown',
                description: fwData.description || 'No description available'
              });
            });

            this.languages.push({
              name: language,
              display_name: language.charAt(0).toUpperCase() + language.slice(1),
              frameworks: frameworks
            });
          }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load languages:', error);
        this.loading = false;
        // Fallback to hardcoded if API fails
        this.languages = [
          { name: 'python', display_name: 'Python', frameworks: [{ name: 'FastAPI', version: '0.128.0', description: 'FastAPI framework' }, { name: 'Django', version: '5.0', description: 'Django framework' }] },
          { name: 'java', display_name: 'Java', frameworks: [{ name: 'Spring Boot', version: '3.0', description: 'Spring Boot framework' }] },
          { name: 'javascript', display_name: 'JavaScript', frameworks: [{ name: 'NestJS', version: '10.0', description: 'NestJS framework' }, { name: 'Express', version: '4.18', description: 'Express framework' }] },
          { name: 'typescript', display_name: 'TypeScript', frameworks: [{ name: 'NestJS', version: '10.0', description: 'NestJS framework' }, { name: 'Express', version: '4.18', description: 'Express framework' }] }
        ];
      }
    });
  }

  onLanguageChange() {
    const lang = this.languages.find(l => l.name === this.selectedLanguage);
    this.frameworks = lang?.frameworks || [];
    this.selectedFramework = '';
  }

  onFrameworkChange() {
    // Handle framework change if needed
  }

  analyzeDescription() {
    if (!this.description) return;

    this.generationService.analyzeDescription({ description: this.description }).subscribe(response => {
      this.analysis = response;
    });
  }

  generateProject() {
    if (!this.projectName || !this.selectedLanguage || !this.selectedFramework) return;

    this.generating = true;
    const request: GenerationRequest = {
      project_name: this.projectName,
      description: this.description,
      languages: [{ name: this.selectedLanguage, framework: this.selectedFramework }],
      database: { type: this.selectedDatabase as 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'elasticsearch' | 'cassandra' }
    };

    this.generationService.generateProject(request).subscribe(response => {
      this.generationId = response.project_id;
      this.checkGenerationStatus();
    });
  }

  private checkGenerationStatus() {
    // TODO: Implement proper status checking
    setTimeout(() => {
      this.generating = false;
      // Create project in backend
      const createRequest: CreateProjectRequest = {
        project_name: this.projectName,
        description: this.description,
        language: this.selectedLanguage,
        framework: this.selectedFramework
      };
      this.projectService.createProject('current-user-id', createRequest).subscribe(project => {
        this.router.navigate(['/ide', project.id]);
      });
    }, 3000);
  }
}
