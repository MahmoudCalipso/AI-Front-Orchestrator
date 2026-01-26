import { Routes } from '@angular/router';

export const registryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./registry-management.component').then(m => m.RegistryManagementComponent),
    data: {
      title: 'Registry Management',
      breadcrumb: 'Registry'
    }
  }
];
