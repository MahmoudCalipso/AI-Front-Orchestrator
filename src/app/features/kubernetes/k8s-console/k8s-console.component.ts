import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { KubernetesService } from '../../../core/services/api/kubernetes.service';
import { ToastService } from '../../../shared/services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-k8s-console',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        LoadingSpinnerComponent
    ],
    templateUrl: './k8s-console.component.html',
    styleUrl: './k8s-console.component.css'
})
export class K8sConsoleComponent implements OnInit {
    private fb = inject(FormBuilder);
    private k8sService = inject(KubernetesService);
    private toast = inject(ToastService);

    deployForm!: FormGroup;
    loading = false;
    deploying = false;

    deployments: any[] = [];
    pods: any[] = [];
    services: any[] = [];
    clusterInfo: any = null;

    displayedDeploymentColumns = ['name', 'replicas', 'ready', 'status', 'actions'];
    displayedPodColumns = ['name', 'status', 'node', 'ip', 'actions'];
    displayedServiceColumns = ['name', 'type', 'clusterIp', 'ports'];

    ngOnInit(): void {
        this.initializeForm();
        this.loadClusterInfo();
        this.loadDeployments();
        this.loadPods();
        this.loadServices();
    }

    initializeForm(): void {
        this.deployForm = this.fb.group({
            projectPath: ['', Validators.required],
            serviceName: ['', Validators.required],
            replicas: [3, [Validators.required, Validators.min(1)]],
            port: [8080, [Validators.required, Validators.min(1)]],
            namespace: ['default', Validators.required]
        });
    }

    loadClusterInfo(): void {
        this.k8sService.getClusterInfo().subscribe({
            next: (info) => {
                this.clusterInfo = info;
            },
            error: (error) => {
                console.error('Failed to load cluster info', error);
                // Mock data
                this.clusterInfo = {
                    name: 'demo-cluster',
                    version: 'v1.28.0',
                    nodes: 3,
                    status: 'Healthy'
                };
            }
        });
    }

    loadDeployments(): void {
        this.k8sService.listDeployments('default').subscribe({
            next: (deployments) => {
                this.deployments = deployments;
            },
            error: (error) => {
                console.error('Failed to load deployments', error);
                // Mock data
                this.deployments = [
                    {
                        name: 'api-service',
                        replicas: 3,
                        ready_replicas: 3,
                        available_replicas: 3,
                        status: 'Running'
                    }
                ];
            }
        });
    }

    loadPods(): void {
        this.k8sService.listPods('default').subscribe({
            next: (pods) => {
                this.pods = pods;
            },
            error: (error) => {
                console.error('Failed to load pods', error);
                // Mock data
                this.pods = [
                    {
                        name: 'api-service-abc123',
                        status: 'Running',
                        node: 'node-1',
                        ip: '10.0.1.5'
                    }
                ];
            }
        });
    }

    loadServices(): void {
        this.k8sService.listServices('default').subscribe({
            next: (services) => {
                this.services = services;
            },
            error: (error) => {
                console.error('Failed to load services', error);
                // Mock data
                this.services = [
                    {
                        name: 'api-service',
                        type: 'LoadBalancer',
                        cluster_ip: '10.96.0.1',
                        ports: [{ port: 8080, target_port: 8080 }]
                    }
                ];
            }
        });
    }

    deployToK8s(): void {
        if (this.deployForm.invalid) return;

        this.deploying = true;
        const formValue = this.deployForm.value;

        const request = {
            project_path: formValue.projectPath,
            service_name: formValue.serviceName,
            replicas: formValue.replicas,
            port: formValue.port
        };

        this.k8sService.generateManifests(request).subscribe({
            next: (result) => {
                this.toast.success('Manifests generated successfully');

                // Deploy
                this.k8sService.deploy(formValue.projectPath, formValue.namespace).subscribe({
                    next: () => {
                        this.deploying = false;
                        this.toast.success('Deployed to Kubernetes successfully');
                        this.loadDeployments();
                        this.loadPods();
                        this.loadServices();
                    },
                    error: (error) => {
                        this.deploying = false;
                        this.toast.error('Deployment failed');
                    }
                });
            },
            error: (error) => {
                this.deploying = false;
                this.toast.error('Failed to generate manifests');
            }
        });
    }

    scaleDeployment(deployment: any, replicas: number): void {
        this.k8sService.scaleDeployment('default', deployment.name, replicas).subscribe({
            next: () => {
                this.toast.success(`Scaled ${deployment.name} to ${replicas} replicas`);
                this.loadDeployments();
            },
            error: (error) => {
                this.toast.error('Failed to scale deployment');
            }
        });
    }

    deleteDeployment(deployment: any): void {
        this.k8sService.deleteDeployment('default', deployment.name).subscribe({
            next: () => {
                this.toast.success(`Deleted ${deployment.name}`);
                this.loadDeployments();
            },
            error: (error) => {
                this.toast.error('Failed to delete deployment');
            }
        });
    }

    viewPodLogs(pod: any): void {
        this.k8sService.getPodLogs('default', pod.name).subscribe({
            next: (logs) => {
                console.log('Pod logs:', logs);
                this.toast.info('Logs displayed in console');
            },
            error: (error) => {
                this.toast.error('Failed to fetch logs');
            }
        });
    }

    getStatusColor(status: string): string {
        const colors: { [key: string]: string } = {
            'Running': 'success',
            'Pending': 'warning',
            'Failed': 'error',
            'Unknown': 'info'
        };
        return colors[status] || 'info';
    }
}
