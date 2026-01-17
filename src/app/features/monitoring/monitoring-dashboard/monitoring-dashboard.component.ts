import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
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

  loading = false;
  currentMetrics: any = null;
  buildHistory: any[] = [];
  updateInterval: any;

  timeRange = '1h';

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
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#9ca3af'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#9ca3af'
          }
        }
      }
    };

    // CPU Chart
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

    // Memory Chart
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

    // Requests Chart
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

    // Response Time Chart
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
      next: (metrics) => {
        this.currentMetrics = metrics;
      },
      error: (error) => {
        console.error('Failed to load metrics', error);
        // Mock data
        this.currentMetrics = {
          cpu_usage: 45,
          memory_usage: 62,
          disk_usage: 38,
          active_requests: 127,
          avg_response_time: 145
        };
      }
    });
  }

  loadBuildHistory(): void {
    this.monitoringService.getBuildHistory(10).subscribe({
      next: (history) => {
        this.buildHistory = history;
      },
      error: (error) => {
        console.error('Failed to load build history', error);
        // Mock data
        this.buildHistory = [
          { id: '1', project: 'api-service', status: 'success', duration: 145, timestamp: new Date().toISOString() },
          { id: '2', project: 'web-app', status: 'success', duration: 230, timestamp: new Date().toISOString() },
          { id: '3', project: 'mobile-api', status: 'failed', duration: 89, timestamp: new Date().toISOString() }
        ];
      }
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

    // Update CPU Chart
    this.cpuChart.data.labels.push(new Date().toLocaleTimeString());
    this.cpuChart.data.labels.shift();
    this.cpuChart.data.datasets[0].data.push(Math.random() * 100);
    this.cpuChart.data.datasets[0].data.shift();
    this.cpuChart.update();

    // Update Memory Chart
    this.memoryChart.data.labels.push(new Date().toLocaleTimeString());
    this.memoryChart.data.labels.shift();
    this.memoryChart.data.datasets[0].data.push(Math.random() * 100);
    this.memoryChart.data.datasets[0].data.shift();
    this.memoryChart.update();

    // Update Requests Chart
    this.requestsChart.data.labels.push(new Date().toLocaleTimeString());
    this.requestsChart.data.labels.shift();
    this.requestsChart.data.datasets[0].data.push(Math.random() * 1000);
    this.requestsChart.data.datasets[0].data.shift();
    this.requestsChart.update();

    // Update Response Time Chart
    this.responseTimeChart.data.labels.push(new Date().toLocaleTimeString());
    this.responseTimeChart.data.labels.shift();
    this.responseTimeChart.data.datasets[0].data.push(Math.random() * 500);
    this.responseTimeChart.data.datasets[0].data.shift();
    this.responseTimeChart.update();
  }

  generateTimeLabels(): string[] {
    const labels = [];
    const now = new Date();
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      labels.push(time.toLocaleTimeString());
    }
    return labels;
  }

  generateRandomData(count: number, min: number, max: number): number[] {
    return Array.from({ length: count }, () => Math.random() * (max - min) + min);
  }

  onTimeRangeChange(range: string): void {
    this.timeRange = range;
    // Reload data for new time range
    this.destroyCharts();
    setTimeout(() => this.initializeCharts(), 100);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'success': 'success',
      'failed': 'error',
      'running': 'warning'
    };
    return colors[status] || 'info';
  }
}
