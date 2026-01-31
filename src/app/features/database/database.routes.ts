import { Routes } from '@angular/router';

export const DATABASE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./database-explorer/database-explorer.component').then(m => m.DatabaseExplorerComponent)
    },
    {
        path: 'connections',
        loadComponent: () => import('./connection-manager/connection-manager.component').then(m => m.ConnectionManagerComponent)
    },
    {
        path: ':connectionId/schema',
        loadComponent: () => import('./schema-browser/schema-browser.component').then(m => m.SchemaBrowserComponent)
    },
    {
        path: ':connectionId/query',
        loadComponent: () => import('./sql-runner/sql-runner.component').then(m => m.SqlRunnerComponent)
    }
];
