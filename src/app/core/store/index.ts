/**
 * Core State Management Exports
 * NgRx Signal Stores for AI Orchestrator
 */

// Project Store
export { ProjectStore } from './project/project.store';
export type { ProjectState, ProjectFilters, PaginationState } from './project/project.store';

// Git Store
export { GitStore } from './git/git.store';
export type { GitState } from './git/git.store';

// AI Store
export { AIStore } from './ai/ai.store';
export type { AIState } from './ai/ai.store';

// Monitoring Store
export { MonitoringStore } from './monitoring/monitoring.store';
export type { MonitoringState } from './monitoring/monitoring.store';

// Auth Store
export { AuthStore } from './auth/auth.store';
export type { AuthState } from './auth/auth.store';

// IDE Store
export { IDEStore } from './ide/ide.store';
export type { IDEState, FileNode, OpenFile, TerminalSession } from './ide/ide.store';
