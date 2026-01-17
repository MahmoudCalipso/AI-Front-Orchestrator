import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

/**
 * Loading Interceptor
 * Shows/hides loading indicator during HTTP requests
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loading for certain endpoints
  const skipLoading = req.url.includes('/metrics') || 
                      req.url.includes('/health') ||
                      req.url.includes('/status');
  
  if (!skipLoading) {
    loadingService.show();
  }
  
  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.hide();
      }
    })
  );
};
