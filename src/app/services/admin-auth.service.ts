import { Injectable, computed, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Router } from "@angular/router"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import type { AdminLoginCredentials, AdminLoginResponse, AdminUser } from "../features/admin/models/admin.model"

@Injectable({
  providedIn: "root",
})
export class AdminAuthService {
  private readonly router = inject(Router)
  private readonly http = inject(HttpClient)

  private readonly apiUrl = environment.apiUrl

  readonly currentUser = signal<AdminUser | null>(null)
  readonly authToken = signal<string | null>(null)
  readonly isAuthenticated = computed(() => this.currentUser() !== null && this.authToken() !== null)

  login(credentials: AdminLoginCredentials): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/auth/login`, credentials)
  }

  handleLoginSuccess(response: AdminLoginResponse, username: string): void {
    const user: AdminUser = {
      id: "1",
      username,
    }

    this.setAuthData(user, response.token)
  }

  logout(): void {
    this.clearAuthData()
    this.router.navigate(["/admin/login"])
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUser()
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    const token = this.authToken()
    const headers = { Authorization: `Bearer ${token}` }
    const payload = { currentPassword, newPassword }
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/change-password`, payload, { headers })
  }

  changeUsername(newUsername: string, currentPassword: string): Observable<{ success: boolean; message: string }> {
    const token = this.authToken()
    const headers = { Authorization: `Bearer ${token}` }
    const payload = { newUsername, currentPassword }
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/auth/change-username`, payload, { headers })
  }

  private setAuthData(user: AdminUser, token: string): void {
    this.currentUser.set(user)
    this.authToken.set(token)
  }

  private clearAuthData(): void {
    this.currentUser.set(null)
    this.authToken.set(null)
  }
}
