import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminNotification } from '../models/admin.model';
import { ApplicationService, MerchantApplication } from '../../../services/application.service';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  // Mock notifications
  readonly notifications = signal<AdminNotification[]>([]);

  constructor(private applicationService: ApplicationService) {
    this.loadNotifications();
  }

  getRecentApplications(): Observable<MerchantApplication[]> {
    return this.applicationService.getApplications();
  }

  getNotifications(): Observable<AdminNotification[]> {
    return of(this.notifications());
  }

  updateApplicationStatus(
    applicationId: string,
    status: MerchantApplication['status'],
    notes?: string
  ): void {
    this.applicationService.updateApplicationStatus(applicationId, status, notes);

    // Add notification
    this.addNotification({
      id: 'notif_' + Date.now(),
      type: 'status_change',
      title: 'Application Status Updated',
      message: `Application ${applicationId} status changed to ${status}`,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: `/admin/applications/${applicationId}`,
    });
  }

  private loadNotifications(): void {
    const mockNotifications: AdminNotification[] = [
      {
        id: 'notif_001',
        type: 'new_application',
        title: 'New Application Received',
        message: 'New merchant application submitted by Tech Solutions Inc.',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
        actionUrl: '/admin/applications/app_001',
      },
      {
        id: 'notif_002',
        type: 'status_change',
        title: 'Application Approved',
        message: 'Application from Innovation Corp has been approved',
        timestamp: '2024-01-15T09:15:00Z',
        read: false,
        actionUrl: '/admin/applications/app_002',
      },
    ];

    this.notifications.set(mockNotifications);
  }

  private addNotification(notification: AdminNotification): void {
    const currentNotifications = this.notifications();
    this.notifications.set([notification, ...currentNotifications]);
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.notifications();
    const notificationIndex = notifications.findIndex((n) => n.id === notificationId);

    if (notificationIndex !== -1) {
      notifications[notificationIndex] = { ...notifications[notificationIndex], read: true };
      this.notifications.set([...notifications]);
    }
  }
}
