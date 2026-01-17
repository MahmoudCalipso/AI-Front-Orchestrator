import { Routes } from '@angular/router';

export const KUBERNETES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./k8s-console/k8s-console.component').then(m => m.K8sConsoleComponent)
    }
];
