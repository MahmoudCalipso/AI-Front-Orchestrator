import { Routes } from '@angular/router';

export const IDE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./ide-layout/ide-layout.component').then(m => m.IdeLayoutComponent)
    }
];
