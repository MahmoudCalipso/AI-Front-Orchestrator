import { Routes } from '@angular/router';

export const TESTING_ROUTES: Routes = [
    {
        path: 'test-generation',
        loadComponent: () => import('./test-generation/test-generation.component').then(m => m.TestGenerationComponent)
    }
];
