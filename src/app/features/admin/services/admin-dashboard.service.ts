import { Injectable, signal, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, of, map, catchError } from "rxjs"
import type { AdminNotification } from "../models/admin.model"
import type { MerchantApplication } from "../../../services/application.service"
import { environment } from "../../../../environments/environment"

interface AdminDashboardResponse {
  totalPages: number
  companies: {
    id: string
    contactPersonName: string
    contactNumber: string
    businessName: string
    businessEmail: string
    businessAddress: string
    industryOrBusinessStyle: string
    telephoneNo: string
    typeOfBusiness: string
    hasExistingPaymentPortal: string
    currentModeOfPayment: string
    estimatedTransactionNumbers: string
    estimatedAverageAmount: string
    referenceNo: string
    status: string
    submittedAt: string
  }[]
}

@Injectable({
  providedIn: "root",
})
export class AdminDashboardService {
  private http = inject(HttpClient)

  // Mock notifications
  readonly notifications = signal<AdminNotification[]>([])

  constructor() {
    this.loadNotifications()
  }

  getRecentApplications(
    page = 1,
  ): Observable<{ applications: MerchantApplication[]; totalPages: number; currentPage: number; totalCount: number }> {
    const endpoint =
      page === 1 ? `${environment.apiUrl}/admin/dashboard` : `${environment.apiUrl}/admin/dashboard/${page}`

    console.log("[v0] Service making request to:", endpoint)

    return this.http.get<AdminDashboardResponse>(endpoint).pipe(
      map((response) => {
        console.log("[v0] Service received raw response:", response)
        console.log("[v0] Response type:", typeof response)
        console.log("[v0] Response keys:", Object.keys(response))
        console.log("[v0] Response.totalPages:", response.totalPages)
        console.log("[v0] Companies count:", response.companies?.length || 0)

        const currentPage = page // Use the requested page as current page
        const companiesPerPage = response.companies?.length || 10

        // If we're on the last page and have fewer items, calculate more accurately
        let totalCount: number
        if (currentPage === response.totalPages && companiesPerPage < 10) {
          // Last page with partial data: (totalPages - 1) * 10 + current page items
          totalCount = (response.totalPages - 1) * 10 + companiesPerPage
        } else {
          // Not the last page or last page is full, estimate based on full pages
          totalCount = response.totalPages * 10
        }

        console.log("[v0] Calculated totalCount:", totalCount)

        // Transform backend data to frontend interface
        const applications = response.companies.map((company) => ({
          reference: company.referenceNo,
          contactPersonName: company.contactPersonName,
          contactNumber: company.contactNumber,
          businessName: company.businessName,
          businessEmail: company.businessEmail,
          businessAddress: company.businessAddress,
          industryOrBusinessStyle: company.industryOrBusinessStyle,
          telephoneNo: company.telephoneNo,
          typeOfBusiness: company.typeOfBusiness as "Corporation" | "Sole Proprietorship" | "Partnership" | "Others",
          hasExistingPaymentPortal: company.hasExistingPaymentPortal,
          currentModeOfPayment: JSON.parse(company.currentModeOfPayment),
          estimatedTransactionNumbers: company.estimatedTransactionNumbers,
          estimatedAverageAmount: company.estimatedAverageAmount,
          status: company.status as "pending" | "approved" | "rejected",
          submittedAt: company.submittedAt,
        }))

        const result = {
          applications,
          totalPages: response.totalPages,
          currentPage,
          totalCount,
        }
        console.log("[v0] Service returning:", result)

        return result
      }),
      catchError((error) => {
        console.error("[v0] HTTP Error in service:", error)
        console.error("[v0] Error status:", error.status)
        console.error("[v0] Error message:", error.message)
        return of({
          applications: [],
          totalPages: 0,
          currentPage: 1,
          totalCount: 0,
        })
      }),
    )
  }

  getNotifications(): Observable<AdminNotification[]> {
    return of(this.notifications())
  }

  updateApplicationStatus(applicationId: string, status: MerchantApplication["status"], notes?: string): void {
    // Add notification
    this.addNotification({
      id: "notif_" + Date.now(),
      type: "status_change",
      title: "Application Status Updated",
      message: `Application ${applicationId} status changed to ${status}`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: `/admin/applications/${applicationId}`,
    })
  }

  private loadNotifications(): void {
    const mockNotifications: AdminNotification[] = [
      {
        id: "notif_001",
        type: "new_application",
        title: "New Application Received",
        message: "New merchant application submitted by Tech Solutions Inc.",
        timestamp: "2024-01-15T10:30:00Z",
        read: false,
        actionUrl: "/admin/applications/app_001",
      },
      {
        id: "notif_002",
        type: "status_change",
        title: "Application Approved",
        message: "Application from Innovation Corp has been approved",
        timestamp: "2024-01-15T09:15:00Z",
        read: false,
        actionUrl: "/admin/applications/app_002",
      },
    ]

    this.notifications.set(mockNotifications)
  }

  private addNotification(notification: AdminNotification): void {
    const currentNotifications = this.notifications()
    this.notifications.set([notification, ...currentNotifications])
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.notifications()
    const notificationIndex = notifications.findIndex((n) => n.id === notificationId)

    if (notificationIndex !== -1) {
      notifications[notificationIndex] = { ...notifications[notificationIndex], read: true }
      this.notifications.set([...notifications])
    }
  }
}
