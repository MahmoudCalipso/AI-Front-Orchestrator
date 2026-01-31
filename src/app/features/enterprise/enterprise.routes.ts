import { Routes } from '@angular/router';

export const ENTERPRISE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./enterprise-dashboard/enterprise-dashboard.component').then(m => m.EnterpriseDashboardComponent)
    },
    {
        path: 'users',
        loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
    },
    {
        path: 'billing',
        loadComponent: () => import('./billing-management/billing-management.component').then(m => m.BillingManagementComponent)
    },
    {
        path: 'analytics',
        loadComponent: () => import('./analytics-dashboard/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent)
    }
];
