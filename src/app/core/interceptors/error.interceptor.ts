import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Error Interceptor
 * Global error handling for HTTP requests
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized - Please login';
            break;
          case 403:
            errorMessage = 'Forbidden - You don\'t have permission';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 429:
            errorMessage = 'Too many requests - Please try again later';
            break;
          case 500:
            errorMessage = 'Internal server error - Please try again';
            break;
          case 503:
            errorMessage = 'Service unavailable - Please try again later';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
        }
      }
      
      // Log error to console in development
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error
      });
      
      // You can show a toast notification here
      // this.notificationService.showError(errorMessage);
      
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        error: error.error,
        url: req.url
      }));
    })
  );
};
