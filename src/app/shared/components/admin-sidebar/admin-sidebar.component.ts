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
      <!-- Toggle Button -->
      <div class="absolute -right-3 top-6 z-10">
        <button
          (click)="toggleSidebar()"
          class="w-6 h-6 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          [attr.aria-label]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg 
            class="w-3 h-3 text-gray-600 transition-transform duration-300"
            [class.rotate-180]="isCollapsed()"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Logo and Company Section -->
      <div class="px-6 py-8">
        <div class="flex items-center space-x-4">
          <img 
            src="images/ngsi-logo.png" 
            alt="NGSI Logo" 
            class="w-12 h-12 flex-shrink-0"
            [class.w-12]="isCollapsed()"
            [class.w-16]="!isCollapsed()"
            [class.h-12]="isCollapsed()"
            [class.h-16]="!isCollapsed()"
          />
          @if (!isCollapsed()) {
            <div class="transition-opacity duration-300" [class.opacity-0]="isCollapsed()">
              <h1 class="text-2xl font-bold text-dark-text">NGSI</h1>
            </div>
          }
        </div>
        @if (!isCollapsed()) {
          <div class="mt-3 transition-opacity duration-300" [class.opacity-0]="isCollapsed()">
            <p class="text-sm text-gray-600 ml-2">Merchant Onboarding</p>
          </div>
        }
      </div>

      <!-- Navigation Links -->
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <a
            routerLink="/admin/dashboard"
            routerLinkActive="bg-admin-button-bg text-white-text"
            class="nav-link flex items-center text-sm font-medium rounded-lg text-dark-text transition-all duration-200"
            [class]="isCollapsed() ? 'px-3 py-3 justify-center' : 'px-4 py-3'"
            [class.hover-gray]="!isActive('/admin/dashboard')"
            [title]="isCollapsed() ? 'Dashboard' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            @if (!isCollapsed()) {
              <span class="ml-3 transition-opacity duration-300">Dashboard</span>
            }
          </a>

          <a
            routerLink="/admin/settings"
            routerLinkActive="bg-admin-button-bg text-white-text"
            class="nav-link flex items-center text-sm font-medium rounded-lg text-dark-text transition-all duration-200"
            [class]="isCollapsed() ? 'px-3 py-3 justify-center' : 'px-4 py-3'"
            [class.hover-gray]="!isActive('/admin/settings')"
            [title]="isCollapsed() ? 'Settings' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            @if (!isCollapsed()) {
              <span class="ml-3 transition-opacity duration-300">Settings</span>
            }
          </a>
        </div>
      </nav>

      <!-- Logout Section -->
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <button
          (click)="logout()"
          class="w-full flex items-center text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
          [class]="isCollapsed() ? 'px-3 py-3 justify-center' : 'px-4 py-3'"
          [title]="isCollapsed() ? 'Sign Out' : ''"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          @if (!isCollapsed()) {
            <span class="ml-3 transition-opacity duration-300">Sign Out</span>
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Hover effect only for non-active items */
    .hover-gray:hover {
      background-color: rgb(243 244 246); /* gray-100 */
      color: rgb(51 65 85);                /* dark-text */
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

  toggleSidebar() {
    this.sidebarService.toggle()
  }

  logout() {
    this.authService.logout()
  }
}
