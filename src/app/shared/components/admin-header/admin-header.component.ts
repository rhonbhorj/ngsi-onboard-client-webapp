import { Component, inject, signal, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, NavigationEnd } from "@angular/router"
import { filter } from "rxjs/operators"
import { SidebarService } from "../../services/sidebar.service"

@Component({
  selector: "app-admin-header",
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left Section: Toggle Button + Page Title -->
        <div class="flex items-center space-x-4">
          <!-- Hamburger Menu Toggle Button -->
          <button
            (click)="toggleSidebar()"
            class="w-10 h-10 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            [attr.aria-label]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          >
            <svg 
              class="w-5 h-5 text-gray-700 transition-all duration-300 ease-in-out"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <!-- Page Title -->
          <h1 class="text-2xl font-bold text-dark-text transition-none">{{ pageTitle() }}</h1>
        </div>
      </div>
    </header>
  `,

})
export class AdminHeaderComponent implements OnInit {
  private router = inject(Router)
  private sidebarService = inject(SidebarService)
  
  pageTitle = signal("Dashboard")
  isCollapsed = this.sidebarService.isCollapsed

  ngOnInit() {
    // Set initial title
    this.updatePageTitle()
    
    // Listen for route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle()
      })
  }

  private updatePageTitle() {
    const url = this.router.url
    if (url.includes('/admin/dashboard')) {
      this.pageTitle.set('Dashboard')
    } else if (url.includes('/admin/settings')) {
      this.pageTitle.set('Settings')
    } else {
      this.pageTitle.set('Admin')
    }
  }

  toggleSidebar() {
    this.sidebarService.toggle()
  }
}
