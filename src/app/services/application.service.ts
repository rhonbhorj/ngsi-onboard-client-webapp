import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { environment } from "../../environments/environment"
import type {
  ApiResponse,
  BackendMerchantApplication,
  MerchantApplication,
  MerchantApplicationPayload,
} from "../features/form/models/merchant-application.model"

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  private readonly http = inject(HttpClient)

  private transformToMerchantApplication(backendData: BackendMerchantApplication): MerchantApplication {
    return {
      reference: backendData.reference,
      contactPersonName: backendData.contactPersonName,
      registeredBy: backendData.registeredBy,
      registeredByContactNumber: backendData.registeredByContactNumber,
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

  submitApplication(
    formData: MerchantApplicationPayload,
  ): Observable<{ application: MerchantApplication; reference_id: string }> {
    return this.http.post<ApiResponse<BackendMerchantApplication>>(`${environment.apiUrl}/company_data`, formData).pipe(
      map((response) => {
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

  getApplications(): Observable<MerchantApplication[]> {
    return this.http
      .get<ApiResponse<BackendMerchantApplication[]>>(`${environment.apiUrl}/api/merchant-applications`)
      .pipe(map((response) => (response.data || []).map((app) => this.transformToMerchantApplication(app))))
  }

  getApplicationsByStatus(status: MerchantApplication["status"]): Observable<MerchantApplication[]> {
    return this.http
      .get<ApiResponse<BackendMerchantApplication[]>>(
        `${environment.apiUrl}/api/merchant-applications?status=${status}`,
      )
      .pipe(map((response) => (response.data || []).map((app) => this.transformToMerchantApplication(app))))
  }

  updateApplicationStatus(
    applicationId: string,
    status: "pending" | "called",
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
