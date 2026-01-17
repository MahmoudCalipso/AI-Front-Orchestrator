import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/api/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

/**
 * Auth Interceptor
 * Adds JWT token to requests and handles token refresh
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth for auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = authService.getToken();
  
  // Clone request with token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // Handle 401 Unauthorized - try to refresh token
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          return authService.refreshToken({ refresh_token: refreshToken }).pipe(
            switchMap(() => {
              // Retry request with new token
              const newToken = authService.getToken();
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError(refreshError => {
              // Refresh failed, logout user
              authService.logout().subscribe();
              return throwError(() => refreshError);
            })
          );
        }
      }
      
      return throwError(() => error);
    })
  );
};
