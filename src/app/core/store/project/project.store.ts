import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ProjectService } from '../../services/api/project.service';
import {
  ProjectResponse,
  ProjectListResponse,
  ProjectCreateRequest
} from '../../models/project/project.model';

export interface ProjectFilters {
  search: string;
  status: string;
  framework: string;
  language: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface ProjectState {
  projects: ProjectResponse[];
  selectedProject: ProjectResponse | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
  pagination: PaginationState;
  buildStatus: 'idle' | 'building' | 'success' | 'failed';
  runStatus: 'idle' | 'running' | 'stopped' | 'error';
  logs: string[];
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    framework: '',
    language: ''
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0
  },
  buildStatus: 'idle',
  runStatus: 'idle',
  logs: []
};

export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, projectService = inject(ProjectService)) => ({
    // Load projects with pagination and filters
    loadProjects: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => {
          const filters = store.filters();
          const pagination = store.pagination();
          return projectService.listProjects({
            search: filters.search || undefined,
            status: filters.status || undefined,
            framework: filters.framework || undefined,
            language: filters.language || undefined,
            page: pagination.page,
            page_size: pagination.pageSize
          }).pipe(
            tapResponse({
              next: (response: ProjectListResponse) => {
                patchState(store, {
                  projects: response.projects,
                  pagination: {
                    ...store.pagination(),
                    total: response.total
                  },
                  loading: false
                });
              },
              error: (error: any) => {
                patchState(store, {
                  error: error.message || 'Failed to load projects',
                  loading: false
                });
              }
            })
          );
        })
      )
    ),

    // Load single project
    loadProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((projectId) => projectService.getProject(projectId).pipe(
          tapResponse({
            next: (project) => {
              patchState(store, {
                selectedProject: project,
                loading: false
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load project',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Create project
    createProject: rxMethod<ProjectCreateRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((request) => projectService.createProject(request).pipe(
          tapResponse({
            next: (project: ProjectResponse) => {
              patchState(store, {
                projects: [project, ...store.projects()],
                selectedProject: project,
                loading: false
              });
            },
            error: (error: Error) => {
              patchState(store, {
                error: error.message || 'Failed to create project',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Delete project
    deleteProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((projectId) => projectService.deleteProject(projectId).pipe(
          tapResponse({
            next: () => {
              patchState(store, (state) => ({
                projects: state.projects.filter(p => p.id !== projectId),
                selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
                loading: false
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to delete project',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Open project
    openProject: rxMethod<{ projectId: string; request?: any }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ projectId, request }) => projectService.openProject(projectId, request).pipe(
          tapResponse({
            next: (result: any) => {
              patchState(store, {
                selectedProject: result.project || store.selectedProject(),
                loading: false
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to open project',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Sync project
    syncProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((projectId) => projectService.syncProject(projectId).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to sync project',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Build project
    buildProject: rxMethod<{ projectId: string; request?: any }>(
      pipe(
        tap(() => patchState(store, { buildStatus: 'building', error: null })),
        switchMap(({ projectId, request }) => projectService.buildProject(projectId, request).pipe(
          tapResponse({
            next: () => {
              patchState(store, { buildStatus: 'success' });
            },
            error: (error: any) => {
              patchState(store, {
                buildStatus: 'failed',
                error: error.message || 'Build failed'
              });
            }
          })
        ))
      )
    ),

    // Run project
    runProject: rxMethod<{ projectId: string; request?: any }>(
      pipe(
        tap(() => patchState(store, { runStatus: 'running', error: null })),
        switchMap(({ projectId, request }) => projectService.runProject(projectId, request).pipe(
          tapResponse({
            next: () => {
              patchState(store, { runStatus: 'running' });
            },
            error: (error: any) => {
              patchState(store, {
                runStatus: 'error',
                error: error.message || 'Failed to run project'
              });
            }
          })
        ))
      )
    ),

    // Stop project
    stopProject: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((projectId) => projectService.stopProject(projectId).pipe(
          tapResponse({
            next: () => {
              patchState(store, { runStatus: 'stopped', loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to stop project',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Get project logs
    loadProjectLogs: rxMethod<{ projectId: string; lines?: number }>(
      pipe(
        switchMap(({ projectId, lines }) => projectService.getProjectLogs(projectId, lines).pipe(
          tapResponse({
            next: (logs) => {
              patchState(store, { logs: logs.lines || [] });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load logs'
              });
            }
          })
        ))
      )
    ),

    // Update filters
    updateFilters: (filters: Partial<ProjectFilters>) => {
      patchState(store, (state) => ({
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, page: 1 }
      }));
    },

    // Update pagination
    updatePagination: (pagination: Partial<PaginationState>) => {
      patchState(store, (state) => ({
        pagination: { ...state.pagination, ...pagination }
      }));
    },

    // Select project
    selectProject: (project: ProjectResponse | null) => {
      patchState(store, { selectedProject: project });
    },

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    },

    // Clear logs
    clearLogs: () => {
      patchState(store, { logs: [] });
    }
  })),
  withComputed((store) => ({
    // Filtered projects (client-side filtering)
    filteredProjects: computed(() => {
      const projects = store.projects();
      const filters = store.filters();

      return projects.filter((project: any) => {
        if (filters.search && !project.name?.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        if (filters.status && project.status !== filters.status) {
          return false;
        }
        if (filters.framework && project.framework !== filters.framework) {
          return false;
        }
        if (filters.language && project.language !== filters.language) {
          return false;
        }
        return true;
      });
    }),

    // Check if has projects
    hasProjects: computed(() => store.projects().length > 0),

    // Get project count
    projectCount: computed(() => store.projects().length),

    // Get selected project ID
    selectedProjectId: computed(() => store.selectedProject()?.id),

    // Check if loading
    isLoading: computed(() => store.loading()),

    // Get current error
    currentError: computed(() => store.error()),

    // Check if project is building
    isBuilding: computed(() => store.buildStatus() === 'building'),

    // Check if project is running
    isRunning: computed(() => store.runStatus() === 'running'),

    // Get total pages
    totalPages: computed(() => {
      const pagination = store.pagination();
      return Math.ceil(pagination.total / pagination.pageSize);
    }),

    // Get unique frameworks for filter dropdown
    availableFrameworks: computed(() => {
      const projects = store.projects();
      const frameworks = new Set(projects.map(p => p.framework).filter(Boolean));
      return Array.from(frameworks).sort();
    }),

    // Get unique languages for filter dropdown
    availableLanguages: computed(() => {
      const projects = store.projects();
      const languages = new Set(projects.map(p => p.language).filter(Boolean));
      return Array.from(languages).sort();
    })
  }))
);
