import { Component, signal, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { AdminAuthService } from "../../../features/admin/services/admin-auth.service"
@Component({
  selector: "app-admin-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-header.component.html",
})
export class AdminHeaderComponent {
  private router = inject(Router)
  private authService = inject(AdminAuthService)

  showAdminDropdown = signal(false)

  toggleAdminDropdown() {
    this.showAdminDropdown.update((value) => !value)
  }

  navigateToSettings() {
    this.router.navigate(["/admin/settings"])
    this.showAdminDropdown.set(false)
  }

  navigateToDashboard() {
    this.router.navigate(["/admin/dashboard"])
    this.showAdminDropdown.set(false)
  }

  logout() {
    this.authService.logout()
    this.showAdminDropdown.set(false)
  }
}