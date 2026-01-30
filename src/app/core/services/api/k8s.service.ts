import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { StandardResponse } from '../../models/common/api-response.model';

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
        return this.get<string[]>('/kubernetes/namespaces');
    }

    getResources(namespace: string): Observable<K8sResource[]> {
        return this.get<K8sResource[]>(`/kubernetes/resources/${namespace}`);
    }

    getPodLogs(podName: string, namespace: string = 'default'): Observable<string> {
        return this.get<string>(`/kubernetes/pods/${podName}/logs`, { namespace });
    }

    generateConfig(request: any): Observable<StandardResponse> {
        return this.post<StandardResponse>('/kubernetes/generate', request);
    }
}
