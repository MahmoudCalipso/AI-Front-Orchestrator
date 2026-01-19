import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'ide', 
    loadChildren: () => import('./features/ide/ide.routes').then(m => m.IDE_ROUTES) 
  },
  { 
    path: 'generate', 
    loadChildren: () => import('./features/generation/generation.routes').then(m => m.GENERATION_ROUTES) 
  },
  { 
    path: 'migrate', 
    loadChildren: () => import('./features/migration/migration.routes').then(m => m.MIGRATION_ROUTES) 
  },
  { 
    path: 'analyze', 
    loadChildren: () => import('./features/analysis/analysis.routes').then(m => m.ANALYSIS_ROUTES) 
  },
  { 
    path: 'kubernetes', 
    loadChildren: () => import('./features/kubernetes/kubernetes.routes').then(m => m.KUBERNETES_ROUTES) 
  },
  { 
    path: 'monitoring', 
    loadChildren: () => import('./features/monitoring/monitoring.routes').then(m => m.MONITORING_ROUTES) 
  },
  { 
    path: 'storage', 
    loadChildren: () => import('./features/storage/storage.routes').then(m => m.STORAGE_ROUTES) 
  },
  { 
    path: 'settings', 
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES) 
  },
  { path: '**', redirectTo: 'dashboard' }
];
