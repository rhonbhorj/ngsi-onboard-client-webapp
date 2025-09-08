import { Component, signal, inject, type OnInit, ChangeDetectionStrategy } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AdminAuthService } from "../services/admin-auth.service"
import { AdminDashboardService } from "../services/admin-dashboard.service"
import type { MerchantApplication } from "../../../services/application.service"
import { PaginationComponent, type PaginationConfig } from "../../../shared/components/pagination/pagination.component"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
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

  readonly currentPage = signal(1)
  readonly totalPages = signal(0)
  readonly totalCount = signal<number>(0)
  readonly goToPage = signal("")

  readonly showExportDropdown = signal(false)
  readonly showAdminDropdown = signal(false)

  readonly totalPendingCount = signal(0)
  readonly totalCalledCount = signal(0)
  readonly totalApplicationsCount = signal(0)

  // Navigation state
  readonly activeSection = signal<"dashboard" | "settings">("dashboard")
  readonly activeTab = signal<"pending" | "called">("pending")

  // Modal signals
  readonly showDetailsModal = signal(false)
  readonly selectedApplication = signal<MerchantApplication | null>(null)
  readonly showSettingsModal = signal(false)
  readonly currentPassword = signal("")
  readonly newPassword = signal("")
  readonly confirmPassword = signal("")
  readonly isChangingPassword = signal(false)

  readonly paginationConfig: PaginationConfig = {
    showItemsInfo: true,
    showGoToPage: true,
    itemsPerPage: 10,
    itemName: "applications",
  }

  ngOnInit() {
    this.checkAuth()

    this.route.url.subscribe((segments) => {
      const path = segments[0]?.path || "dashboard"

      if (path === "dashboard") {
        this.activeSection.set("dashboard")
        this.route.params.subscribe((params) => {
          const page = params["page"] ? Number.parseInt(params["page"], 10) : 1
          this.loadDashboardData(page)
        })
      } else if (path === "settings") {
        this.activeSection.set("settings")
        this.loadDashboardData(1)
      }
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
        this.filterApplications()
        this.currentPage.set(response.currentPage)
        this.totalPages.set(response.totalPages)
        this.totalCount.set(response.totalCount)

        this.calculateTotalsFromData()
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error("[v0] Error loading applications:", error)
        this.isLoading.set(false)
      },
    })
  }

  private calculateTotalsFromData(): void {
    this.dashboardService.getAllApplicationsForExport().subscribe({
      next: (allApplications) => {
        const pendingCount = allApplications.filter((app) => app.status === "pending").length
        const calledCount = allApplications.filter((app) => app.status === "called").length

        this.totalPendingCount.set(pendingCount)
        this.totalCalledCount.set(calledCount)
        this.totalApplicationsCount.set(allApplications.length)

        console.log(
          "[v0] Calculated totals from ALL data - Pending:",
          pendingCount,
          "Called:",
          calledCount,
          "Total:",
          allApplications.length,
        )
      },
      error: (error) => {
        console.error("[v0] Error getting all applications for totals:", error)
        const currentApps = this.allApplications()
        const currentPendingCount = currentApps.filter((app) => app.status === "pending").length
        const currentCalledCount = currentApps.filter((app) => app.status === "called").length

        this.totalPendingCount.set(currentPendingCount)
        this.totalCalledCount.set(currentCalledCount)
        this.totalApplicationsCount.set(this.totalCount())

        console.log(
          "[v0] Fallback totals from current page - Pending:",
          currentPendingCount,
          "Called:",
          currentCalledCount,
          "Total:",
          this.totalCount(),
        )
      },
    })
  }

  onPageChange(page: number): void {
    console.log("[v0] onPageChange called with page:", page, "current totalPages:", this.totalPages())

    if (page >= 1 && page <= this.totalPages()) {
      console.log("[v0] Page change valid, navigating to page:", page)

      if (this.activeSection() === "dashboard") {
        this.router.navigate(["/admin/dashboard", page])
      } else {
        this.loadDashboardData(page)
      }
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
    const lastPage = this.totalPages() || 1
    this.onPageChange(lastPage)
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
    const maxPages = this.totalPages() || 1
    if (!isNaN(page) && page >= 1 && page <= maxPages) {
      console.log("[v0] Go to page valid, changing to page:", page)
      this.onPageChange(page)
      this.goToPage.set("")
    } else {
      console.log("[v0] Go to page invalid - page:", page, "totalPages:", maxPages)
    }
  }

  onGoToPageChange(value: string): void {
    this.goToPage.set(value)
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/admin/login"])
  }

  exportToCSV(): void {
    this.isLoading.set(true)
    this.dashboardService.getAllApplicationsForExport().subscribe({
      next: (allData) => {
        const csvContent = this.convertToCSV(allData)
        this.downloadFile(csvContent, "merchant-applications.csv", "text/csv")
        this.showExportDropdown.set(false)
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error("[v0] Error exporting CSV:", error)
        this.isLoading.set(false)
      },
    })
  }

  exportToExcel(): void {
    this.isLoading.set(true)
    this.dashboardService.downloadExcelReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "company_list_report.xlsx"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        this.showExportDropdown.set(false)
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error("[v0] Error exporting Excel:", error)
        this.isLoading.set(false)
      },
    })
  }

  private convertToCSV(data: MerchantApplication[]): string {
    const headers = [
      "Reference",
      "Business Name",
      "Industry/Business Style",
      "Business Address",
      "Contact Person",
      "Contact Number",
      "Business Email",
      "Business Type",
      "Submitted At",
      "Payment Methods",
    ]

    const csvRows = [
      headers.join(","),
      ...data.map((app) =>
        [
          `"${app.reference || ""}"`,
          `"${app.businessName}"`,
          `""`,
          `"${app.businessAddress}"`,
          `"${app.contactPersonName}"`,
          `"${app.contactNumber}"`,
          `"${app.businessEmail}"`,
          `"${app.hasExistingPaymentPortal || ""}"`,
          `"${new Date(app.submittedAt).toLocaleString()}"`,
          `"${this.getFormattedPaymentMethods(app.currentModeOfPayment)}"`,
        ].join(","),
      ),
    ]

    return csvRows.join("\n")
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  getFormattedPaymentMethods(paymentMethods: any): string {
    if (!paymentMethods || typeof paymentMethods !== "object") {
      return "Not specified"
    }

    const enabledMethods: string[] = []

    if (paymentMethods.cash) enabledMethods.push("Cash")
    if (paymentMethods.eWallets) enabledMethods.push("E-Wallets")
    if (paymentMethods.qrph) enabledMethods.push("QR PH")
    if (paymentMethods.cardPayment) enabledMethods.push("Card Payment")

    return enabledMethods.length > 0 ? enabledMethods.join(", ") : "None selected"
  }

  getEstimatedAmount(amount?: string): number {
    if (!amount) return 0

    if (amount.toUpperCase().includes("ABOVE")) {
      const match = amount.match(/[\d,]+/)
      if (match) {
        return Number.parseFloat(match[0].replace(/,/g, "")) || 0
      }
      return 0
    }

    if (amount.includes("–") || amount.includes("-")) {
      const firstNumber = amount.split(/[–-]/)[0].trim()
      return Number.parseFloat(firstNumber.replace(/,/g, "")) || 0
    }

    return Number.parseFloat(amount.replace(/,/g, "")) || 0
  }

  openDetailsModal(application: MerchantApplication): void {
    this.selectedApplication.set(application)
    this.showDetailsModal.set(true)
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false)
    this.selectedApplication.set(null)
  }

  markAsCalled(application: MerchantApplication): void {
    if (!application.reference) {
      alert("Application reference is missing")
      return
    }

    if (confirm(`Are you sure you want to mark application ${application.reference} as called?`)) {
      this.dashboardService.updateApplicationStatus(application.reference, "called").subscribe({
        next: (response) => {
          if (response.success) {
            const updatedApplications = this.allApplications().map((app) =>
              app.reference === application.reference ? { ...app, status: "called" as const } : app,
            )
            this.allApplications.set(updatedApplications)
            this.filterApplications()
            alert("Application marked as called successfully")
            this.calculateTotalsFromData()
          } else {
            alert(response.message || "Failed to mark application as called")
          }
        },
        error: (error) => {
          console.error("Error marking application as called:", error)
          alert("Error marking application as called")
        },
      })
    }
  }

  setActiveTab(tab: "pending" | "called"): void {
    this.activeTab.set(tab)
    this.filterApplications()
  }

  private filterApplications(): void {
    const activeTab = this.activeTab()
    const filtered = this.allApplications().filter((app) => app.status === activeTab)
    this.filteredApplications.set(filtered)
  }

  toggleAdminDropdown(): void {
    this.showAdminDropdown.set(!this.showAdminDropdown())
  }

  navigateToSettings(): void {
    this.router.navigate(["/admin/settings"])
  }
}
