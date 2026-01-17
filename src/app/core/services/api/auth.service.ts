import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserInfo,
  RefreshTokenRequest,
  LogoutRequest,
  ChangePasswordRequest,
  CreateApiKeyRequest,
  ApiKey,
  SessionInfo
} from '../../models/auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/v1/auth/register', request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/v1/auth/login', request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/api/v1/auth/refresh', request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(request?: LogoutRequest): Observable<void> {
    return this.post<void>('/api/v1/auth/logout', request || {}).pipe(
      tap(() => this.handleLogout())
    );
  }

  getCurrentUser(): Observable<UserInfo> {
    return this.get<UserInfo>('/api/v1/auth/me').pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.post<void>('/api/v1/auth/change-password', request);
  }

  createApiKey(request: CreateApiKeyRequest): Observable<ApiKey> {
    return this.post<ApiKey>('/api/v1/auth/api-keys', request);
  }

  listApiKeys(): Observable<ApiKey[]> {
    return this.get<ApiKey[]>('/api/v1/auth/api-keys');
  }

  revokeApiKey(keyId: string): Observable<void> {
    return this.delete<void>(`/api/v1/auth/api-keys/${keyId}`);
  }

  listSessions(): Observable<SessionInfo[]> {
    return this.get<SessionInfo[]>('/api/v1/auth/sessions');
  }

  revokeSession(sessionId: string): Observable<void> {
    return this.delete<void>(`/api/v1/auth/sessions/${sessionId}`);
  }

  // Helper methods
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.access_token);
    localStorage.setItem(this.refreshTokenKey, response.refresh_token);
    this.currentUserSubject.next(response.user);
  }

  private handleLogout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
