import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { GitService } from '../../services/api/git.service';
import {
  GitStatus,
  GitBranchesResponse,
  GitHistoryResponse,
  GitDiffResponse,
  GitRepoInit,
  GitCloneRequest,
  GitCommitRequest,
  GitBranchCreate,
  GitMergeRequest,
  GitRemoteCreate,
  GitConflictResolve
} from '../../models/git/git.model';

export interface GitState {
  repositories: any[];
  selectedRepo: any | null;
  status: GitStatus | null;
  branches: GitBranchesResponse | null;
  history: GitHistoryResponse | null;
  diff: GitDiffResponse | null;
  loading: boolean;
  error: string | null;
  currentBranch: string | null;
  conflicts: any[];
  operationInProgress: 'clone' | 'commit' | 'push' | 'pull' | 'merge' | 'checkout' | null;
}

const initialState: GitState = {
  repositories: [],
  selectedRepo: null,
  status: null,
  branches: null,
  history: null,
  diff: null,
  loading: false,
  error: null,
  currentBranch: null,
  conflicts: [],
  operationInProgress: null
};

export const GitStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, gitService = inject(GitService)) => ({
    // Initialize repository
    initRepository: rxMethod<GitRepoInit>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((request) => gitService.initRepository(request).pipe(
          tapResponse({
            next: (repo) => {
              patchState(store, (state) => ({
                repositories: [...state.repositories, repo],
                selectedRepo: repo,
                loading: false
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to initialize repository',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Clone repository
    cloneRepository: rxMethod<GitCloneRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'clone' })),
        switchMap((request) => gitService.cloneRepository(request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, (state) => ({
                repositories: [...state.repositories, result],
                selectedRepo: result,
                loading: false,
                operationInProgress: null
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to clone repository',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Push changes
    pushChanges: rxMethod<{ repoId: string; request: GitCommitRequest }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'push' })),
        switchMap(({ repoId, request }) => gitService.pushRepository(repoId, request).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false, operationInProgress: null });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to push changes',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Pull changes
    pullChanges: rxMethod<{ repoId: string; localPath: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'pull' })),
        switchMap(({ repoId, localPath }) => gitService.pullRepository(repoId, localPath).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                loading: false,
                operationInProgress: null,
                conflicts: result.conflicts || []
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to pull changes',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Get repository status
    loadStatus: rxMethod<{ repoId: string; localPath: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, localPath }) => gitService.getRepositoryStatus(repoId, localPath).pipe(
          tapResponse({
            next: (status) => {
              patchState(store, {
                status,
                currentBranch: status.branch,
                loading: false
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to get status',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // List branches
    loadBranches: rxMethod<{ repoId: string; localPath: string; params?: { page?: number; page_size?: number } }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, localPath, params }) => gitService.listBranches(repoId, localPath, params).pipe(
          tapResponse({
            next: (branches) => {
              patchState(store, { branches, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load branches',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Checkout branch
    checkoutBranch: rxMethod<{ repoId: string; request: GitBranchCreate }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'checkout' })),
        switchMap(({ repoId, request }) => gitService.checkoutBranch(repoId, request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                currentBranch: result.branch,
                loading: false,
                operationInProgress: null
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to checkout branch',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Get commit history
    loadHistory: rxMethod<{ repoId: string; localPath: string; limit?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, localPath, limit }) => gitService.getHistory(repoId, localPath, limit).pipe(
          tapResponse({
            next: (history) => {
              patchState(store, { history, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load history',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Get diff
    loadDiff: rxMethod<{ repoId: string; localPath: string; cached?: boolean }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, localPath, cached }) => gitService.getDiff(repoId, localPath, cached).pipe(
          tapResponse({
            next: (diff) => {
              patchState(store, { diff, loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load diff',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Fetch from remote
    fetchRepository: rxMethod<{ repoId: string; localPath: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, localPath }) => gitService.fetchRepository(repoId, localPath).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to fetch',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Merge branches
    mergeBranches: rxMethod<{ repoId: string; request: GitMergeRequest }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, operationInProgress: 'merge' })),
        switchMap(({ repoId, request }) => gitService.mergeBranches(repoId, request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, {
                loading: false,
                operationInProgress: null,
                conflicts: result.conflicts || []
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to merge branches',
                loading: false,
                operationInProgress: null
              });
            }
          })
        ))
      )
    ),

    // Create remote repository
    createRemote: rxMethod<{ repoId: string; request: GitRemoteCreate }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, request }) => gitService.createRemoteRepository(repoId, request).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to create remote',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Resolve conflict with AI
    resolveConflictAI: rxMethod<{ repoId: string; request: GitConflictResolve }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ repoId, request }) => gitService.resolveConflictAI(repoId, request).pipe(
          tapResponse({
            next: (result) => {
              patchState(store, (state) => ({
                loading: false,
                conflicts: state.conflicts.filter(c => c.file !== request.file_path)
              }));
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to resolve conflict',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Select repository
    selectRepo: (repo: any | null) => {
      patchState(store, { selectedRepo: repo });
    },

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    },

    // Clear conflicts
    clearConflicts: () => {
      patchState(store, { conflicts: [] });
    }
  })),
  withComputed((store) => ({
    // Check if has repositories
    hasRepositories: computed(() => store.repositories().length > 0),

    // Get repository count
    repositoryCount: computed(() => store.repositories().length),

    // Check if has changes
    hasChanges: computed(() => {
      const status = store.status();
      return status ? (status.staged.length > 0 || status.unstaged.length > 0 || status.untracked.length > 0) : false;
    }),

    // Get changed files count
    changedFilesCount: computed(() => {
      const status = store.status();
      return status ? (status.staged.length + status.unstaged.length + status.untracked.length) : 0;
    }),

    // Get branch count
    branchCount: computed(() => {
      const branches = store.branches();
      return branches ? branches.branches.length : 0;
    }),

    // Get commit count
    commitCount: computed(() => {
      const history = store.history();
      return history ? history.commits.length : 0;
    }),

    // Check if operation is in progress
    isOperating: computed(() => store.operationInProgress() !== null),

    // Check if has conflicts
    hasConflicts: computed(() => store.conflicts().length > 0),

    // Get local branches
    localBranches: computed(() => {
      const branches = store.branches();
      return branches ? branches.branches.filter(b => !b.remote) : [];
    }),

    // Get remote branches
    remoteBranches: computed(() => {
      const branches = store.branches();
      return branches ? branches.branches.filter(b => b.remote) : [];
    })
  }))
);
