import { Component, inject, signal, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { AdminAuthService } from "../../../features/admin/services/admin-auth.service"
import { SidebarService } from "../../services/sidebar.service"

@Component({
  selector: "app-admin-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div 
      class="fixed inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out"
      [class]="isCollapsed() ? 'w-20' : 'w-64'"
    >

      <!-- Logo and Company Section -->
      <div class="px-6 py-8 transition-all duration-300 ease-in-out">
        <div class="flex items-center space-x-4">
          <img 
            [src]="isCollapsed() ? 'images/ngsi-logo.png' : 'images/ngsi-name-logo.png'" 
            alt="NGSI Logo" 
            class="flex-shrink-0 transition-all duration-300 ease-in-out"
            [class.w-12]="isCollapsed()"
            [class.h-12]="isCollapsed()"
            [class.w-auto]="!isCollapsed()"
            [class.h-12]="!isCollapsed()"
          />
        </div>
        @if (!isCollapsed()) {
          <div class="mt-3 transition-all duration-300 ease-in-out opacity-100">
            <p class="text-sm text-gray-600 ml-2">Merchant Onboarding</p>
          </div>
        } @else {
          <div class="mt-3 transition-all duration-300 ease-in-out opacity-0 h-0 overflow-hidden">
            <p class="text-sm text-gray-600 ml-2">Merchant Onboarding</p>
          </div>
        }
      </div>

      <!-- Navigation Links -->
      <nav class="mt-8 px-4 transition-all duration-300 ease-in-out">
        <div class="space-y-2">
          <a
            routerLink="/admin/dashboard"
            routerLinkActive="bg-admin-button-bg text-white-text"
            class="nav-link flex items-center text-sm font-medium rounded-lg text-dark-text"
            [class]="isCollapsed() ? 'px-3 py-3 justify-center' : 'px-4 py-3'"
            [class.hover-gray]="!isActive('/admin/dashboard')"
            [title]="isCollapsed() ? 'Dashboard' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            @if (!isCollapsed()) {
              <span class="ml-3">Dashboard</span>
            }
          </a>

          <a
            routerLink="/admin/settings"
            routerLinkActive="bg-admin-button-bg text-white-text"
            class="nav-link flex items-center text-sm font-medium rounded-lg text-dark-text"
            [class]="isCollapsed() ? 'px-3 py-3 justify-center' : 'px-4 py-3'"
            [class.hover-gray]="!isActive('/admin/settings')"
            [title]="isCollapsed() ? 'Settings' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            @if (!isCollapsed()) {
              <span class="ml-3">Settings</span>
            }
          </a>
        </div>
      </nav>

      <!-- Logout Section -->
      <div class="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out">
        <button
          (click)="logout()"
          class="w-full flex items-center text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
          [class]="isCollapsed() ? 'px-3 py-3 justify-center' : 'px-4 py-3'"
          [title]="isCollapsed() ? 'Sign Out' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          @if (!isCollapsed()) {
            <span class="ml-3">Sign Out</span>
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hover-gray:hover {
      background-color: rgb(243 244 246); 
      color: rgb(51 65 85);                
    }
  `]
})
export class AdminSidebarComponent {
  private router = inject(Router)
  private authService = inject(AdminAuthService)
  private sidebarService = inject(SidebarService)

  // Sidebar state from service
  isCollapsed = this.sidebarService.isCollapsed

  isActive(route: string): boolean {
    return this.router.url === route
  }

  logout() {
    this.authService.logout()
  }
}
