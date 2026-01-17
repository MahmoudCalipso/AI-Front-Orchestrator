import { Routes } from '@angular/router';

export const GENERATION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./generation-wizard/generation-wizard.component').then(m => m.GenerationWizardComponent)
    }
];
