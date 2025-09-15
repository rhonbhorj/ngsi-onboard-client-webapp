import { Injectable, signal, inject } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { type Observable, of, map, catchError, forkJoin, switchMap } from "rxjs"
import type { AdminNotification } from "../models/admin.model"
import type { MerchantApplication } from "../../../services/application.service"
import { environment } from "../../../../environments/environment"
import { AdminAuthService } from "./admin-auth.service"

interface AdminDashboardResponse {
  totalPages: number
  total: number
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

    console.log("Service making request to:", endpoint)

    const token = this.authService.authToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })

    return this.http.get<AdminDashboardResponse>(endpoint, { headers }).pipe(
      map((response) => {
        console.log("Service received raw response:", response)
        console.log("Response type:", typeof response)
        console.log("Response keys:", Object.keys(response))
        console.log("Response.totalPages:", response.totalPages)
        console.log("Companies count:", response.companies?.length || 0)

        const currentPage = page 
        const itemsPerPage = 10
        const totalCount = response.total || 0
        const totalPages = Math.ceil(totalCount / itemsPerPage)

        console.log("Using backend total:", totalCount)
        console.log("Calculated totalPages:", totalPages)

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
          status: company.status as MerchantApplication["status"],
          submittedAt: company.submittedAt,
        }))

        const result = {
          applications,
          totalPages,
          currentPage,
          totalCount,
        }
        console.log("Service returning:", result)

        return result
      }),
      catchError((error) => {
        console.error("HTTP Error in service:", error)
        console.error("Error status:", error.status)
        console.error("Error message:", error.message)
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

    console.log("Service making search request to:", endpoint)

    const token = this.authService.authToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })

    return this.http.get<SearchCompany[]>(endpoint, { headers }).pipe(
      map((companies) => {
        console.log("Search results received:", companies)

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
          status: company.status as MerchantApplication["status"],
          submittedAt: company.submittedAt,
        }))

        return {
          applications,
          totalCount: applications.length,
        }
      }),
      catchError((error) => {
        console.error("HTTP Error in search:", error)
        return of({
          applications: [],
          totalCount: 0,
        })
      }),
    )
  }

  searchApplicationsWithPagination(
    searchTerm: string,
    page = 1,
  ): Observable<{ applications: MerchantApplication[]; totalPages: number; currentPage: number; totalCount: number }> {
    return this.searchApplications(searchTerm).pipe(
      map((searchResponse) => {
        const itemsPerPage = 10
        const totalCount = searchResponse.totalCount
        const totalPages = Math.ceil(totalCount / itemsPerPage)

        // Calculate pagination for search results
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedApplications = searchResponse.applications.slice(startIndex, endIndex)

        return {
          applications: paginatedApplications,
          totalPages,
          currentPage: page,
          totalCount,
        }
      }),
    )
  }

  getNotifications(): Observable<AdminNotification[]> {
    return of(this.notifications())
  }

  updateApplicationStatus(
    referenceNo: string,
    status: "called",
  ): Observable<{ success: boolean; message?: string }> {
    const token = this.authService.authToken()
    const headers = { Authorization: `Bearer ${token}` }
    const payload = { referenceNo, status }
    
    return this.http.post<{ success: boolean; message?: string }>(
      `${environment.apiUrl}/admin/update-application-status`, 
      payload, 
      { headers }
    ).pipe(
      map(response => {
        // Add notification on successful update
        this.addNotification({
          id: "notif_" + Date.now(),
          type: "status_change",
          title: "Application Status Updated",
          message: `Application ${referenceNo} marked as ${status}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: `/admin/applications/${referenceNo}`,
        })
        
        return response
      }),
      catchError(error => {
        console.error("Error updating application status:", error)
        return of({
          success: false,
          message: "Failed to update application status"
        })
      })
    )
  }

  getAllApplicationsForExport(): Observable<MerchantApplication[]> {
    console.log("Getting all applications by fetching all pages")

    // First get page 1 to know total pages
    return this.getRecentApplications(1).pipe(
      switchMap((firstPageResponse) => {
        const totalPages = firstPageResponse.totalPages
        console.log("Total pages to fetch:", totalPages)

        if (totalPages <= 1) {
          return of(firstPageResponse.applications)
        }

        // Create array of page numbers to fetch (excluding page 1 since we already have it)
        const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2)

        // Fetch all remaining pages
        const pageRequests = pageNumbers.map((pageNum) => this.getRecentApplications(pageNum))

        // Combine all requests
        return forkJoin(pageRequests).pipe(
          map((allPageResponses) => {
            // Combine first page with all other pages
            const allApplications = [
              ...firstPageResponse.applications,
              ...allPageResponses.flatMap((response) => response.applications),
            ]

            console.log("Combined all pages, total applications:", allApplications.length)
            return allApplications
          }),
        )
      }),
      catchError((error) => {
        console.error("HTTP Error in getAllApplicationsForExport:", error)
        return of([])
      }),
    )
  }

  downloadExcelReport(): Observable<Blob> {
    const endpoint = `${environment.apiUrl}/admin/dashboard/download`

    console.log("Service making download request to:", endpoint)

    const token = this.authService.authToken()
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    return this.http
      .get(endpoint, {
        headers,
        responseType: "blob",
      })
      .pipe(
        catchError((error) => {
          console.error("HTTP Error in download:", error)
          throw error
        }),
      )
  }

  getDatabaseTotals(): Observable<{ pending: number; called: number; total: number }> {
    console.log("Calculating totals from existing data instead of API call")

    return this.getRecentApplications(1).pipe(
      map((response) => {
        const applications = response.applications
        const pending = applications.filter((app) => app.status === "pending").length
        const called = applications.filter((app) => app.status === "called").length
        const total = applications.length

        console.log("Calculated totals:", { pending, called, total })

        return {
          pending,
          called,
          total,
        }
      }),
      catchError((error) => {
        console.error("Error calculating totals:", error)
        return of({
          pending: 0,
          called: 0,
          total: 0,
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
