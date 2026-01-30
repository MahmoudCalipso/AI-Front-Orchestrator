import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/api/auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';

// State for handling concurrent refreshes
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Auth Interceptor
 * Adds JWT token to requests and handles token refresh with mutex
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Skip auth for auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = authService.getToken();

  // Clone request with token
  const addToken = (request: HttpRequest<unknown>, token: string) => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized - try to refresh token
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          const refreshToken = authService.getRefreshToken();

          if (refreshToken) {
            return authService.refreshToken({ refresh_token: refreshToken }).pipe(
              switchMap((response) => {
                isRefreshing = false;
                const newToken = response.access_token;
                refreshTokenSubject.next(newToken);
                return next(addToken(req, newToken));
              }),
              catchError((refreshError) => {
                isRefreshing = false;
                authService.logout().subscribe();
                return throwError(() => refreshError);
              })
            );
          } else {
            // No refresh token available
            isRefreshing = false;
            authService.logout().subscribe();
          }
        } else {
          // Wait for token refresh
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => next(addToken(req, token!)))
          );
        }
      }

      return throwError(() => error);
    })
  );
};
