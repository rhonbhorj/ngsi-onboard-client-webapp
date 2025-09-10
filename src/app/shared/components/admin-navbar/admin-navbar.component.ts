import { Component, inject, signal, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { AdminAuthService } from "../../../features/admin/services/admin-auth.service"

@Component({
  selector: "app-admin-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Top Navbar -->
    <nav class="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-6">
        <div class="flex items-center justify-between">
          <!-- Left Side: Logo + Website Name (Clickable) -->
          <div class="flex items-center space-x-3">
            <a 
              routerLink="/admin/dashboard" 
              class="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              <img src="images/ngsi-logo.png" alt="NGSI Logo" class="w-8 h-8" />
              <span class="text-xl font-bold text-dark-text">Merchant Onboarding</span>
            </a>
          </div>

          <!-- Right Side: Company Name with Dropdown -->
          <div class="relative">
            <button
              (click)="toggleDropdown()"
              class="flex items-center space-x-2 px-4 py-2 text-base font-medium text-dark-text hover:bg-gray-100 rounded-full border border-gray-200 transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>NGSI - Admin</span>
              <svg 
                class="w-4 h-4 transition-transform duration-200" 
                [class.rotate-180]="showDropdown()"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div 
              *ngIf="showDropdown()"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
            >
              <!-- Settings -->
              <a
                routerLink="/admin/settings"
                (click)="closeDropdown()"
                class="flex items-center px-4 py-2 text-sm text-dark-text hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </a>

              <!-- Divider -->
              <div class="border-t border-gray-200 my-1"></div>

              <!-- Logout -->
              <button
                (click)="logout()"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class AdminNavbarComponent {
  private router = inject(Router)
  private authService = inject(AdminAuthService)

  showDropdown = signal(false)

  toggleDropdown() {
    this.showDropdown.update(show => !show)
  }

  closeDropdown() {
    this.showDropdown.set(false)
  }

  logout() {
    this.authService.logout()
    this.closeDropdown()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      this.closeDropdown()
    }
  }
}
