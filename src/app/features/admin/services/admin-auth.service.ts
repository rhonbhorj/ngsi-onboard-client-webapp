import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdminUser, AdminLoginCredentials, AdminLoginResponse } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private router = inject(Router);

  // Mock admin users
  private readonly mockAdminUsers: AdminUser[] = [
    {
      id: 'admin_001',
      username: 'admin',
      email: 'admin@netpay.com',
      role: 'super_admin',
      firstName: 'NetGlobal',
      lastName: 'Solutions Inc.',
      avatar: 'images/ngsi-logo.png',
      lastLogin: new Date(),
      isActive: true,
      permissions: ['read', 'write', 'delete', 'approve', 'reject']
    },
  ];

  // State signals
  readonly currentUser = signal<AdminUser | null>(null);
  readonly isAuthenticated = signal(false);
  readonly authToken = signal<string | null>(null);

  constructor() {
    // Check for existing session
    this.checkExistingSession();
  }

  login(credentials: AdminLoginCredentials): Observable<AdminLoginResponse> {
  
    const user = this.mockAdminUsers.find(u => 
      u.username === credentials.username && 
      credentials.password === 'admin123' 
    );

    if (user) {
      const token = `mock_token_${Date.now()}`;
      const response: AdminLoginResponse = {
        success: true,
        token,
        user,
        message: 'Login successful'
      };

      // Store authentication data
      this.setAuthData(user, token);
      return of(response).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/admin/login']);
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUser();
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    return user?.permissions.includes(permission) ?? false;
  }

  private setAuthData(user: AdminUser, token: string): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.authToken.set(token);
    
    // Store in localStorage for persistence
    localStorage.setItem('admin_user', JSON.stringify(user));
    localStorage.setItem('admin_token', token);
  }

  private clearAuthData(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.authToken.set(null);
    
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  }

  private checkExistingSession(): void {
    const storedUser = localStorage.getItem('admin_user');
    const storedToken = localStorage.getItem('admin_token');
    
    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.authToken.set(storedToken);
      } catch {
        this.clearAuthData();
      }
    }
  }

  // TODO: Replace with real API calls when backend is ready
  /*
  login(credentials: AdminLoginCredentials): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/admin/login`, credentials);
  }
  */
}
