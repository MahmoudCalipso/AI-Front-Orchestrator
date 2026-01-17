import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./settings-layout/settings-layout.component').then(m => m.SettingsLayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'security',
                loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'api',
                loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'appearance',
                loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
            }
        ]
    }
];
