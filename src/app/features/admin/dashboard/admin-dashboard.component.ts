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
  readonly originalApplications = signal<MerchantApplication[]>([])
  readonly originalTotalCount = signal(0)
  readonly isLoading = signal(false)
  readonly searchTerm: WritableSignal<string> = signal("")
  readonly isSearchMode = signal(false)

  readonly currentPage = signal(1)
  readonly totalPages = signal(0)
  readonly totalCount = signal(0)
  readonly goToPage = signal("")

  readonly showExportDropdown = signal(false)

  // Navigation state
  readonly activeSection = signal<"dashboard" | "settings">("dashboard")

  readonly activeTab = signal<"all" | "pending" | "approved" | "rejected">("all")

  // Modal signals
  readonly showDetailsModal = signal(false)
  readonly selectedApplication = signal<MerchantApplication | null>(null)
  readonly showSettingsModal = signal(false)
  readonly currentPassword = signal("")
  readonly newPassword = signal("")
  readonly confirmPassword = signal("")
  readonly isChangingPassword = signal(false)

  ngOnInit() {
    this.checkAuth()

    this.route.url.subscribe((segments) => {
      const path = segments[0]?.path || "dashboard"

      if (path === "dashboard") {
        this.activeSection.set("dashboard")
        // Handle pagination for dashboard
        this.route.params.subscribe((params) => {
          const page = params["page"] ? Number.parseInt(params["page"], 10) : 1
          this.loadDashboardData(page)
        })
      } else if (path === "settings") {
        this.activeSection.set("settings")
        this.loadDashboardData(1) // Load data for settings (needed for stats)
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
        this.filteredApplications.set(response.applications)
        if (!this.isSearchMode()) {
          this.originalApplications.set(response.applications)
          this.originalTotalCount.set(response.totalCount)
        }
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

    if (this.isSearchMode()) {
      console.log("[v0] Page change blocked - in search mode")
      return
    }

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

    if (searchValue.trim()) {
      this.performGlobalSearch(searchValue.trim())
    } else {
      this.isSearchMode.set(false)
      if (this.activeSection() === "dashboard") {
        this.router.navigate(["/admin/dashboard", 1])
      } else {
        this.loadDashboardData(1)
      }
    }
  }

  private performGlobalSearch(searchTerm: string): void {
    this.isLoading.set(true)
    this.isSearchMode.set(true)

    this.dashboardService.searchApplications(searchTerm).subscribe({
      next: (response) => {
        console.log("[v0] Global search results:", response)
        this.allApplications.set(response.applications)
        this.filteredApplications.set(response.applications)
        this.currentPage.set(1)
        this.totalPages.set(1)
        this.totalCount.set(response.totalCount)
        this.isLoading.set(false)
        this.filterApplications()
      },
      error: (error) => {
        console.error("[v0] Error in global search:", error)
        this.isLoading.set(false)
      },
    })
  }

  private filterApplications(): void {
    let applications = this.allApplications()

    if (this.activeTab() !== "all") {
      applications = applications.filter((app) => app.status === this.activeTab())
    }

    this.filteredApplications.set(applications)
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/admin/login"])
  }

  toggleExportDropdown(): void {
    this.showExportDropdown.set(!this.showExportDropdown())
  }

  exportToCSV(): void {
    const data = this.searchTerm() ? this.filteredApplications() : this.allApplications()
    const csvContent = this.convertToCSV(data)
    this.downloadFile(csvContent, "merchant-applications.csv", "text/csv")
    this.showExportDropdown.set(false)
  }

  exportToExcel(): void {
    const data = this.searchTerm() ? this.filteredApplications() : this.allApplications()
    const csvContent = this.convertToCSV(data)
    this.downloadFile(
      csvContent,
      "merchant-applications.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    this.showExportDropdown.set(false)
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

  // Modal methods
  openDetailsModal(application: MerchantApplication): void {
    this.selectedApplication.set(application)
    this.showDetailsModal.set(true)
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false)
    this.selectedApplication.set(null)
  }

  openSettingsModal(): void {
    this.showSettingsModal.set(true)
    this.currentPassword.set("")
    this.newPassword.set("")
    this.confirmPassword.set("")
  }

  closeSettingsModal(): void {
    this.showSettingsModal.set(false)
    this.currentPassword.set("")
    this.newPassword.set("")
    this.confirmPassword.set("")
  }

  changePassword(): void {
    if (this.newPassword() !== this.confirmPassword()) {
      alert("New passwords do not match")
      return
    }

    this.isChangingPassword.set(true)
    this.authService.changePassword(this.currentPassword(), this.newPassword()).subscribe({
      next: (response) => {
        this.isChangingPassword.set(false)
        if (response.success) {
          alert("Password changed successfully")
          this.closeSettingsModal()
        } else {
          alert(response.message || "Failed to change password")
        }
      },
      error: (error) => {
        this.isChangingPassword.set(false)
        console.error("Error changing password:", error)
        alert("Error changing password")
      },
    })
  }

  // Navigation methods
  setActiveSection(section: "dashboard" | "settings"): void {
    switch (section) {
      case "dashboard":
        this.router.navigate(["/admin/dashboard"])
        break
      case "settings":
        this.router.navigate(["/admin/settings"])
        break
    }
  }

  getSectionTitle(): string {
    switch (this.activeSection()) {
      case "dashboard":
        return "Dashboard"
      case "settings":
        return "Settings"
      default:
        return "Admin Dashboard"
    }
  }

  getSectionDescription(): string {
    switch (this.activeSection()) {
      case "dashboard":
        return "Overview and management of all merchant applications"
      case "settings":
        return "Configure your admin account settings"
      default:
        return ""
    }
  }

  getPendingCount(): number {
    return this.originalApplications().filter((app) => app.status === "pending").length
  }

  getApprovedCount(): number {
    return this.originalApplications().filter((app) => app.status === "approved").length
  }

  getRejectedCount(): number {
    return this.originalApplications().filter((app) => app.status === "rejected").length
  }

  getTotalApplicationsCount(): number {
    return this.originalApplications().length
  }

  setActiveTab(tab: "all" | "pending" | "approved" | "rejected"): void {
    this.activeTab.set(tab)
    this.filterApplications()
  }

  getTabDescription(): string {
    switch (this.activeTab()) {
      case "all":
        return "All merchant applications in the system"
      case "pending":
        return "Applications awaiting review and approval"
      case "approved":
        return "Applications that have been approved"
      case "rejected":
        return "Applications that have been rejected"
      default:
        return ""
    }
  }

  // Application approval and rejection methods
  approveApplication(application: MerchantApplication): void {
    if (!application.reference) {
      alert("Application reference is missing")
      return
    }

    if (confirm(`Are you sure you want to approve application ${application.reference}?`)) {
      this.dashboardService.updateApplicationStatus(application.reference, "approved").subscribe({
        next: (response) => {
          if (response.success) {
            const updatedApplications = this.allApplications().map((app) =>
              app.reference === application.reference ? { ...app, status: "approved" as const } : app,
            )
            this.allApplications.set(updatedApplications)
            this.filterApplications()
            alert("Application approved successfully")
          } else {
            alert(response.message || "Failed to approve application")
          }
        },
        error: (error) => {
          console.error("Error approving application:", error)
          alert("Error approving application")
        },
      })
    }
  }

  rejectApplication(application: MerchantApplication): void {
    if (!application.reference) {
      alert("Application reference is missing")
      return
    }

    if (confirm(`Are you sure you want to reject application ${application.reference}?`)) {
      this.dashboardService.updateApplicationStatus(application.reference, "rejected").subscribe({
        next: (response) => {
          if (response.success) {
            const updatedApplications = this.allApplications().map((app) =>
              app.reference === application.reference ? { ...app, status: "rejected" as const } : app,
            )
            this.allApplications.set(updatedApplications)
            this.filterApplications()
            alert("Application rejected successfully")
          } else {
            alert(response.message || "Failed to reject application")
          }
        },
        error: (error) => {
          console.error("Error rejecting application:", error)
          alert("Error rejecting application")
        },
      })
    }
  }
}
