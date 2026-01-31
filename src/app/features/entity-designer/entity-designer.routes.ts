import { Routes } from '@angular/router';

export const ENTITY_DESIGNER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/canvas/designer-canvas.component').then(m => m.DesignerCanvasComponent)
    }
];
