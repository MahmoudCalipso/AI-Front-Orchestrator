import { Routes } from '@angular/router';

export const AGENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./agent-swarm/agent-swarm.component').then(m => m.AgentSwarmComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./agent-studio/agent-studio.component').then(m => m.AgentStudioComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./agent-swarm/agent-detail/agent-detail.component').then(m => m.AgentDetailComponent)
    },
    {
        path: ':id/chat',
        loadComponent: () => import('./agent-chat/agent-chat-layout.component').then(m => m.AgentChatLayoutComponent)
    }
];
