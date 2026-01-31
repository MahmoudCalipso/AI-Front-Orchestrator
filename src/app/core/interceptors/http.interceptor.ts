import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { ErrorHandlerService } from '../services/error-handler.service';
import { AuthService } from '../services/api/auth.service';

/**
 * Global HTTP Interceptor
 * Handles authentication headers and centralized error handling
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const errorHandler = inject(ErrorHandlerService);
    const authService = inject(AuthService);

    // Add Auth Token if available
    const token = authService.getToken();
    let authReq = req;

    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                'X-API-Key': environment.apiKey
            }
        });
    } else {
        // Ensure API Key is always present even without token
        authReq = req.clone({
            setHeaders: {
                'X-API-Key': environment.apiKey
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle 401 Unauthorized globally
            if (error.status === 401) {
                authService.logout();
            }

            // Let the service handle specific error logic, but log it here
            return throwError(() => error);
        })
    );
};
