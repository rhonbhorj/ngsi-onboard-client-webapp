import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MerchantApplication {
  id: string;
  representativeName: string;
  positionTitle: string;
  companyName: string;
  emailAddress: string;
  mobileNumber: string;
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
        representativeName: 'Ritchmond Tajarros',
        positionTitle: 'Front-End Web Developer',
        companyName: 'NetGlobal Solutions Inc',
        emailAddress: 'tajarrosrj@gmail.com',
        mobileNumber: '09177589353',
        status: 'pending',
        submittedAt: '2025-08-15T10:30:00Z',
      },
      {
        id: 'app_002',
        representativeName: 'Raven David',
        positionTitle: 'Back-End Web Developer',
        companyName: 'NetGlobal Solutions Inc',
        emailAddress: 'ravendavid@gmail.com',
        mobileNumber: '09123456789',
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
