import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MonitoringService } from '../../../core/services/api/monitoring.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

declare const Chart: any;

@Component({
  selector: 'app-monitoring-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './monitoring-dashboard.component.html',
  styleUrl: './monitoring-dashboard.component.css'
})
export class MonitoringDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cpuChart') cpuChartRef!: ElementRef;
  @ViewChild('memoryChart') memoryChartRef!: ElementRef;
  @ViewChild('requestsChart') requestsChartRef!: ElementRef;
  @ViewChild('responseTimeChart') responseTimeChartRef!: ElementRef;

  private monitoringService = inject(MonitoringService);

  cpuChart: any;
  memoryChart: any;
  requestsChart: any;
  responseTimeChart: any;

  loading = signal(false);
  currentMetrics = signal<any>(null);
  buildHistory = signal<any[]>([]);
  updateInterval: any;

  timeRange = signal('1h');

  ngOnInit(): void {
    this.loadChartJS();
    this.loadCurrentMetrics();
    this.loadBuildHistory();
    this.startRealTimeUpdates();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.destroyCharts();
  }

  loadChartJS(): void {
    if (typeof Chart !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = () => {
      setTimeout(() => this.initializeCharts(), 100);
    };
    document.head.appendChild(script);
  }

  initializeCharts(): void {
    if (typeof Chart === 'undefined') return;

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
        x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } }
      }
    };

    if (this.cpuChartRef) {
      this.cpuChart = new Chart(this.cpuChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.generateTimeLabels(),
          datasets: [{
            label: 'CPU Usage (%)',
            data: this.generateRandomData(20, 0, 100),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: chartOptions
      });
    }

    if (this.memoryChartRef) {
      this.memoryChart = new Chart(this.memoryChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.generateTimeLabels(),
          datasets: [{
            label: 'Memory Usage (%)',
            data: this.generateRandomData(20, 0, 100),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: chartOptions
      });
    }

    if (this.requestsChartRef) {
      this.requestsChart = new Chart(this.requestsChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.generateTimeLabels(),
          datasets: [{
            label: 'Requests/min',
            data: this.generateRandomData(20, 0, 1000),
            backgroundColor: '#8b5cf6'
          }]
        },
        options: chartOptions
      });
    }

    if (this.responseTimeChartRef) {
      this.responseTimeChart = new Chart(this.responseTimeChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.generateTimeLabels(),
          datasets: [{
            label: 'Response Time (ms)',
            data: this.generateRandomData(20, 0, 500),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: chartOptions
      });
    }
  }

  destroyCharts(): void {
    if (this.cpuChart) this.cpuChart.destroy();
    if (this.memoryChart) this.memoryChart.destroy();
    if (this.requestsChart) this.requestsChart.destroy();
    if (this.responseTimeChart) this.responseTimeChart.destroy();
  }

  loadCurrentMetrics(): void {
    this.monitoringService.getCurrentMetrics().subscribe({
      next: (metrics) => this.currentMetrics.set(metrics),
      error: () => this.currentMetrics.set(null)
    });
  }

  loadBuildHistory(): void {
    this.monitoringService.getBuildHistory(10).subscribe({
      next: (history: any[]) => this.buildHistory.set(history),
      error: () => this.buildHistory.set([])
    });
  }

  startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.updateCharts();
      this.loadCurrentMetrics();
    }, 5000);
  }

  updateCharts(): void {
    if (!this.cpuChart) return;

    this.updateChart(this.cpuChart, Math.random() * 100);
    this.updateChart(this.memoryChart, Math.random() * 100);
    this.updateChart(this.requestsChart, Math.random() * 1000);
    this.updateChart(this.responseTimeChart, Math.random() * 500);
  }

  private updateChart(chart: any, newValue: number): void {
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.labels.shift();
    chart.data.datasets[0].data.push(newValue);
    chart.data.datasets[0].data.shift();
    chart.update();
  }

  generateTimeLabels(): string[] {
    const labels = [];
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
      labels.push(new Date(now.getTime() - i * 60000).toLocaleTimeString());
    }
    return labels;
  }

  generateRandomData(count: number, min: number, max: number): number[] {
    return Array.from({ length: count }, () => Math.random() * (max - min) + min);
  }

  onTimeRangeChange(range: string): void {
    this.timeRange.set(range);
    this.destroyCharts();
    setTimeout(() => this.initializeCharts(), 100);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = { 'success': 'success', 'failed': 'error', 'running': 'warning' };
    return colors[status] || 'info';
  }
}
