import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
} from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { User } from '../models/user.model';
import { APP_CONFIG, AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private config = inject(APP_CONFIG);
  private apiUrl = `${this.config.apiUrl}/auth`;

  // Signal for reactive state management
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.tokenService.getUser()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal alternative (Angular 20)
  public isAuthenticated = signal<boolean>(
    !!this.tokenService.getAccessToken()
  );

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.handleAuthResponse(response)),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();

    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        next: () => this.clearAuthData(),
        error: () => this.clearAuthData(),
      });
    } else {
      this.clearAuthData();
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  private handleAuthResponse(response: LoginResponse): void {
    this.tokenService.setTokens(response.accessToken, response.refreshToken);

    const user: User = {
      userId: response.userId,
      email: response.email,
      fullName: response.fullName,
      roles: response.roles,
    };

    this.tokenService.setUser(user);
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
  }
  private clearAuthData(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getAccessToken();
    return !!token && !this.tokenService.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    return this.tokenService.hasRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.tokenService.hasAnyRole(roles);
  }
}
