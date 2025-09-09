import { Component, signal, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

@Component({
  selector: "app-admin-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-header.component.html",
  styleUrl: "./admin-header.component.css",
})
export class AdminHeaderComponent {
  private router = inject(Router)

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
    localStorage.removeItem("adminToken")
    this.router.navigate(["/admin/login"])
    this.showAdminDropdown.set(false)
  }
}
