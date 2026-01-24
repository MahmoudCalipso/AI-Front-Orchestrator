import { Injectable, signal, computed } from '@angular/core';
import { Project, UserInfo } from '../models';

@Injectable({
    providedIn: 'root'
})
export class SignalStoreService {
    // --- Private Signals ---
    private _currentUser = signal<UserInfo | null>(null);
    private _activeProject = signal<Project | null>(null);
    private _sidebarCollapsed = signal<boolean>(false);
    private _isLoading = signal<boolean>(false);
    private _lastError = signal<string | null>(null);
    private _testResults = signal<any[]>([]);

    // --- Public Computed/Readonly ---
    readonly currentUser = this._currentUser.asReadonly();
    readonly activeProject = this._activeProject.asReadonly();
    readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly lastError = this._lastError.asReadonly();
    readonly testResults = this._testResults.asReadonly();

    readonly isAuthenticated = computed(() => !!this._currentUser());
    readonly activeProjectId = computed(() => this._activeProject()?.id || null);

    // --- Actions ---
    setCurrentUser(user: UserInfo | null): void {
        this._currentUser.set(user);
    }

    setActiveProject(project: Project | null): void {
        this._activeProject.set(project);
        if (project) {
            localStorage.setItem('last_active_project_id', project.id);
        }
    }

    toggleSidebar(): void {
        this._sidebarCollapsed.update(state => !state);
    }

    setLoading(state: boolean): void {
        this._isLoading.set(state);
    }

    setError(error: string | null): void {
        this._lastError.set(error);
    }

    clearError(): void {
        this._lastError.set(null);
    }

    setTestResults(results: any[]): void {
        this._testResults.set(results);
    }

    addTestResult(result: any): void {
        this._testResults.update(current => [...current, result]);
    }
}
