import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { StorageService } from '../../../core/services/api/storage.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

interface Project {
    project_id: string;
    project_name: string;
    language: string;
    framework: string;
    created_at: string;
    size_mb: number;
    status: string;
}

@Component({
    selector: 'app-project-list',
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatMenuModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
    private storageService = inject(StorageService);
    private router = inject(Router);
    private toast = inject(ToastService);

    projects: Project[] = [];
    filteredProjects: Project[] = [];
    loading = false;

    searchQuery = '';
    filterLanguage = 'all';
    filterStatus = 'all';

    languages: string[] = [];
    storageStats: any = null;

    ngOnInit(): void {
        this.loadProjects();
        this.loadStorageStats();
    }

    loadProjects(): void {
        this.loading = true;
        this.storageService.listProjects({ page: 1, pageSize: 100 }).subscribe({
            next: (response) => {
                // Map ProjectMetadata to Project interface
                this.projects = (response.projects || []).map(p => ({
                    project_id: p.project_id,
                    project_name: p.name || p.project_id,
                    language: p.languages?.[0] || 'Unknown',
                    framework: p.frameworks?.[0] || 'Unknown',
                    created_at: p.created_at,
                    size_mb: p.size / (1024 * 1024), // Convert bytes to MB
                    status: p.status
                }));
                this.filteredProjects = this.projects;
                this.extractLanguages();
                this.loading = false;
            },
            error: (error) => {
                console.error('Failed to load projects from API:', error);
                this.loading = false;
                this.toast.error('Failed to load projects. Please check your connection to the backend.');
                this.projects = [];
                this.filteredProjects = [];
            }
        });
    }

    loadStorageStats(): void {
        this.storageService.getStorageStats().subscribe({
            next: (stats) => {
                this.storageStats = {
                    total_projects: stats.total_projects,
                    total_size_gb: stats.total_size / (1024 * 1024 * 1024), // Convert bytes to GB
                    used_percentage: (stats.used_space / stats.total_size) * 100
                };
            },
            error: (error) => {
                console.error('Failed to load storage stats from API:', error);
                this.storageStats = null;
            }
        });
    }

    extractLanguages(): void {
        const langSet = new Set(this.projects.map(p => p.language));
        this.languages = Array.from(langSet);
    }

    applyFilters(): void {
        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = project.project_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                project.language.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                project.framework.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesLanguage = this.filterLanguage === 'all' || project.language === this.filterLanguage;
            const matchesStatus = this.filterStatus === 'all' || project.status === this.filterStatus;

            return matchesSearch && matchesLanguage && matchesStatus;
        });
    }

    openProject(project: Project): void {
        this.router.navigate(['/ide'], { queryParams: { project: project.project_id } });
    }

    downloadProject(project: Project): void {
        // Download functionality - would call backend endpoint
        this.toast.info('Download functionality will be implemented');
    }

    deleteProject(project: Project): void {
        if (confirm(`Are you sure you want to delete ${project.project_name}?`)) {
            this.storageService.deleteProject(project.project_id).subscribe({
                next: () => {
                    this.toast.success('Project deleted successfully');
                    this.loadProjects();
                    this.loadStorageStats();
                },
                error: (error) => {
                    this.toast.error('Failed to delete project');
                }
            });
        }
    }

    archiveProject(project: Project): void {
        this.storageService.archiveProject(project.project_id).subscribe({
            next: () => {
                this.toast.success('Project archived successfully');
                this.loadProjects();
            },
            error: (error) => {
                this.toast.error('Failed to archive project');
            }
        });
    }

    getStatusColor(status: string): string {
        const colors: { [key: string]: string } = {
            'active': 'success',
            'archived': 'warning',
            'deleted': 'error'
        };
        return colors[status] || 'info';
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}
