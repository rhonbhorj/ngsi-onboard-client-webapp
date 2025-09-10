import { Component, signal, inject, type OnInit, ChangeDetectionStrategy } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AdminAuthService } from "../services/admin-auth.service"
import { AdminDashboardService } from "../services/admin-dashboard.service"
import type { MerchantApplication } from "../../../services/application.service"
import { PaginationComponent, type PaginationConfig } from "../../../shared/components/pagination/pagination.component"
import { AdminSidebarComponent } from "../../../shared/components/admin-sidebar/admin-sidebar.component"
import { AdminHeaderComponent } from "../../../shared/components/admin-header/admin-header.component"

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: "./admin-dashboard.component.html",
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
  readonly originalTotalCount = signal<number>(0)
  readonly goToPage = signal("")

  readonly showExportDropdown = signal(false)
  readonly showAdminDropdown = signal(false)
  readonly searchQuery = signal("")
  readonly isExporting = signal(false)
  private searchTimeout: any = null

  readonly totalPendingCount = signal(0)
  readonly totalCalledCount = signal(0)
  readonly totalApplicationsCount = signal(0)

  // Navigation state
  readonly activeSection = signal<"dashboard" | "settings">("dashboard")
  readonly activeTab = signal<"pending" | "called">("pending")
  readonly statusFilter = signal<"pending" | "approved">("pending")

  // Modal signals
  readonly showDetailsModal = signal(false)
  readonly selectedApplication = signal<MerchantApplication | null>(null)
  readonly showSettingsModal = signal(false)
  readonly currentPassword = signal("")
  readonly newPassword = signal("")
  readonly confirmPassword = signal("")
  readonly isChangingPassword = signal(false)

  readonly paginationConfig: PaginationConfig = {
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
    console.log("loadDashboardData called with page:", page)
    this.isLoading.set(true)

    this.dashboardService.getRecentApplications(page).subscribe({
      next: (response) => {
        console.log("Dashboard data loaded:", response)
        this.allApplications.set(response.applications)
        this.currentPage.set(response.currentPage)
        this.totalPages.set(response.totalPages)
        this.totalCount.set(response.totalCount)
        this.originalTotalCount.set(response.totalCount)
        this.filterApplications()

        this.calculateTotalsFromData()
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error("Error loading applications:", error)
        this.isLoading.set(false)
      },
    })
  }

  private calculateTotalsFromData(): void {
    const currentApplications = this.allApplications()
    const pendingCount = currentApplications.filter((app) => app.status === "pending").length
    const calledCount = currentApplications.filter((app) => app.status === "called").length

    this.totalPendingCount.set(pendingCount)
    this.totalCalledCount.set(calledCount)
    this.totalApplicationsCount.set(currentApplications.length)

    console.log(
      "Calculated totals from current page data - Pending:",
      pendingCount,
      "Called:",
      calledCount,
      "Total:",
      this.totalCount(),
    )
  }

  onPageChange(page: number): void {
    console.log("onPageChange called with page:", page, "current totalPages:", this.totalPages())

    if (page >= 1 && page <= this.totalPages()) {
      console.log("Page change valid, loading page:", page)
      this.loadDashboardData(page)
    } else {
      console.log("Page change invalid - page:", page, "totalPages:", this.totalPages())
    }
  }

  onFirstPage(): void {
    console.log("onFirstPage clicked")
    this.onPageChange(1)
  }

  onLastPage(): void {
    console.log("onLastPage clicked, totalPages:", this.totalPages())
    const lastPage = this.totalPages() || 1
    this.onPageChange(lastPage)
  }

  onPreviousPage(): void {
    console.log("onPreviousPage clicked, currentPage:", this.currentPage())
    if (this.currentPage() > 1) {
      this.onPageChange(this.currentPage() - 1)
    }
  }

  onNextPage(): void {
    console.log("onNextPage clicked, currentPage:", this.currentPage(), "totalPages:", this.totalPages())
    if (this.currentPage() < this.totalPages()) {
      this.onPageChange(this.currentPage() + 1)
    }
  }

  onGoToPage(): void {
    const page = Number.parseInt(this.goToPage())
    console.log("onGoToPage called with:", this.goToPage(), "parsed as:", page)
    const maxPages = this.totalPages() || 1
    if (!isNaN(page) && page >= 1 && page <= maxPages) {
      console.log("Go to page valid, changing to page:", page)
      this.onPageChange(page)
      this.goToPage.set("")
    } else {
      console.log("Go to page invalid - page:", page, "totalPages:", maxPages)
    }
  }

  onGoToPageChange(value: string): void {
    this.goToPage.set(value)
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
        console.error("Error exporting CSV:", error)
        this.isLoading.set(false)
      },
    })
  }

  exportToExcel(): void {
    this.isExporting.set(true)
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
        this.isExporting.set(false)
      },
      error: (error) => {
        console.error("Error exporting Excel:", error)
        this.isExporting.set(false)
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
    const statusFilter = this.statusFilter()
    const searchQuery = this.searchQuery().toLowerCase().trim()
    
    let filtered = this.allApplications()
    
    if (searchQuery) {
      filtered = filtered.filter((app) => app.status === statusFilter)
    } else {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }
    
    this.filteredApplications.set(filtered)
  }

  toggleAdminDropdown(): void {
    this.showAdminDropdown.set(!this.showAdminDropdown())
  }

  navigateToSettings(): void {
    this.router.navigate(['/admin/settings'])
  }

  logout(): void {
    this.authService.logout()
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query)
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    
    if (query.trim()) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch(query.trim())
      }, 500)
    } else {
      this.loadDashboardData(1)
    }
  }

  clearSearch(): void {
    this.searchQuery.set("")
    this.loadDashboardData(1)
  }

  private performSearch(searchTerm: string): void {
    this.isLoading.set(true)
    
    this.dashboardService.searchApplicationsWithPagination(searchTerm, 1).subscribe({
      next: (response) => {
        console.log("Search results:", response)
        this.allApplications.set(response.applications)
        this.filteredApplications.set(response.applications)
        this.totalPages.set(response.totalPages)
        this.currentPage.set(response.currentPage)
        this.totalCount.set(response.totalCount)
        this.isLoading.set(false)
      },
      error: (error) => {
        console.error("Search error:", error)
        this.isLoading.set(false)
        this.loadDashboardData(1)
      }
    })
  }

  getPendingCount(): number {
    return this.allApplications().filter(app => app.status === 'pending').length
  }

  getApprovedCount(): number {
    return this.allApplications().filter(app => app.status === 'approved').length
  }

  getRejectedCount(): number {
    return this.allApplications().filter(app => app.status === 'rejected').length
  }

  getTabClasses(status: string): string {
    const isActive = this.statusFilter() === status
    const baseClasses = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
    
    if (isActive) {
      return `${baseClasses} bg-admin-button-bg text-white-text`
    } else {
      return `${baseClasses} text-gray-700 hover:bg-gray-100`
    }
  }

  getStatusClasses(status: string): string {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    
    switch (status.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  setStatusFilter(status: "pending" | "approved"): void {
    this.statusFilter.set(status)
    
    const searchQuery = this.searchQuery().trim()
    if (searchQuery) {
      this.performSearch(searchQuery)
    } else {
      this.filterApplications()
    }
  }


  viewApplication(application: MerchantApplication): void {
    this.selectedApplication.set(application)
    this.showDetailsModal.set(true)
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }
}
