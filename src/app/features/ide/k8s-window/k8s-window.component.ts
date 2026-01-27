import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { KubernetesService } from '../../../core/services/api/kubernetes.service';
import { K8sResource, K8sService } from '../../../core/services/api/k8s.service';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-k8s-window',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    StatusColorPipe
  ],
  templateUrl: './k8s-window.html',
  styleUrl: './k8s-window.scss'
})
export class K8sWindowComponent implements OnInit {
  private k8sService = inject(K8sService); // Use K8sService for logs
  private toast = inject(ToastService);

  namespaces: string[] = [];
  selectedNamespace: string = 'default';
  resources: K8sResource[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.k8sService.getNamespaces().subscribe(ns => {
      this.namespaces = ns;
      this.loadResources();
    });
  }

  loadResources(): void {
    this.isLoading = true;
    this.k8sService.getResources(this.selectedNamespace).subscribe({
      next: (res) => {
        this.resources = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toast.error('Failed to load resources');
      }
    });
  }

  viewLogs(podName: string): void {
    this.toast.info(`Fetching logs for ${podName}...`);
    this.k8sService.getPodLogs(podName, this.selectedNamespace).subscribe({
      next: (logs) => {
        // In a real app, open a modal. For now, we'll just show success/content summary or use a simple alert/modal substitute if available.
        // Assuming we want to show it in the UI, we could add a simple overlay or expand item.
        // For simplicity/robustness in this "Action Audit", let's dump to console and notify.
        console.log('LOGS:', logs);
        this.toast.success('Logs retrieved (check console)');
      },
      error: (err) => this.toast.error('Failed to fetch logs')
    });
  }


}
