import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusinessInfoStepComponent } from './steps/business-info-step.component';
import { SuccessDialogComponent } from '../../shared/components/success-dialog.component';
import { FormService } from './services/form.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-merchant-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BusinessInfoStepComponent, SuccessDialogComponent],
  template: `
    <div class="min-h-screen bg-netpay-light-gray py-4 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="text-center bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-4">
              <img src="images/ngsi-logo.png" alt="Netpay Logo" class="w-12 h-12" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-netpay-dark-blue">
                NetPay Merchant Onboarding
              </h1>
              <p class="text-gray-600 mt-1">
                Complete your registration to start accepting payments
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Container -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg border-0 p-6">
          @if (!isLoading()) {
          <!-- Business Information Form -->
          <app-business-info-step [form]="businessInfoForm" />

          <!-- Submit Button -->
          <div class="flex justify-center mt-8 pt-6 border-t">
            <button
              (click)="submitForm()"
              [disabled]="isSubmitting() || !businessInfoForm.valid"
              class="px-8 py-3 bg-netpay-primary-blue text-white rounded-md hover:bg-netpay-accent-blue focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {{ isSubmitting() ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
          }
        </div>
      </div>

      <!-- Success Dialog -->
      @if (showSuccessDialog()) {
      <app-success-dialog [merchantId]="merchantId()" (close)="closeSuccessDialog()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOnboardingComponent implements OnInit {
  private formService = inject(FormService);
  private applicationService = inject(ApplicationService);

  // State signals
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly showSuccessDialog = signal(false);
  readonly merchantId = signal('');

  // Form group
  businessInfoForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.businessInfoForm = this.formService.createBusinessInfoForm();
  }

  submitForm(): void {
    if (!this.businessInfoForm.valid) return;

    this.isSubmitting.set(true);

    const formData = this.buildFormData();

    this.applicationService.submitApplication(formData).subscribe({
      next: (application) => {
        this.isSubmitting.set(false);
        this.merchantId.set(application.id);
        this.showSuccessDialog.set(true);
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.isSubmitting.set(false);
        alert('Error submitting application. Please try again.');
      },
    });
  }

  private buildFormData(): any {
    return {
      representativeName: this.businessInfoForm.get('representativeName')?.value,
      positionTitle: this.businessInfoForm.get('positionTitle')?.value,
      companyName: this.businessInfoForm.get('companyName')?.value,
      emailAddress: this.businessInfoForm.get('emailAddress')?.value,
      mobileNumber: this.businessInfoForm.get('mobileNumber')?.value,
    };
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.businessInfoForm.reset();
  }
}
