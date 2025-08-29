import { Component, signal, inject, type OnInit, ChangeDetectionStrategy, type WritableSignal } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AdminAuthService } from "../services/admin-auth.service"
import { AdminDashboardService } from "../services/admin-dashboard.service"
import type { MerchantApplication } from "../../../services/application.service"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AdminAuthService)
  private dashboardService = inject(AdminDashboardService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  // Dashboard data
  readonly allApplications = signal<MerchantApplication[]>([])
  readonly filteredApplications = signal<MerchantApplication[]>([])
  readonly isLoading = signal(false)
  readonly searchTerm: WritableSignal<string> = signal("")

  readonly currentPage = signal(1)
  readonly totalPages = signal(0)
  readonly totalCount = signal(0)
  readonly goToPage = signal("")

  ngOnInit() {
    this.checkAuth()
    this.route.params.subscribe((params) => {
      const page = params["page"] ? Number.parseInt(params["page"], 10) : 1
      this.loadDashboardData(page)
    })
  }

  private checkAuth(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/admin/login"])
    }
  }

  private loadDashboardData(page = 1): void {
    console.log("[v0] loadDashboardData called with page:", page)
    this.isLoading.set(true)

    this.dashboardService.getRecentApplications(page).subscribe({
      next: (response) => {
        console.log("[v0] Dashboard data loaded:", response)
        this.allApplications.set(response.applications)
        this.filteredApplications.set(response.applications)
        this.currentPage.set(response.currentPage)
        this.totalPages.set(response.totalPages)
        this.totalCount.set(response.totalCount)
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error("[v0] Error loading applications:", error)
        this.isLoading.set(false)
      },
    })
  }

  onPageChange(page: number): void {
    console.log("[v0] onPageChange called with page:", page, "current totalPages:", this.totalPages())
    if (page >= 1 && page <= this.totalPages()) {
      console.log("[v0] Page change valid, navigating to page:", page)
      this.router.navigate(["/admin/dashboard", page])
      // Clear search when changing pages
      this.searchTerm.set("")
    } else {
      console.log("[v0] Page change invalid - page:", page, "totalPages:", this.totalPages())
    }
  }

  onFirstPage(): void {
    console.log("[v0] onFirstPage clicked")
    this.onPageChange(1)
  }

  onLastPage(): void {
    console.log("[v0] onLastPage clicked, totalPages:", this.totalPages())
    this.onPageChange(this.totalPages())
  }

  onPreviousPage(): void {
    console.log("[v0] onPreviousPage clicked, currentPage:", this.currentPage())
    if (this.currentPage() > 1) {
      this.onPageChange(this.currentPage() - 1)
    }
  }

  onNextPage(): void {
    console.log("[v0] onNextPage clicked, currentPage:", this.currentPage(), "totalPages:", this.totalPages())
    if (this.currentPage() < this.totalPages()) {
      this.onPageChange(this.currentPage() + 1)
    }
  }

  onGoToPage(): void {
    const page = Number.parseInt(this.goToPage())
    console.log("[v0] onGoToPage called with:", this.goToPage(), "parsed as:", page)
    if (!isNaN(page) && page >= 1 && page <= this.totalPages()) {
      console.log("[v0] Go to page valid, changing to page:", page)
      this.onPageChange(page)
      this.goToPage.set("")
    } else {
      console.log("[v0] Go to page invalid - page:", page, "totalPages:", this.totalPages())
    }
  }

  onGoToPageChange(value: string): void {
    this.goToPage.set(value)
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages()
    const currentPage = this.currentPage()
    const pages: number[] = []

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, current page area, and last page
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push(-1) // Ellipsis
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push(-1) // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push(-1) // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push(-1) // Ellipsis
        pages.push(totalPages)
      }
    }

    return pages
  }

  onSearchChange(searchValue: string): void {
    this.searchTerm.set(searchValue)
    this.filterApplications()
  }

  private filterApplications(): void {
    const searchTerm = this.searchTerm().toLowerCase().trim()

    if (!searchTerm) {
      this.filteredApplications.set(this.allApplications())
      return
    }

    const filtered = this.allApplications().filter(
      (application) =>
        (application.reference || "").toLowerCase().includes(searchTerm) ||
        application.contactPersonName.toLowerCase().includes(searchTerm) ||
        application.businessName.toLowerCase().includes(searchTerm) ||
        application.businessEmail.toLowerCase().includes(searchTerm) ||
        application.contactNumber.toLowerCase().includes(searchTerm) ||
        application.industryOrBusinessStyle.toLowerCase().includes(searchTerm),
    )

    this.filteredApplications.set(filtered)
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/admin/login"])
  }
}
