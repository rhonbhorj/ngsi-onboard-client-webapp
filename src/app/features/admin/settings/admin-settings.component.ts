import { Component, signal, inject, ChangeDetectionStrategy } from "@angular/core"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AdminAuthService } from "../services/admin-auth.service"
import { ToastService } from "../../../shared/services/toast.service"
import { AdminSidebarComponent } from "../../../shared/components/admin-sidebar/admin-sidebar.component"
import { AdminHeaderComponent } from "../../../shared/components/admin-header/admin-header.component"
import { SidebarService } from "../../../shared/services/sidebar.service"

@Component({
  selector: "app-admin-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: "./admin-settings.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent {
  authService = inject(AdminAuthService)
  private router = inject(Router)
  private toastService = inject(ToastService)
  private sidebarService = inject(SidebarService)

  // Sidebar state
  isSidebarCollapsed = this.sidebarService.isCollapsed

  // Settings form signals
  readonly currentPassword = signal("")
  readonly newPassword = signal("")
  readonly confirmPassword = signal("")
  readonly isChangingPassword = signal(false)
  
  // Username change signals
  readonly newUsername = signal("")
  readonly usernameCurrentPassword = signal("")
  readonly isChangingUsername = signal(false)

  changePassword(): void {
    if (this.newPassword() !== this.confirmPassword()) {
      alert("New passwords do not match")
      return
    }

    this.isChangingPassword.set(true)
    this.authService.changePassword(this.currentPassword(), this.newPassword()).subscribe({
      next: (response) => {
        this.isChangingPassword.set(false)
        if (response.success) {
          this.toastService.success("Password Changed", "Password changed successfully. You will be logged out for security reasons.")
          this.authService.logout()
        } else {
          alert(response.message || "Failed to change password")
        }
      },
      error: (error) => {
        this.isChangingPassword.set(false)
        console.error("Error changing password:", error)
        alert("Error changing password")
      },
    })
  }

  changeUsername(): void {
    if (!this.newUsername().trim()) {
      alert("Please enter a new username")
      return
    }

    if (this.newUsername().trim() === this.authService.getCurrentUser()?.username) {
      alert("New username must be different from current username")
      return
    }

    this.isChangingUsername.set(true)
    this.authService.changeUsername(this.newUsername().trim(), this.usernameCurrentPassword()).subscribe({
      next: (response) => {
        this.isChangingUsername.set(false)
        if (response.success) {
          this.toastService.success("Username Changed", "Username changed successfully. You will be logged out for security reasons.")
          this.authService.logout()
        } else {
          alert(response.message || "Failed to change username")
        }
      },
      error: (error) => {
        this.isChangingUsername.set(false)
        console.error("Error changing username:", error)
        alert("Error changing username")
      },
    })
  }
}
