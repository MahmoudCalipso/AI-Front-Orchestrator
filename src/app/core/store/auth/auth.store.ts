import { Injectable, inject, computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AuthService } from '../../services/api/auth.service';
import { UserDTO, AdminUser } from '@core/models/admin/admin.model';
import { UserRole, UserStatus } from '@core/models/common/enums';

export interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  permissions: string[];
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: Date | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  permissions: [],
  token: null,
  refreshToken: null,
  tokenExpiry: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    // Login
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((credentials) => authService.login(credentials).pipe(
          tapResponse({
            next: (response) => {
              patchState(store, {
                isAuthenticated: true,
                token: response.access_token,
                refreshToken: response.refresh_token,
                tokenExpiry: new Date(Date.now() + response.expires_in * 1000),
                loading: false
              });
              localStorage.setItem('access_token', response.access_token);
              localStorage.setItem('refresh_token', response.refresh_token);
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Login failed',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Register
    register: rxMethod<{ email: string; password: string; username: string; full_name?: string; tenant_name?: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((data) => authService.register({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          tenant_name: data.tenant_name || `${data.username}'s Team`
        }).pipe(
          tapResponse({
            next: (response) => {
              patchState(store, {
                isAuthenticated: true,
                token: response.access_token,
                refreshToken: response.refresh_token,
                loading: false
              });
              localStorage.setItem('access_token', response.access_token);
              localStorage.setItem('refresh_token', response.refresh_token);
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Registration failed',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Logout
    logout: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => authService.logout().pipe(
          tapResponse({
            next: () => {
              patchState(store, initialState);
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            },
            error: () => {
              // Even if server logout fails, clear local state
              patchState(store, initialState);
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            }
          })
        ))
      )
    ),

    // Load user profile
    loadUserProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => authService.getCurrentUser().pipe(
          tapResponse({
            next: (user) => {
              patchState(store, {
                user: (user as any).user,
                isAuthenticated: true,
                loading: false
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to load user profile',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Refresh token
    refreshToken: rxMethod<void>(
      pipe(
        switchMap(() => {
          const refreshToken = store.refreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          return authService.refreshToken({ refresh_token: refreshToken }).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  token: response.access_token,
                  refreshToken: response.refresh_token,
                  tokenExpiry: new Date(Date.now() + response.expires_in * 1000)
                });
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
              },
              error: (error: any) => {
                patchState(store, {
                  error: error.message || 'Token refresh failed'
                });
              }
            })
          );
        })
      )
    ),

    // Update profile
    updateProfile: rxMethod<Partial<UserDTO>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((data) => authService.updateUserAccount(store.user()!.id, data).pipe(
          tapResponse({
            next: (user: any) => {
              patchState(store, {
                user: { ...(store.user() as any), ...(user as any) },
                loading: false
              });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to update profile',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Change password
    changePassword: rxMethod<{ currentPassword: string; newPassword: string }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((data) => authService.changePassword({
          current_password: data.currentPassword,
          new_password: data.newPassword
        }).pipe(
          tapResponse({
            next: () => {
              patchState(store, { loading: false });
            },
            error: (error: any) => {
              patchState(store, {
                error: error.message || 'Failed to change password',
                loading: false
              });
            }
          })
        ))
      )
    ),

    // Initialize auth from localStorage
    initializeAuth: () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (token) {
        patchState(store, {
          token,
          refreshToken,
          isAuthenticated: true
        });
      }
    },

    // Clear error
    clearError: () => {
      patchState(store, { error: null });
    },

    // Set permissions
    setPermissions: (permissions: string[]) => {
      patchState(store, { permissions });
    }
  })),
  withComputed((store) => ({
    // Check if user is authenticated
    isLoggedIn: computed(() => store.isAuthenticated()),

    // Get user ID
    userId: computed(() => store.user()?.id),

    // Get user email
    userEmail: computed(() => store.user()?.email),

    // Get user name
    userName: computed(() => store.user()?.username),

    // Get user full name
    userFullName: computed(() => store.user()?.full_name),

    // Get user role
    userRole: computed(() => store.user()?.role),

    // Check if user is admin
    isAdmin: computed(() => store.user()?.role === UserRole.ADMIN || store.user()?.role === UserRole.SUPER_ADMIN),

    // Check if user is super admin
    isSuperAdmin: computed(() => store.user()?.role === UserRole.SUPER_ADMIN),

    // Check if user is active
    isActive: computed(() => store.user()?.status === UserStatus.ACTIVE),

    // Get tenant ID
    tenantId: computed(() => store.user()?.tenant_id),

    // Check if has permission
    hasPermission: computed(() => (permission: string) => {
      return store.permissions().includes(permission) || store.user()?.role === UserRole.SUPER_ADMIN;
    }),

    // Check if token is expired
    isTokenExpired: computed(() => {
      const expiry = store.tokenExpiry();
      if (!expiry) return true;
      return new Date() >= expiry;
    }),

    // Get auth headers
    authHeaders: computed(() => {
      const token = store.token();
      return token ? { Authorization: `Bearer ${token}` } : {};
    })
  }))
);
