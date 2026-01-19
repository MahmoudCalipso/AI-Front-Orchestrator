import { Routes } from '@angular/router';

export const ANALYSIS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./code-analysis/code-analysis.component').then(m => m.CodeAnalysisComponent)
    },
    {
        path: 'project',
        loadComponent: () => import('./project-analysis/project-analysis.component').then(m => m.ProjectAnalysisComponent)
    }
];
