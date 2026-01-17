import { Routes } from '@angular/router';

export const STORAGE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./project-list/project-list.component').then(m => m.ProjectListComponent)
    }
];
