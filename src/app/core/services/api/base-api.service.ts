import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError, retry, timeout } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * Base API Service
 * Provides common HTTP methods with error handling, retries, and authentication
 */
@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly http = inject(HttpClient);
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
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
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
   * Generic GET request
   */
  protected get<T>(
    path: string,
    params?: { [key: string]: any },
    options?: { headers?: { [key: string]: string }, timeout?: number }
  ): Observable<T> {
    return this.http.get<T>(
      this.buildUrl(path),
      {
        headers: this.getHeaders(options?.headers),
        params: this.buildParams(params)
      }
    ).pipe(
      (timeout(options?.timeout || this.defaultTimeout) as any),
      (retry(environment.retryAttempts) as any),
      catchError(this.handleError)
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
      (timeout(options?.timeout || this.defaultTimeout) as any),
      catchError(this.handleError)
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
      (timeout(options?.timeout || this.defaultTimeout) as any),
      catchError(this.handleError)
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
      (timeout(options?.timeout || this.defaultTimeout) as any),
      catchError(this.handleError)
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
      (timeout(options?.timeout || this.defaultTimeout) as any),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    if (environment.enableLogging) {
      console.error('API Error:', errorMessage, error);
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      error: error.error
    }));
  }
}
