import { Component, signal, inject, ChangeDetectionStrategy } from "@angular/core"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AdminAuthService } from "../services/admin-auth.service"
import { AdminHeaderComponent } from "../../../shared/components/admin-header/admin-header.component"

@Component({
  selector: "app-admin-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent],
  templateUrl: "./admin-settings.component.html",
  styleUrls: ["./admin-settings.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent {
  private authService = inject(AdminAuthService)
  private router = inject(Router)

  // Settings form signals
  readonly currentPassword = signal("")
  readonly newPassword = signal("")
  readonly confirmPassword = signal("")
  readonly isChangingPassword = signal(false)

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
          alert("Password changed successfully")
          this.resetForm()
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

  private resetForm(): void {
    this.currentPassword.set("")
    this.newPassword.set("")
    this.confirmPassword.set("")
  }
}
