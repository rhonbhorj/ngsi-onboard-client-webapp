import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface MerchantApplication {
  id: string;
  reference?: string;
  // Step 1: Business Information
  contactPersonName: string;
  contactNumber: string;
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  industryOrBusinessStyle: string;
  telephoneNo?: string;
  typeOfBusiness: 'Sole Proprietorship' | 'Partnership' | 'Corporation' | 'Others';

  // Step 2: Payment & Transaction Details
  hasExistingPaymentPortal: string;
  currentModeOfPayment: {
    cash: boolean;
    eWallets: boolean;
    qrph: boolean;
    cardPayment: boolean;
  };
  estimatedTransactionNumbers?: string;
  estimatedAverageAmount?: string;

  // System fields
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  // Shared applications data
  private readonly applications = signal<MerchantApplication[]>([]);

  constructor(private http: HttpClient) {
    // Initialize with some mock data
    this.applications.set([
      {
        id: 'app_001',
        reference: 'ngsi-25-00001',
        contactPersonName: 'Ritchmond Tajarros',
        contactNumber: '09177589353',
        businessName: 'NetGlobal Solutions Inc',
        businessEmail: 'tajarrosrj@gmail.com',
        businessAddress: '123 Business Street, Metro Manila, Philippines',
        industryOrBusinessStyle: 'Technology Solutions',
        telephoneNo: '02-1234-5678',
        typeOfBusiness: 'Corporation',
        hasExistingPaymentPortal: 'NO',
        currentModeOfPayment: {
          cash: false,
          eWallets: true,
          qrph: false,
          cardPayment: true,
        },
        estimatedTransactionNumbers: '51 – 100',
        estimatedAverageAmount: '10,001 – 50,000',
        status: 'pending',
        submittedAt: '2025-08-15T10:30:00Z',
      },
      {
        id: 'app_002',
        reference: 'ngsi-25-00002',
        contactPersonName: 'Raven David',
        contactNumber: '09123456789',
        businessName: 'NetGlobal Solutions Inc',
        businessEmail: 'ravendavid@gmail.com',
        businessAddress: '456 Tech Avenue, Cebu City, Philippines',
        industryOrBusinessStyle: 'Software Development',
        telephoneNo: '032-9876-5432',
        typeOfBusiness: 'Corporation',
        hasExistingPaymentPortal: 'YES',
        currentModeOfPayment: {
          cash: true,
          eWallets: true,
          qrph: true,
          cardPayment: true,
        },
        estimatedTransactionNumbers: 'ABOVE 100',
        estimatedAverageAmount: 'ABOVE 50,000',
        status: 'approved',
        submittedAt: '2025-08-21T14:20:00Z',
        reviewedAt: '2025-08-21T09:15:00Z',
        reviewedBy: 'admin_001',
      },
    ]);
  }

  // Submit new application from form TO BACKEND
  submitApplication(
    formData: Omit<MerchantApplication, 'id' | 'status' | 'submittedAt'>
  ): Observable<MerchantApplication> {
    // Send to backend API
    return this.http.post<MerchantApplication>(
      `${environment.apiUrl}/api/merchant-applications`,
      formData
    );
  }

  // Get all applications from backend
  getApplications(): Observable<MerchantApplication[]> {
    return this.http.get<MerchantApplication[]>(
      `${environment.apiUrl}/api/merchant-applications`
    );
  }

  // Update application status via backend
  updateApplicationStatus(
    applicationId: string,
    status: MerchantApplication['status'],
    notes?: string
  ): Observable<MerchantApplication> {
    return this.http.patch<MerchantApplication>(
      `${environment.apiUrl}/api/merchant-applications/${applicationId}`,
      { status, notes }
    );
  }

  // Get applications by status from backend
  getApplicationsByStatus(
    status: MerchantApplication['status']
  ): Observable<MerchantApplication[]> {
    return this.http.get<MerchantApplication[]>(
      `${environment.apiUrl}/api/merchant-applications?status=${status}`
    );
  }
}
