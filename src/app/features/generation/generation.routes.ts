import { Routes } from '@angular/router';

export const GENERATION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./project-generation/project-generation.component').then(m => m.ProjectGenerationComponent)
    }
];
