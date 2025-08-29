import { Injectable, signal } from "@angular/core"
import type { Observable } from "rxjs"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { map } from "rxjs/operators"

export interface MerchantApplication {
  reference?: string
  // Step 1: Business Information
  contactPersonName: string
  contactNumber: string
  businessName: string
  businessEmail: string
  businessAddress: string
  industryOrBusinessStyle: string
  telephoneNo?: string
  typeOfBusiness: "Sole Proprietorship" | "Partnership" | "Corporation" | "Others"

  // Step 2: Payment & Transaction Details
  hasExistingPaymentPortal: string
  currentModeOfPayment: {
    cash: boolean
    eWallets: boolean
    qrph: boolean
    cardPayment: boolean
  }
  estimatedTransactionNumbers?: string
  estimatedAverageAmount?: string

  // System fields
  status: "pending" | "approved" | "rejected" | "under_review"
  submittedAt: string
  createdAt?: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

interface BackendMerchantApplication {
  id: string
  reference: string
  contactPersonName: string
  contactNumber: string
  businessName: string
  businessEmail: string
  businessAddress: string
  industryOrBusinessStyle: string
  telephoneNo?: string
  typeOfBusiness: string
  hasExistingPaymentPortal?: string
  currentModeOfPayment?: any
  estimatedTransactionNumbers?: string
  estimatedAverageAmount?: string
  status: string
  submitted_at: string
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  reference_id?: string
  reference?: string
}

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  // Shared applications data
  private readonly applications = signal<MerchantApplication[]>([])

  constructor(private http: HttpClient) {
    // Initialize with some mock data
    this.applications.set([
      {
        contactPersonName: "Ritchmond Tajarros",
        contactNumber: "09177589353",
        businessName: "NetGlobal Solutions Inc",
        businessEmail: "tajarrosrj@gmail.com",
        businessAddress: "123 Business Street, Metro Manila, Philippines",
        industryOrBusinessStyle: "Technology Solutions",
        telephoneNo: "02-1234-5678",
        typeOfBusiness: "Corporation",
        hasExistingPaymentPortal: "NO",
        currentModeOfPayment: {
          cash: false,
          eWallets: true,
          qrph: false,
          cardPayment: true,
        },
        estimatedTransactionNumbers: "51 – 100",
        estimatedAverageAmount: "10,001 – 50,000",
        status: "pending",
        submittedAt: "2025-08-15T10:30:00Z",
      },
      {
        contactPersonName: "Raven David",
        contactNumber: "09123456789",
        businessName: "NetGlobal Solutions Inc",
        businessEmail: "ravendavid@gmail.com",
        businessAddress: "456 Tech Avenue, Cebu City, Philippines",
        industryOrBusinessStyle: "Software Development",
        telephoneNo: "032-9876-5432",
        typeOfBusiness: "Corporation",
        hasExistingPaymentPortal: "YES",
        currentModeOfPayment: {
          cash: true,
          eWallets: true,
          qrph: true,
          cardPayment: true,
        },
        estimatedTransactionNumbers: "ABOVE 100",
        estimatedAverageAmount: "ABOVE 50,000",
        status: "approved",
        submittedAt: "2025-08-21T14:20:00Z",
        reviewedAt: "2025-08-21T09:15:00Z",
        reviewedBy: "admin_001",
      },
    ])
  }

  private transformToMerchantApplication(backendData: BackendMerchantApplication): MerchantApplication {
    return {
      reference: backendData.reference,
      contactPersonName: backendData.contactPersonName,
      contactNumber: backendData.contactNumber,
      businessName: backendData.businessName,
      businessEmail: backendData.businessEmail,
      businessAddress: backendData.businessAddress,
      industryOrBusinessStyle: backendData.industryOrBusinessStyle,
      telephoneNo: backendData.telephoneNo,
      typeOfBusiness: backendData.typeOfBusiness as MerchantApplication["typeOfBusiness"],
      hasExistingPaymentPortal: backendData.hasExistingPaymentPortal ?? "",
      currentModeOfPayment:
        typeof backendData.currentModeOfPayment === "string"
          ? JSON.parse(backendData.currentModeOfPayment)
          : backendData.currentModeOfPayment || { cash: false, eWallets: false, qrph: false, cardPayment: false },
      estimatedTransactionNumbers: backendData.estimatedTransactionNumbers,
      estimatedAverageAmount: backendData.estimatedAverageAmount,
      status: backendData.status as MerchantApplication["status"],
      submittedAt: backendData.submitted_at,
      createdAt: backendData.created_at,
    }
  }

  // Submit new application from form TO BACKEND
  submitApplication(
    formData: Omit<MerchantApplication, "status" | "submittedAt">,
  ): Observable<{ application: MerchantApplication; reference_id: string }> {
    // 🔑 Ensure correct payload shape
    const payload = {
      ...formData,
      currentModeOfPayment: JSON.stringify(formData.currentModeOfPayment), // backend expects string
    }

    console.log("📤 Sending payload to backend:", payload)

    return this.http.post<ApiResponse<BackendMerchantApplication>>(`${environment.apiUrl}/company_data`, payload).pipe(
      map((response) => {
        console.log("📥 Response from backend:", response)

        const application = response.data
          ? this.transformToMerchantApplication(response.data)
          : {
              ...formData,
              status: "pending" as MerchantApplication["status"],
              submittedAt: new Date().toISOString(),
              currentModeOfPayment: formData.currentModeOfPayment || {
                cash: false,
                eWallets: false,
                qrph: false,
                cardPayment: false,
              },
            }

        return {
          application,
          reference_id: response.reference ?? response.reference_id ?? response.data?.reference ?? "",
        }
      }),
    )
  }

  // Get all applications from backend
  getApplications(): Observable<MerchantApplication[]> {
    return this.http
      .get<ApiResponse<BackendMerchantApplication[]>>(`${environment.apiUrl}/api/merchant-applications`)
      .pipe(map((response) => (response.data || []).map((app) => this.transformToMerchantApplication(app))))
  }

  // Get application by status from backend
  getApplicationsByStatus(status: MerchantApplication["status"]): Observable<MerchantApplication[]> {
    return this.http
      .get<BackendMerchantApplication[]>(`${environment.apiUrl}/api/merchant-applications?status=${status}`)
      .pipe(map((response) => (response || []).map((app) => this.transformToMerchantApplication(app))))
  }

  // Update application status via backend
  updateApplicationStatus(
    applicationId: string,
    status: MerchantApplication["status"],
    notes?: string,
  ): Observable<MerchantApplication> {
    return this.http.patch<MerchantApplication>(`${environment.apiUrl}/api/merchant-applications/${applicationId}`, {
      status,
      notes,
    })
  }
}
