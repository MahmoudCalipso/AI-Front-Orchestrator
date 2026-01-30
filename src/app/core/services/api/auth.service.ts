import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, tap, catchError, of, timer, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
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
  private refreshTokenTimeout?: any;

  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register(request: RegisterRequest): Observable<TokenResponse> {
    return this.post<BaseResponse<TokenResponse>>('auth/register', request).pipe(
      map(res => res.data),
      tap(data => this.handleAuthSuccess(data))
    );
  }

  /**
   * Login with email and password
   * POST /api/v1/auth/login
   */
  login(request: LoginRequest): Observable<TokenResponse> {
    return this.post<BaseResponse<TokenResponse>>('auth/login', request).pipe(
      map(res => res.data),
      tap(data => this.handleAuthSuccess(data))
    );
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refreshToken(request?: RefreshTokenRequest): Observable<TokenResponse> {
    const token = request?.refresh_token || this.getRefreshToken();
    if (!token) {
      return of({} as TokenResponse);
    }

    const payload: RefreshTokenRequest = { refresh_token: token };
    return this.post<BaseResponse<TokenResponse>>('auth/refresh', payload).pipe(
      map(res => res.data),
      tap(data => this.handleAuthSuccess(data)),
      catchError(error => {
        this.handleLogout();
        throw error;
      })
    );
  }

  /**
   * Logout current user
   * POST /api/v1/auth/logout
   */
  logout(): Observable<BaseResponse> {
    return this.post<BaseResponse>('auth/logout', {}).pipe(
      tap(() => this.handleLogout())
    );
  }

  /**
   * Get current user information
   * GET /api/v1/auth/me
   */
  getCurrentUser(): Observable<MeResponse> {
    return this.get<BaseResponse<MeResponse>>('auth/me').pipe(
      map(res => res.data),
      tap(data => {
        if (data) {
          this.currentUserSubject.next(data.user);
          this.currentTenantSubject.next(data.tenant);
          this.permissionsSubject.next(data.permissions);
          this.externalAccountsSubject.next(data.external_accounts);
        }
      })
    );
  }

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword(request: ChangePasswordRequest): Observable<BaseResponse> {
    return this.post<BaseResponse>('auth/change-password', request);
  }

  /**
   * Accept credentials/terms
   * POST /api/v1/auth/accept-credentials
   */
  acceptCredentials(): Observable<BaseResponse> {
    return this.post<BaseResponse>('auth/accept-credentials', {});
  }

  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<BaseResponse> {
    return this.post<BaseResponse>('auth/forgot-password', request);
  }

  /**
   * Reset password with token
   * POST /api/v1/auth/reset-password
   */
  resetPassword(request: PasswordResetRequest): Observable<BaseResponse> {
    return this.post<BaseResponse>('auth/reset-password', request);
  }

  // ==================== OAuth External Accounts ====================

  /**
   * Connect external account (GitHub, GitLab, etc.)
   * GET /api/v1/auth/external/connect/{provider}
   */
  connectExternalAccount(provider: string): Observable<OAuthConnectResponse> {
    // Note: This endpoint might return a redirect or a JSON with auth_url.
    // Based on openapi: BaseResponse, but generic 'schema'. Assuming Dict/Any or specific DTO.
    // Let's assume it returns { auth_url: string, state: string } in data.
    return this.get<BaseResponse<OAuthConnectResponse>>(`auth/external/connect/${provider}`).pipe(
      map(res => res.data)
    );
  }

  // ==================== API Keys ====================

  /**
   * Create a new API key
   * POST /api/v1/auth/api-keys
   */
  createApiKey(request: CreateApiKeyRequest): Observable<ApiKey> {
    return this.post<BaseResponse<ApiKey>>('auth/api-keys', request).pipe(
      map(res => res.data)
    );
  }

  /**
   * List all API keys
   * GET /api/v1/auth/api-keys
   */
  listApiKeys(): Observable<ApiKey[]> {
    return this.get<BaseResponse<ApiKey[]>>('auth/api-keys').pipe(
      map(res => res.data)
    );
  }

  /**
   * List all users (admin only)
   * GET /api/v1/admin/users  (Note via openapi: /api/v1/admin/users)
   * But auth.service had /auth/users before. Checking openapi.json: /api/v1/admin/users
   */
  listUsers(): Observable<UserInfo[]> {
    return this.get<BaseResponse<UserInfo[]>>('admin/users').pipe(
      map(res => res.data)
    );
  }

  /**
   * Update user details (Admin)
   * PUT /api/v1/admin/users/{user_id}/role or similar?
   * Old code had PATCH /auth/users/{userId}.
   * OpenAPI has PUT /api/v1/admin/users/{user_id}/role
   * It doesn't seem to have a generic update user endpoint in Auth, only in Admin for role.
   * I'll leave it as is but commented or best-effort for now, perhaps mapped to admin endpoint.
   */
  updateUserRole(userId: string, role: string): Observable<any> {
    return this.put<BaseResponse>(`admin/users/${userId}/role`, { role });
  }

  /**
   * Delete user (admin only)
   * DELETE /api/v1/enterprise/users/{user_id} or /api/v1/admin/users (not found?)
   * OpenAPI: DELETE /api/v1/enterprise/users/{user_id} (Remove Organization User)
   * There is no generic delete user in Auth.
   */
  deleteUser(userId: string): Observable<BaseResponse> {
    // Using enterprise endpoint as fallback
    return this.delete<BaseResponse>(`enterprise/users/${userId}`);
  }

  /**
   * Revoke an API key
   * DELETE /api/v1/auth/api-keys/{key_id}
   */
  revokeApiKey(keyId: string): Observable<BaseResponse> {
    return this.delete<BaseResponse>(`auth/api-keys/${keyId}`);
  }

  // ==================== Helper Methods ====================

  private handleAuthSuccess(response: TokenResponse): void {
    if (!response) return;

    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);

    // Calculate and store expiry time
    const expiryTime = Date.now() + (response.expires_in * 1000);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

    this.isAuthenticated.set(true);

    // Schedule refresh
    this.scheduleTokenRefresh(response.expires_in);

    // Fetch user info after successful auth
    this.getCurrentUser().subscribe();
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    // Refresh token 1 minute before expiration
    const refreshTime = (expiresIn - 60) * 1000;

    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    if (refreshTime > 0) {
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshTime);
    }
  }

  private handleLogout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

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
