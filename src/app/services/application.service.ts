import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MerchantApplication {
  id: string;
  // Step 1: Basic Business Information
  registeredByName: string;
  registeredByContact: string;
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  businessWebsite?: string;
  industryOrBusinessStyle: string;
  telephoneNo?: string;
  typeOfBusiness: string;
  contactPerson: string;
  contactNumber: string;
  sameAsRegisteredBy: boolean;

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

  constructor() {
    // Initialize with some mock data
    this.applications.set([
      {
        id: 'app_001',
        registeredByName: 'Ritchmond Tajarros',
        registeredByContact: '09177589353',
        businessName: 'NetGlobal Solutions Inc',
        businessEmail: 'tajarrosrj@gmail.com',
        businessAddress: '123 Business Street, Metro Manila, Philippines',
        businessWebsite: 'https://netglobal.com',
        industryOrBusinessStyle: 'Technology Solutions',
        telephoneNo: '02-1234-5678',
        typeOfBusiness: 'Corporation',
        contactPerson: 'Ritchmond Tajarros',
        contactNumber: '09177589353',
        sameAsRegisteredBy: true,
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
        registeredByName: 'Raven David',
        registeredByContact: '09123456789',
        businessName: 'NetGlobal Solutions Inc',
        businessEmail: 'ravendavid@gmail.com',
        businessAddress: '456 Tech Avenue, Cebu City, Philippines',
        businessWebsite: 'https://netglobal.com',
        industryOrBusinessStyle: 'Software Development',
        telephoneNo: '032-9876-5432',
        typeOfBusiness: 'Corporation',
        contactPerson: 'Raven David',
        contactNumber: '09123456789',
        sameAsRegisteredBy: true,
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

  // Submit new application from form
  submitApplication(
    formData: Omit<MerchantApplication, 'id' | 'status' | 'submittedAt'>
  ): Observable<MerchantApplication> {
    const newApplication: MerchantApplication = {
      ...formData,
      id: 'app_' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const currentApplications = this.applications();
    this.applications.set([newApplication, ...currentApplications]);

    return of(newApplication);
  }

  // Get all applications for admin dashboard
  getApplications(): Observable<MerchantApplication[]> {
    return of(this.applications());
  }

  // Update application status (admin action)
  updateApplicationStatus(
    applicationId: string,
    status: MerchantApplication['status'],
    notes?: string
  ): void {
    const currentApplications = this.applications();
    const appIndex = currentApplications.findIndex((app) => app.id === applicationId);

    if (appIndex !== -1) {
      const updatedApp = {
        ...currentApplications[appIndex],
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin_001',
        notes,
      };

      currentApplications[appIndex] = updatedApp;
      this.applications.set([...currentApplications]);
    }
  }

  // Get applications by status
  getApplicationsByStatus(
    status: MerchantApplication['status']
  ): Observable<MerchantApplication[]> {
    const filtered = this.applications().filter((app) => app.status === status);
    return of(filtered);
  }
}
