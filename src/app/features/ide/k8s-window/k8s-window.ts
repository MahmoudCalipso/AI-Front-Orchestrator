import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { K8sService, K8sResource } from '../../../core/services/api/k8s.service';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-k8s-window',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatListModule, MatDividerModule, MatSelectModule, MatProgressSpinnerModule, FormsModule, StatusColorPipe],
  templateUrl: './k8s-window.html',
  styleUrl: './k8s-window.scss'
})
export class K8sWindowComponent implements OnInit {
  private k8sService = inject(K8sService);

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
    this.k8sService.getResources(this.selectedNamespace).subscribe(res => {
      this.resources = res;
      this.isLoading = false;
    });
  }


}
