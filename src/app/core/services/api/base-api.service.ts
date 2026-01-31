import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, retry, timeout, timer, of, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { ErrorHandlerService } from '../error-handler.service';
import { CacheService } from '../cache.service';

/**
 * Base API Service
 * Provides common HTTP methods with error handling, retries, and authentication
 */
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly errorHandler = inject(ErrorHandlerService);
  protected readonly cache = inject(CacheService);
  protected readonly baseUrl = environment.apiUrl;
  protected readonly defaultTimeout = environment.defaultTimeout;

  /**
   * Get default headers with API key
   */
  protected getHeaders(additionalHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': environment.apiKey
    });

    if (additionalHeaders) {
      Object.keys(additionalHeaders).forEach(key => {
        headers = headers.set(key, additionalHeaders[key]);
      });
    }

    return headers;
  }

  /**
   * Build URL with path
   */
  protected buildUrl(path: string): string {
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // Prepend /api/v1 if not already present and not a health check
    if (!cleanPath.startsWith('api/v1') && !cleanPath.startsWith('health')) {
      cleanPath = `api/v1/${cleanPath}`;
    }

    return `${this.baseUrl}/${cleanPath}`;
  }

  /**
   * Convert object to HttpParams
   */
  protected buildParams(params?: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return httpParams;
  }

  /**
   * Exponential backoff retry strategy
   */
  protected retryStrategy<T>() {
    return (source: Observable<T>) => source.pipe(
      retry({
        count: environment.retryAttempts,
        delay: (error, retryCount) => {
          // Only retry on network errors or 5xx server errors
          if (error.status === 0 || error.status >= 500) {
            const backoffTime = Math.pow(2, retryCount - 1) * 1000;
            if (environment.enableLogging) {
              console.warn(`[Retry] Attempt ${retryCount} failed. Retrying in ${backoffTime}ms...`, error.message);
            }
            return timer(backoffTime);
          }
          return throwError(() => error);
        }
      })
    );
  }

  /**
   * Generic GET request with caching
   */
  protected get<T>(
    path: string,
    params?: { [key: string]: any },
    options?: { headers?: { [key: string]: string }, timeout?: number, useCache?: boolean, ttl?: number }
  ): Observable<T> {
    const url = this.buildUrl(path);
    const cacheKey = this.cache.generateKey(url, params);

    if (options?.useCache) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) return of(cachedData);
    }

    return this.http.get<T>(
      url,
      {
        headers: this.getHeaders(options?.headers),
        params: this.buildParams(params)
      }
    ).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      this.retryStrategy(),
      tap(data => {
        if (options?.useCache) {
          this.cache.set(cacheKey, data, options.ttl);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Generic POST request
   */
  protected post<T>(
    path: string,
    body: any,
    options?: { headers?: { [key: string]: string }, timeout?: number }
  ): Observable<T> {
    return this.http.post<T>(
      this.buildUrl(path),
      body,
      {
        headers: this.getHeaders(options?.headers)
      }
    ).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Generic PUT request
   */
  protected put<T>(
    path: string,
    body: any,
    options?: { headers?: { [key: string]: string }, timeout?: number }
  ): Observable<T> {
    return this.http.put<T>(
      this.buildUrl(path),
      body,
      {
        headers: this.getHeaders(options?.headers)
      }
    ).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Generic PATCH request
   */
  protected patch<T>(
    path: string,
    body: any,
    options?: { headers?: { [key: string]: string }, timeout?: number }
  ): Observable<T> {
    return this.http.patch<T>(
      this.buildUrl(path),
      body,
      {
        headers: this.getHeaders(options?.headers)
      }
    ).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Generic DELETE request
   */
  protected delete<T>(
    path: string,
    params?: { [key: string]: any },
    options?: { headers?: { [key: string]: string }, timeout?: number }
  ): Observable<T> {
    return this.http.delete<T>(
      this.buildUrl(path),
      {
        headers: this.getHeaders(options?.headers),
        params: this.buildParams(params)
      }
    ).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Handle HTTP errors
   */
  protected handleError(error: any): Observable<never> {
    this.errorHandler.handleError(error);
    return throwError(() => error);
  }
}


