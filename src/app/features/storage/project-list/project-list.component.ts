import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StorageService } from '../../../core/services/api/storage.service';
import { Project } from '../../../core/models/index';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SignalStoreService } from '../../../core/services/signal-store.service';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDividerModule,
        CardComponent,
        ButtonComponent,
        ScrollingModule
    ],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {
    private storageService = inject(StorageService);
    private store = inject(SignalStoreService);

    // Signals
    projects = signal<Project[]>([]);
    totalProjectCount = signal(0);
    searchFilter = signal('');
    selectedLanguage = signal('');
    selectedFramework = signal('');
    selectedStatus = signal('');
    viewMode = signal<'grid' | 'list'>('grid');
    loading = signal(false);
    page = signal(1);
    pageSize = signal(12);

    // Computed
    filteredProjects = computed(() => {
        const query = this.searchFilter().toLowerCase();
        const lang = this.selectedLanguage();
        const framework = this.selectedFramework();
        const status = this.selectedStatus();

        return this.projects().filter(project => {
            const matchesSearch = !query || project.project_name.toLowerCase().includes(query);
            const matchesLanguage = !lang || project.language === lang;
            const matchesFramework = !framework || (project.framework === framework);
            const matchesStatus = !status || project.status === status;
            return matchesSearch && matchesLanguage && matchesFramework && matchesStatus;
        });
    });

    ngOnInit(): void {
        this.loadProjects();
    }

    loadProjects(): void {
        this.loading.set(true);
        this.storageService.listProjects({
            page: this.page(),
            pageSize: this.pageSize()
        }).subscribe({
            next: (response) => {
                const mapped = (response.projects || []).map((p: any) => ({
                    id: p.project_id || p.id,
                    name: p.name || p.project_name,
                    project_name: p.name || p.project_name,
                    user_id: p.user_id || p.owner,
                    language: p.language || (p.languages && p.languages[0]) || 'unknown',
                    framework: p.framework || (p.frameworks && p.frameworks[0]),
                    database: p.database,
                    description: p.description,
                    status: p.status,
                    size_bytes: p.size_bytes || p.size,
                    file_count: p.file_count,
                    created_at: p.created_at,
                    updated_at: p.updated_at,
                    protected: p.protected
                } as Project));

                this.projects.set(mapped);
                this.totalProjectCount.set(response.total || 0);
                this.loading.set(false);
            },
            error: (error: any) => {
                console.error('Failed to load projects', error);
                this.loading.set(false);
                this.projects.set([]);
            }
        });
    }

    onSearchChange(): void {
        // Computed signal handles the filter automatically
    }

    createProject(): void {
        window.location.href = '/generation';
    }

    openProject(project: Project): void {
        this.store.setActiveProject(project);
        window.location.href = `/ide?project=${project.id}`;
    }

    openInIDE(project: Project): void {
        this.openProject(project);
    }

    downloadProject(project: Project): void {
        this.storageService.downloadProject(project.id).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.project_name}.zip`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error: any) => console.error('Failed to download project', error)
        });
    }

    duplicateProject(project: Project): void {
        console.log('Duplicate project', project);
        // Implement duplication logic via StorageService
    }

    archiveProject(project: Project): void {
        console.log('Archive project', project);
        // Implement archive logic via StorageService
    }

    deleteProject(project: Project): void {
        if (confirm(`Are you sure you want to delete "${project.project_name}"?`)) {
            this.storageService.deleteProject(project.id).subscribe({
                next: () => this.loadProjects(),
                error: (error) => console.error('Failed to delete project', error)
            });
        }
    }

    getProjectColor(language: string): string {
        const colors: Record<string, string> = {
            javascript: 'linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%)',
            typescript: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
            python: 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)'
        };
        return colors[language.toLowerCase()] || 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)';
    }

    getProjectIcon(language: string): string {
        const icons: Record<string, string> = {
            javascript: 'code',
            typescript: 'code',
            python: 'code'
        };
        return icons[language.toLowerCase()] || 'folder';
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatSize(bytes?: number): string {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    formatRelativeTime(date?: string): string {
        if (!date) return 'Never';
        const now = new Date();
        const then = new Date(date);
        const diff = now.getTime() - then.getTime();
        const days = Math.floor(diff / 86400000);
        if (days < 1) return 'Today';
        if (days < 30) return `${days}d ago`;
        return this.formatDate(date);
    }

    onPageChange(event: PageEvent): void {
        this.page.set(event.pageIndex + 1);
        this.pageSize.set(event.pageSize);
        this.loadProjects();
    }

    trackByProjectId(index: number, project: Project): string {
        return project.id;
    }
}
