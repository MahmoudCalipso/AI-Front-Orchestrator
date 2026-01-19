import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface K8sResource {
    name: string;
    status: 'Running' | 'Pending' | 'Failed' | 'Succeeded' | 'Ready' | 'NotReady';
    type: 'Pod' | 'Service' | 'Deployment' | 'Namespace';
    namespace: string;
    age: string;
}

@Injectable({
    providedIn: 'root'
})
export class K8sService extends BaseApiService {

    getNamespaces(): Observable<string[]> {
        // return this.get<string[]>('/k8s/namespaces');
        return of(['default', 'kube-system', 'monitoring', 'active-projects']);
    }

    getResources(namespace: string): Observable<K8sResource[]> {
        // return this.get<K8sResource[]>(`/k8s/resources/${namespace}`);
        // Mock data for Phase 6 entry
        return of([
            { name: 'api-server-v1', status: 'Running', type: 'Pod', namespace, age: '2d' },
            { name: 'worker-node-1', status: 'Running', type: 'Pod', namespace, age: '5h' },
            { name: 'db-stack-primary', status: 'Pending', type: 'Deployment', namespace, age: '10m' },
            { name: 'load-balancer', status: 'Ready', type: 'Service', namespace, age: '14d' }
        ]);
    }

    getPodLogs(podName: string): Observable<string> {
        return of(`[LOG] Initializing ${podName}...\n[LOG] Connection established.\n[LOG] Heartbeat OK.`);
    }
}
