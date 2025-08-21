import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MerchantApplication, AdminNotification } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  // Mock data signals
  readonly merchantApplications = signal<MerchantApplication[]>([]);
  readonly notifications = signal<AdminNotification[]>([]);

  constructor() {
    this.loadMockData();
  }

  getMerchantApplications(): Observable<MerchantApplication[]> {
    return of(this.merchantApplications()).pipe(delay(800));
  }

  getNotifications(): Observable<AdminNotification[]> {
    return of(this.notifications()).pipe(delay(300));
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.notifications();
    const notifIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notifIndex !== -1) {
      notifications[notifIndex].isRead = true;
      this.notifications.set([...notifications]);
    }
  }

  private loadMockData(): void {
    // Mock merchant applications
    this.merchantApplications.set([
      {
        id: 'app_001',
        referenceNumber: 'REF-2025-001',
        businessName: 'TechStart Solutions',
        businessType: 'llc',
        businessCategory: 'technology',
        status: 'pending',
        submittedDate: new Date('2025-01-20'),
        contactPerson: {
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex@techstart.com',
          phone: '+1-555-0123'
        },
        estimatedRevenue: 500000,
        documents: {
          businessLicense: true,
          taxCertificate: true,
          bankStatement: true,
          identityDocument: true
        }
      },
      {
        id: 'app_002',
        referenceNumber: 'REF-2025-002',
        businessName: 'Green Earth Cafe',
        businessType: 'corporation',
        businessCategory: 'restaurant',
        status: 'under_review',
        submittedDate: new Date('2025-01-19'),
        contactPerson: {
          firstName: 'Maria',
          lastName: 'Garcia',
          email: 'maria@greenearth.com',
          phone: '+1-555-0456'
        },
        estimatedRevenue: 350000,
        documents: {
          businessLicense: true,
          taxCertificate: true,
          bankStatement: false,
          identityDocument: true
        }
      },
      {
        id: 'app_003',
        referenceNumber: 'REF-2025-003',
        businessName: 'Urban Fitness Studio',
        businessType: 'sole_prop',
        businessCategory: 'healthcare',
        status: 'approved',
        submittedDate: new Date('2025-01-18'),
        contactPerson: {
          firstName: 'David',
          lastName: 'Chen',
          email: 'david@urbanfitness.com',
          phone: '+1-555-0789'
        },
        estimatedRevenue: 180000,
        documents: {
          businessLicense: true,
          taxCertificate: true,
          bankStatement: true,
          identityDocument: true
        }
      },
      {
        id: 'app_004',
        referenceNumber: 'REF-2025-004',
        businessName: 'Digital Marketing Pro',
        businessType: 'llc',
        businessCategory: 'professional_services',
        status: 'pending',
        submittedDate: new Date('2025-01-17'),
        contactPerson: {
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah@digitalmarketingpro.com',
          phone: '+1-555-0321'
        },
        estimatedRevenue: 420000,
        documents: {
          businessLicense: true,
          taxCertificate: true,
          bankStatement: true,
          identityDocument: true
        }
      },
      {
        id: 'app_005',
        referenceNumber: 'REF-2025-005',
        businessName: 'EcoTech Manufacturing',
        businessType: 'corporation',
        businessCategory: 'manufacturing',
        status: 'rejected',
        submittedDate: new Date('2025-01-16'),
        contactPerson: {
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael@ecotech.com',
          phone: '+1-555-0654'
        },
        estimatedRevenue: 1200000,
        documents: {
          businessLicense: false,
          taxCertificate: true,
          bankStatement: true,
          identityDocument: true
        }
      }
    ]);

    // // Mock notifications
    // this.notifications.set([
    //   {
    //     id: 'notif_001',
    //     type: 'warning',
    //     title: 'Document Verification Required',
    //     message: '3 applications require additional document verification',
    //     timestamp: new Date('2025-01-21T10:30:00'),
    //     isRead: false,
    //     actionUrl: '/admin/applications'
    //   },
    //   {
    //     id: 'notif_002',
    //     type: 'info',
    //     title: 'New Application Submitted',
    //     message: 'TechStart Solutions has submitted a new application',
    //     timestamp: new Date('2025-01-21T09:15:00'),
    //     isRead: false,
    //     actionUrl: '/admin/applications/app_001'
    //   },
    //   {
    //     id: 'notif_003',
    //     type: 'success',
    //     title: 'Monthly Target Achieved',
    //     message: 'Congratulations! You have exceeded this month\'s approval target',
    //     timestamp: new Date('2025-01-21T08:00:00'),
    //     isRead: true
    //   }
    // ]);
  }

  // TODO: Replace with real API calls when backend is ready
  /*
  getMerchantApplications(): Observable<MerchantApplication[]> {
    return this.http.get<MerchantApplication[]>(`${this.apiUrl}/admin/applications`);
  }

  getNotifications(): Observable<AdminNotification[]> {
    return this.http.get<AdminNotification[]>(`${this.apiUrl}/admin/notifications`);
  }
  */
}
