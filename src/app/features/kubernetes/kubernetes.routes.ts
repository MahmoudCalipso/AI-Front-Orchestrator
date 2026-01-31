import { Routes } from '@angular/router';

export const KUBERNETES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./k8s-console/k8s-console.component').then(m => m.K8sConsoleComponent)
    },
    {
        path: 'deployments',
        loadComponent: () => import('./deployment-manager/deployment-manager.component').then(m => m.DeploymentManagerComponent)
    },
    {
        path: 'manifests',
        loadComponent: () => import('./manifest-generator/manifest-generator.component').then(m => m.ManifestGeneratorComponent)
    },
    {
        path: 'helm',
        loadComponent: () => import('./helm-generator/helm-generator.component').then(m => m.HelmGeneratorComponent)
    }
];
