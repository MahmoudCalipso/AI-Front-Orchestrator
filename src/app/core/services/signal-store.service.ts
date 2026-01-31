import { Injectable, signal, computed } from '@angular/core';
import { Project, UserInfo } from '../models/index';

export interface AppState {
    currentUser: UserInfo | null;
    activeProject: Project | null;
    sidebarCollapsed: boolean;
    isLoading: boolean;
    lastError: string | null;
    testResults: any[];
}

const INITIAL_STATE: AppState = {
    currentUser: null,
    activeProject: null,
    sidebarCollapsed: false,
    isLoading: false,
    lastError: null,
    testResults: []
};

@Injectable({
    providedIn: 'root'
})
export class SignalStoreService {
    // --- Private Signals (Single Source of Truth) ---
    private state = signal<AppState>(INITIAL_STATE);

    // --- Public Computed/Readonly Selectors ---
    readonly currentUser = computed(() => this.state().currentUser);
    readonly activeProject = computed(() => this.state().activeProject);
    readonly sidebarCollapsed = computed(() => this.state().sidebarCollapsed);
    readonly isLoading = computed(() => this.state().isLoading);
    readonly lastError = computed(() => this.state().lastError);
    readonly testResults = computed(() => this.state().testResults);

    // Derived Selectors
    readonly isAuthenticated = computed(() => !!this.state().currentUser);
    readonly activeProjectId = computed(() => this.state().activeProject?.id || null);

    // --- Actions ---
    setCurrentUser(user: UserInfo | null): void {
        this.updateState({ currentUser: user });
    }

    setActiveProject(project: Project | null): void {
        this.updateState({ activeProject: project });
        if (project) {
            localStorage.setItem('last_active_project_id', project.id);
        }
    }

    toggleSidebar(): void {
        this.updateState({ sidebarCollapsed: !this.state().sidebarCollapsed });
    }

    setLoading(isLoading: boolean): void {
        this.updateState({ isLoading });
    }

    setError(error: string | null): void {
        this.updateState({ lastError: error });
    }

    clearError(): void {
        this.updateState({ lastError: null });
    }

    setTestResults(testResults: any[]): void {
        this.updateState({ testResults });
    }

    addTestResult(result: any): void {
        this.updateState({
            testResults: [...this.state().testResults, result]
        });
    }

    resetState(): void {
        this.state.set(INITIAL_STATE);
    }

    // Generic updater for type safety and reduced boilerplate
    private updateState(partialState: Partial<AppState>): void {
        this.state.update(current => ({ ...current, ...partialState }));
    }
}
