import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./settings-layout/settings-layout.component').then(m => m.SettingsLayoutComponent)
    }
];
