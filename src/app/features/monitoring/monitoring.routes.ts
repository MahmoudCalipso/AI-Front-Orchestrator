import { Routes } from '@angular/router';

export const MONITORING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./monitoring-dashboard/monitoring-dashboard.component').then(m => m.MonitoringDashboardComponent)
    }
];
