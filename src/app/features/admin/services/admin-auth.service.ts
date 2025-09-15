import { Injectable, inject, signal } from "@angular/core"
import { Router } from "@angular/router"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { AdminUser, AdminLoginCredentials, AdminLoginResponse } from "../models/admin.model"
import { environment } from "../../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AdminAuthService {
  private router = inject(Router)
  private http = inject(HttpClient)

  private apiUrl = environment.apiUrl 

  // State signals
  readonly currentUser = signal<AdminUser | null>(null)
  readonly isAuthenticated = signal(false)
  readonly authToken = signal<string | null>(null)

  constructor() {
    this.checkExistingSession()
  }

  // Call backend instead of mock
  login(credentials: AdminLoginCredentials): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/auth/login`, credentials)
  }

  handleLoginSuccess(response: AdminLoginResponse, username: string): void {
    const user: AdminUser = {
      id: "1", // Backend will provide this
      username: username,
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
    this.isAuthenticated.set(true)
    this.authToken.set(token)

    localStorage.setItem("user_accounts", JSON.stringify(user))
    localStorage.setItem("admin_token", token)
  }

  private clearAuthData(): void {
    this.currentUser.set(null)
    this.isAuthenticated.set(false)
    this.authToken.set(null)

    localStorage.removeItem("user_accounts")
    localStorage.removeItem("admin_token")
  }

  private checkExistingSession(): void {
    const storedUser = localStorage.getItem("user_accounts")
    const storedToken = localStorage.getItem("admin_token")

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser)
        this.currentUser.set(user)
        this.isAuthenticated.set(true)
        this.authToken.set(storedToken)
      } catch {
        this.clearAuthData()
      }
    }
  }
}
