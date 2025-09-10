import { Component, inject, signal, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, NavigationEnd } from "@angular/router"
import { filter } from "rxjs/operators"

@Component({
  selector: "app-admin-header",
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Page Title -->
        <div>
          <h1 class="text-2xl font-bold text-dark-text">{{ pageTitle() }}</h1>
        </div>

        <!-- Profile Section -->
        <div class="flex items-center space-x-4">
          <!-- Profile Icon -->
          <div class="w-8 h-8 bg-admin-button-bg rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* No additional styles needed */
  `]
})
export class AdminHeaderComponent implements OnInit {
  private router = inject(Router)
  pageTitle = signal("Dashboard")

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
}
