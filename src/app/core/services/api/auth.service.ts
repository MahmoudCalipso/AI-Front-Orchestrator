import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  MeResponse,
  UserInfo,
  TenantInfo,
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  PasswordResetRequest,
  CreateApiKeyRequest,
  ApiKey,
  OAuthConnectResponse,
  ExternalAccount
} from '../../models/auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  private currentTenantSubject = new BehaviorSubject<TenantInfo | null>(null);
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  private externalAccountsSubject = new BehaviorSubject<ExternalAccount[]>([]);

  public currentUser$ = this.currentUserSubject.asObservable();
  public currentTenant$ = this.currentTenantSubject.asObservable();
  public permissions$ = this.permissionsSubject.asObservable();
  public externalAccounts$ = this.externalAccountsSubject.asObservable();

  // Signals for reactive state
  public isAuthenticated = signal(this.hasValidToken());
  public isLoading = signal(false);

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  /**
   * Register a new user
   * POST /auth/register
   */
  register(request: RegisterRequest): Observable<TokenResponse> {
    return this.post<TokenResponse>('/auth/register', request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Login with email and password
   * POST /auth/login
   */
  login(request: LoginRequest): Observable<TokenResponse> {
    return this.post<TokenResponse>('/auth/login', request).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken(request?: RefreshTokenRequest): Observable<TokenResponse> {
    const token = request?.refresh_token || this.getRefreshToken();
    if (!token) {
      return of({} as TokenResponse);
    }

    const payload: RefreshTokenRequest = { refresh_token: token };
    return this.post<TokenResponse>('/auth/refresh', payload).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.handleLogout();
        throw error;
      })
    );
  }

  /**
   * Logout current user
   * POST /auth/logout
   */
  logout(): Observable<{ message: string }> {
    return this.post<{ message: string }>('/auth/logout', {}).pipe(
      tap(() => this.handleLogout())
    );
  }

  /**
   * Get current user information
   * GET /auth/me
   */
  getCurrentUser(): Observable<MeResponse> {
    return this.get<MeResponse>('/auth/me').pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.currentTenantSubject.next(response.tenant);
        this.permissionsSubject.next(response.permissions);
        this.externalAccountsSubject.next(response.external_accounts);
      })
    );
  }

  /**
   * Change password
   * POST /auth/change-password
   */
  changePassword(request: ChangePasswordRequest): Observable<{ message: string }> {
    return this.post<{ message: string }>('/auth/change-password', request);
  }

  /**
   * Accept credentials/terms
   * POST /auth/accept-credentials
   */
  acceptCredentials(): Observable<{ message: string }> {
    return this.post<{ message: string }>('/auth/accept-credentials', {});
  }

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<{ message: string }> {
    return this.post<{ message: string }>('/auth/forgot-password', request);
  }

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword(request: PasswordResetRequest): Observable<{ message: string }> {
    return this.post<{ message: string }>('/auth/reset-password', request);
  }

  // ==================== OAuth External Accounts ====================

  /**
   * Connect external account (GitHub, GitLab, etc.)
   * GET /auth/external/connect/{provider}
   */
  connectExternalAccount(provider: string): Observable<OAuthConnectResponse> {
    return this.get<OAuthConnectResponse>(`/auth/external/connect/${provider}`);
  }

  // ==================== API Keys ====================

  /**
   * Create a new API key
   * POST /auth/api-keys
   */
  createApiKey(request: CreateApiKeyRequest): Observable<ApiKey> {
    return this.post<ApiKey>('/auth/api-keys', request);
  }

  /**
   * List all API keys
   * GET /auth/api-keys
   */
  listApiKeys(): Observable<ApiKey[]> {
    return this.get<ApiKey[]>('/auth/api-keys');
  }

  /**
   * List all users (admin only)
   * GET /auth/users
   */
  listUsers(): Observable<UserInfo[]> {
    return this.get<UserInfo[]>('/auth/users');
  }

  /**
   * Update user details
   * PATCH /auth/users/{user_id}
   */
  updateUser(userId: string, data: Partial<UserInfo>): Observable<UserInfo> {
    return this.patch<UserInfo>(`/auth/users/${userId}`, data);
  }

  /**
   * Delete user (admin only)
   * DELETE /auth/users/{user_id}
   */
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.delete<{ message: string }>(`/auth/users/${userId}`);
  }

  /**
   * Revoke an API key
   * DELETE /auth/api-keys/{key_id}
   */
  revokeApiKey(keyId: string): Observable<{ message: string }> {
    return this.delete<{ message: string }>(`/auth/api-keys/${keyId}`);
  }

  // ==================== Helper Methods ====================

  private handleAuthSuccess(response: TokenResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);

    // Calculate and store expiry time
    const expiryTime = Date.now() + (response.expires_in * 1000);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    this.isAuthenticated.set(true);

    // Fetch user info after successful auth
    this.getCurrentUser().subscribe();
  }

  private handleLogout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    this.currentUserSubject.next(null);
    this.currentTenantSubject.next(null);
    this.permissionsSubject.next([]);
    this.externalAccountsSubject.next([]);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiry) return false;

    return Date.now() < parseInt(expiry, 10);
  }

  isTokenExpiringSoon(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    // Check if token expires in less than 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > (parseInt(expiry, 10) - fiveMinutes);
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSubject.value.includes(permission);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isEnterprise(): boolean {
    return this.hasRole('enterprise') || this.hasRole('admin');
  }
}
