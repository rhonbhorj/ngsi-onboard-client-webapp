import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { MerchantApplication } from '../../../services/application.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AdminAuthService);
  private dashboardService = inject(AdminDashboardService);
  private router = inject(Router);

  // Dashboard data
  readonly allApplications = signal<MerchantApplication[]>([]);
  readonly filteredApplications = signal<MerchantApplication[]>([]);
  readonly isLoading = signal(false);
  readonly searchTerm: WritableSignal<string> = signal('');

  ngOnInit() {
    this.checkAuth();
    this.loadDashboardData();
  }

  private checkAuth(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
    }
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);

    // Load all applications
    this.dashboardService.getRecentApplications().subscribe({
      next: (applications) => {
        this.allApplications.set(applications);
        this.filteredApplications.set(applications);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading.set(false);
      },
    });
  }

  onSearchChange(searchValue: string): void {
    this.searchTerm.set(searchValue);
    this.filterApplications();
  }

  private filterApplications(): void {
    const searchTerm = this.searchTerm().toLowerCase().trim();

    if (!searchTerm) {
      this.filteredApplications.set(this.allApplications());
      return;
    }

    const filtered = this.allApplications().filter(
      (application) =>
        application.id.toLowerCase().includes(searchTerm) ||
        application.contactPerson.toLowerCase().includes(searchTerm) ||
        application.businessName.toLowerCase().includes(searchTerm) ||
        application.businessEmail.toLowerCase().includes(searchTerm) ||
        application.contactNumber.toLowerCase().includes(searchTerm) ||
        application.industryOrBusinessStyle.toLowerCase().includes(searchTerm)
    );

    this.filteredApplications.set(filtered);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
