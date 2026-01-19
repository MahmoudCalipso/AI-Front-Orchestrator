import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { GenerationService } from '../../core/services/api/generation.service';
import { MonitoringService } from '../../core/services/api/monitoring.service';
import { StorageService } from '../../core/services/api/storage.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

interface MetricCard {
    title: string;
    value: number | string;
    icon: string;
    trend?: number;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    private generationService = inject(GenerationService);
    private monitoringService = inject(MonitoringService);
    private storageService = inject(StorageService);

    loading = true;
    metrics: MetricCard[] = [];
    recentProjects: any[] = [];
    systemHealth: any = null;

    protected readonly Math = Math;

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading = true;

        // Load metrics
        this.metrics = [
            {
                title: 'Total Projects',
                value: 0,
                icon: 'folder',
                trend: 12,
                color: 'primary'
            },
            {
                title: 'Active Builds',
                value: 0,
                icon: 'build',
                trend: -5,
                color: 'accent'
            },
            {
                title: 'Deployments',
                value: 0,
                icon: 'cloud_upload',
                trend: 8,
                color: 'success'
            },
            {
                title: 'Storage Used',
                value: '0 GB',
                icon: 'storage',
                trend: 3,
                color: 'warning'
            }
        ];

        // Load storage stats
        this.storageService.getStorageStats().subscribe({
            next: (stats) => {
                this.metrics[0].value = stats.total_projects || 0;
                // Assuming total_size is in bytes, convert to GB
                const sizeGB = (stats.total_size || 0) / (1024 * 1024 * 1024);
                this.metrics[3].value = `${sizeGB.toFixed(2)} GB`;
            },
            error: (error) => console.error('Failed to load storage stats', error)
        });

        // Load recent projects
        this.storageService.listProjects({ page: 1, pageSize: 5 }).subscribe({
            next: (response) => {
                this.recentProjects = response.projects || [];
            },
            error: (error) => console.error('Failed to load recent projects', error)
        });

        // Load monitoring metrics
        this.monitoringService.getCurrentMetrics().subscribe({
            next: (metrics) => {
                this.systemHealth = metrics;
                this.loading = false;
            },
            error: (error) => {
                console.error('Failed to load metrics', error);
                this.loading = false;
            }
        });
    }

    getStatusColor(status: string): string {
        const statusColors: { [key: string]: string } = {
            'completed': 'success',
            'in_progress': 'warning',
            'failed': 'error',
            'pending': 'info'
        };
        return statusColors[status] || 'info';
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}
