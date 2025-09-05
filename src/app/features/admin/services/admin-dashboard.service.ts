import { Injectable, signal, inject } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { type Observable, of, map, catchError } from "rxjs"
import type { AdminNotification } from "../models/admin.model"
import type { MerchantApplication } from "../../../services/application.service"
import { environment } from "../../../../environments/environment"
import { AdminAuthService } from "./admin-auth.service"

interface AdminDashboardResponse {
  totalPages: number
  companies: {
    id: string
    contactPersonName: string
    registeredBy: string
    registeredByContactNumber: string
    contactNumber: string
    contactPerson: string
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

interface SearchCompany {
  referenceNo: string
  contactPersonName: string
  registeredBy: string
  registeredByContactNumber: string
  contactNumber: string
  contactPerson?: string
  businessName: string
  businessEmail: string
  businessAddress: string
  industryOrBusinessStyle: string
  telephoneNo?: string
  hasExistingPaymentPortal: string
  currentModeOfPayment: string
  estimatedTransactionNumbers: string
  estimatedAverageAmount: string
  status: string
  submittedAt: string
}

@Injectable({
  providedIn: "root",
})
export class AdminDashboardService {
  private http = inject(HttpClient)
  private authService = inject(AdminAuthService)

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

    const token = this.authService.authToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })

    return this.http.get<AdminDashboardResponse>(endpoint, { headers }).pipe(
      map((response) => {
        console.log("[v0] Service received raw response:", response)
        console.log("[v0] Response type:", typeof response)
        console.log("[v0] Response keys:", Object.keys(response))
        console.log("[v0] Response.totalPages:", response.totalPages)
        console.log("[v0] Companies count:", response.companies?.length || 0)

        const currentPage = page // Use the requested page as current page
        const companiesPerPage = response.companies?.length || 10

        let totalCount: number
        if (currentPage === response.totalPages && companiesPerPage < 10) {
          totalCount = (response.totalPages - 1) * 10 + companiesPerPage
        } else {
          totalCount = response.totalPages * 10
        }

        console.log("[v0] Calculated totalCount:", totalCount)

        const applications = response.companies.map((company) => ({
          reference: company.referenceNo,
          contactPersonName: company.contactPersonName,
          registeredBy: company.registeredBy,
          registeredByContactNumber: company.registeredByContactNumber,
          contactNumber: company.contactNumber,
          contactPerson: company.contactPerson || company.contactPersonName,
          businessName: company.businessName,
          businessEmail: company.businessEmail,
          businessAddress: company.businessAddress,
          industryOrBusinessStyle: company.industryOrBusinessStyle,
          telephoneNo: company.telephoneNo,
          typeOfBusiness: company.typeOfBusiness as "Corporation" | "Sole Proprietorship" | "Partnership" | "Others",
          hasExistingPaymentPortal: company.hasExistingPaymentPortal,
          currentModeOfPayment: (() => {
            try {
              return JSON.parse(company.currentModeOfPayment)
            } catch {
              return { cash: false, eWallets: false, qrph: false, cardPayment: false }
            }
          })(),
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

  searchApplications(searchTerm: string): Observable<{ applications: MerchantApplication[]; totalCount: number }> {
    const endpoint = `${environment.apiUrl}/admin/dashboard/find-company/${encodeURIComponent(searchTerm)}`

    console.log("[v0] Service making search request to:", endpoint)

    const token = this.authService.authToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })

    return this.http.get<SearchCompany[]>(endpoint, { headers }).pipe(
      map((companies) => {
        console.log("[v0] Search results received:", companies)

        const applications = companies.map((company) => ({
          reference: company.referenceNo,
          contactPersonName: company.contactPersonName,
          registeredBy: company.registeredBy,
          registeredByContactNumber: company.registeredByContactNumber,
          contactNumber: company.contactNumber,
          contactPerson: company.contactPerson || company.contactPersonName,
          businessName: company.businessName,
          businessEmail: company.businessEmail,
          businessAddress: company.businessAddress,
          industryOrBusinessStyle: company.industryOrBusinessStyle,
          telephoneNo: company.telephoneNo,
          hasExistingPaymentPortal: company.hasExistingPaymentPortal,
          currentModeOfPayment: (() => {
            try {
              return JSON.parse(company.currentModeOfPayment)
            } catch {
              return { cash: false, eWallets: false, qrph: false, cardPayment: false }
            }
          })(),
          estimatedTransactionNumbers: company.estimatedTransactionNumbers,
          estimatedAverageAmount: company.estimatedAverageAmount,
          status: company.status as "pending" | "approved" | "rejected" | "under_review",
          submittedAt: company.submittedAt,
        }))

        return {
          applications,
          totalCount: applications.length,
        }
      }),
      catchError((error) => {
        console.error("[v0] HTTP Error in search:", error)
        return of({
          applications: [],
          totalCount: 0,
        })
      }),
    )
  }

  getNotifications(): Observable<AdminNotification[]> {
    return of(this.notifications())
  }

  updateApplicationStatus(
    referenceNo: string,
    status: "approved" | "rejected",
  ): Observable<{ success: boolean; message?: string }> {
    const endpoint = `${environment.apiUrl}/admin/dashboard/update-status`

    const token = this.authService.authToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })

    const body = {
      referenceNo,
      status,
    }

    console.log("[v0] Updating application status:", { referenceNo, status })

    return this.http.post<{ success: boolean; message?: string }>(endpoint, body, { headers }).pipe(
      map((response) => {
        console.log("[v0] Status update response:", response)

        // Add notification for status change
        this.addNotification({
          id: "notif_" + Date.now(),
          type: "status_change",
          title: "Application Status Updated",
          message: `Application ${referenceNo} status changed to ${status}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: `/admin/applications/${referenceNo}`,
        })

        return response
      }),
      catchError((error) => {
        console.error("[v0] Error updating application status:", error)
        return of({
          success: false,
          message: error.error?.message || "Failed to update application status",
        })
      }),
    )
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
