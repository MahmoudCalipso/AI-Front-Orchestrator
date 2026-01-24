import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subscription } from 'rxjs';
import { GenerationService } from '../../core/services/api/generation.service';
import { MonitoringService } from '../../core/services/api/monitoring.service';
import { StorageService } from '../../core/services/api/storage.service';
import { MonitoringStreamService } from '../../core/services/websocket/monitoring-stream.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StatusColorPipe } from '../../shared/pipes/status-color.pipe';
import { SignalStoreService } from '../../core/services/signal-store.service';

interface MetricCard {
    title: string;
    value: number | string;
    icon: string;
    trend?: number;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        StatusColorPipe,
        LoadingSpinnerComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
    private generationService = inject(GenerationService);
    private monitoringService = inject(MonitoringService);
    private storageService = inject(StorageService);
    private monitoringWs = inject(MonitoringStreamService);
    private store = inject(SignalStoreService);

    loading = signal(true);
    metrics = signal<MetricCard[]>([]);
    recentProjects = signal<any[]>([]);
    systemHealth = signal<any>(null);

    private subscriptions: Subscription[] = [];

    protected readonly Math = Math;

    // Derived signal for UI feedback
    hasCriticalIssues = computed(() => {
        const health = this.systemHealth();
        return health?.cpu_usage > 90 || health?.memory_usage > 90;
    });

    ngOnInit(): void {
        this.loadDashboardData();
        this.connectWebSocket();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.monitoringWs.disconnect();
    }

    connectWebSocket(): void {
        const stream$ = this.monitoringWs.connectToMonitoring();
        const metricsSub = stream$.subscribe(message => {
            if (message && message.type === 'metrics') {
                this.systemHealth.set(message.data);
            }
        });
        this.subscriptions.push(metricsSub);
    }

    loadDashboardData(): void {
        this.loading.set(true);

        this.metrics.set([
            { title: 'Total Projects', value: 0, icon: 'folder', trend: 12, color: 'primary' },
            { title: 'Active Builds', value: 0, icon: 'build', trend: -5, color: 'accent' },
            { title: 'Deployments', value: 0, icon: 'cloud_upload', trend: 8, color: 'success' },
            { title: 'Storage Used', value: '0 GB', icon: 'storage', trend: 3, color: 'warning' }
        ]);

        // Load storage stats
        this.storageService.getStorageStats().subscribe({
            next: (stats) => {
                this.metrics.update(m => {
                    const newMetrics = [...m];
                    newMetrics[0].value = stats.total_projects || 0;
                    const sizeGB = (stats.total_size || 0) / (1024 * 1024 * 1024);
                    newMetrics[3].value = `${sizeGB.toFixed(2)} GB`;
                    return newMetrics;
                });
            },
            error: (error) => console.error('Failed to load storage stats', error)
        });

        // Load recent projects
        this.storageService.listProjects({ page: 1, pageSize: 5 }).subscribe({
            next: (response) => {
                this.recentProjects.set(response.projects || []);
            },
            error: (error) => console.error('Failed to load recent projects', error)
        });

        // Load metrics
        this.monitoringService.getCurrentMetrics().subscribe({
            next: (metrics) => {
                this.systemHealth.set(metrics);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Failed to load metrics', error);
                this.loading.set(false);
            }
        });
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}
