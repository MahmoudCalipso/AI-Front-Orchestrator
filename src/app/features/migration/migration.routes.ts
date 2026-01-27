import { Routes } from '@angular/router';

export const MIGRATION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./project-migration/project-migration.component').then(m => m.ProjectMigrationComponent)
    }
];
