import { Routes } from '@angular/router';

export const MIGRATION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./migration-wizard/migration-wizard.component').then(m => m.MigrationWizardComponent)
    }
];
