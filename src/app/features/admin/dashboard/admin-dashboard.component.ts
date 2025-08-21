import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { MerchantApplication, AdminNotification } from '../models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AdminAuthService);
  private dashboardService = inject(AdminDashboardService);
  private router = inject(Router);

  // State signals
  readonly merchantApplications = signal<MerchantApplication[]>([]);
  readonly filteredApplications = signal<MerchantApplication[]>([]);
  readonly notifications = signal<AdminNotification[]>([]);
  readonly showNotifications = signal(false);
  readonly searchQuery = signal('');

  readonly currentUser = computed(() => this.authService.getCurrentUser());
  readonly unreadNotificationsCount = computed(() => 
    this.notifications().filter(n => !n.isRead).length
  );

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadDashboardData();
  }

  toggleNotifications(): void {
    this.showNotifications.update(show => !show);
  }

  markNotificationAsRead(notificationId: string): void {
    this.dashboardService.markNotificationAsRead(notificationId);
    this.showNotifications.set(false);
  }

  logout(): void {
    this.authService.logout();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.filterApplications();
  }

  private filterApplications(): void {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      this.filteredApplications.set(this.merchantApplications());
      return;
    }

    const filtered = this.merchantApplications().filter(application => 
      application.referenceNumber?.toLowerCase().includes(query) ||
      application.businessName.toLowerCase().includes(query) ||
      application.contactPerson.firstName.toLowerCase().includes(query) ||
      application.contactPerson.lastName.toLowerCase().includes(query) ||
      application.contactPerson.email.toLowerCase().includes(query)
    );

    this.filteredApplications.set(filtered);
  }

  private loadDashboardData(): void {
    this.dashboardService.getMerchantApplications().subscribe(applications => {
      this.merchantApplications.set(applications);
      this.filteredApplications.set(applications);
    });

    this.dashboardService.getNotifications().subscribe(notifications => {
      this.notifications.set(notifications);
    });
  }
}
