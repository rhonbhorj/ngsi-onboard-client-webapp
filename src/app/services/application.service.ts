import { Injectable, signal } from "@angular/core"
import type { Observable } from "rxjs"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { map } from "rxjs/operators"

export interface MerchantApplication {
  reference?: string
  // Step 1: Business Information
  contactPersonName: string
  registeredBy: string // Added registeredBy property to match backend schema
  registeredByContactNumber: string // Added registered by contact number field
  contactNumber: string
  contactPerson: string
  businessName: string
  businessEmail: string
  businessAddress: string
  telephoneNo?: string

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
  registeredBy: string // Added registeredBy property to backend interface
  registeredByContactNumber: string // Added registered by contact number field
  contactNumber: string
  contactPerson: string
  businessName: string
  businessEmail: string
  businessAddress: string
  telephoneNo?: string
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
        registeredBy: "Tayo pa", // Added registeredBy to mock data
        registeredByContactNumber: "09177589353", // Added registered by contact number to mock data
        contactNumber: "09177589353",
        contactPerson: "John Doe", // Added contactPerson field
        businessName: "NetGlobal Solutions Inc",
        businessEmail: "tajarrosrj@gmail.com",
        businessAddress: "123 Business Street, Metro Manila, Philippines",
        telephoneNo: "02-1234-5678",
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
        registeredBy: "Admin User", // Added registeredBy to mock data
        registeredByContactNumber: "09123456789", // Added registered by contact number to mock data
        contactNumber: "09123456789",
        contactPerson: "Jane Smith", // Added contactPerson field
        businessName: "NetGlobal Solutions Inc",
        businessEmail: "ravendavid@gmail.com",
        businessAddress: "456 Tech Avenue, Cebu City, Philippines",
        telephoneNo: "032-9876-5432",
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
      registeredBy: backendData.registeredBy, // Added registeredBy transformation
      registeredByContactNumber: backendData.registeredByContactNumber, // Added registered by contact number transformation
      contactNumber: backendData.contactNumber,
      contactPerson: backendData.contactPerson,
      businessName: backendData.businessName,
      businessEmail: backendData.businessEmail,
      businessAddress: backendData.businessAddress,
      telephoneNo: backendData.telephoneNo,
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
      .get<ApiResponse<BackendMerchantApplication[]>>(
        `${environment.apiUrl}/api/merchant-applications?status=${status}`,
      )
      .pipe(map((response) => (response.data || []).map((app) => this.transformToMerchantApplication(app))))
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

  checkContactNumberExists(contactNumber: string): Observable<boolean> {
    return this.http
      .get<{ status: string; exists: boolean }>(
        `${environment.apiUrl}/company_data/check-contact?contactNumber=${contactNumber}`,
      )
      .pipe(map((response) => response.exists))
  }
}
