import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusinessInfoStepComponent } from './steps/business-info-step.component';
import { PaymentDetailsStepComponent } from './steps/payment-details-step.component';
import { SuccessDialogComponent } from '../../shared/components/success-dialog.component';
import { FormService } from './services/form.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-merchant-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BusinessInfoStepComponent,
    PaymentDetailsStepComponent,
    SuccessDialogComponent,
  ],
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

      <!-- Step Indicator -->
      <div class="max-w-4xl mx-auto mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="flex items-center justify-center space-x-8">
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                [class]="
                  currentStep() >= 1
                    ? 'bg-netpay-primary-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                "
              >
                1
              </div>
              <span
                class="ml-2 text-sm font-medium"
                [class]="currentStep() >= 1 ? 'text-netpay-dark-blue' : 'text-gray-500'"
              >
                Business Information
              </span>
            </div>
            <div class="w-16 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                [class]="
                  currentStep() >= 2
                    ? 'bg-netpay-primary-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                "
              >
                2
              </div>
              <span
                class="ml-2 text-sm font-medium"
                [class]="currentStep() >= 2 ? 'text-netpay-dark-blue' : 'text-gray-500'"
              >
                Payment Details
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Container -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg border-0 p-6">
          @if (!isLoading()) {
          <!-- Step 1: Business Information -->
          @if (currentStep() === 1) {
          <app-business-info-step [form]="businessInfoForm" />
          }

          <!-- Step 2: Payment Details -->
          @if (currentStep() === 2) {
          <app-payment-details-step [form]="businessInfoForm" />
          }

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8 pt-6 border-t">
            @if (currentStep() > 1) {
            <button
              (click)="previousStep()"
              class="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Previous
            </button>
            } @else {
            <div></div>
            } @if (currentStep() < 2) {
            <button
              (click)="nextStep()"
              [disabled]="!isStepValid()"
              class="px-6 py-3 bg-netpay-primary-blue text-white rounded-md hover:bg-netpay-accent-blue focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
            } @else {
            <button
              (click)="submitForm()"
              [disabled]="isSubmitting() || !businessInfoForm.valid"
              class="px-8 py-3 bg-netpay-primary-blue text-white rounded-md hover:bg-netpay-accent-blue focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transition-colors"
            >
              {{ isSubmitting() ? 'Submitting...' : 'Submit Application' }}
            </button>
            }
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
  readonly currentStep = signal(1);

  // Form group
  businessInfoForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.businessInfoForm = this.formService.createBusinessInfoForm();
  }

  nextStep(): void {
    if (this.isStepValid() && this.currentStep() < 2) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  isStepValid(): boolean {
    if (this.currentStep() === 1) {
      // Check if required fields in step 1 are valid
      const step1Fields = [
        'registeredByName',
        'registeredByContact',
        'businessName',
        'businessEmail',
        'businessAddress',
        'industryOrBusinessStyle',
        'typeOfBusiness',
        'contactPerson',
        'contactNumber',
      ];
      return step1Fields.every((field) => this.businessInfoForm.get(field)?.valid);
    }
    return true;
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
    const formValue = this.businessInfoForm.value;
    return {
      registeredByName: formValue.registeredByName,
      registeredByContact: formValue.registeredByContact,
      businessName: formValue.businessName,
      businessEmail: formValue.businessEmail,
      businessAddress: formValue.businessAddress,
      businessWebsite: formValue.businessWebsite,
      industryOrBusinessStyle: formValue.industryOrBusinessStyle,
      telephoneNo: formValue.telephoneNo,
      typeOfBusiness: formValue.typeOfBusiness,
      contactPerson: formValue.contactPerson,
      contactNumber: formValue.contactNumber,
      sameAsRegisteredBy: formValue.sameAsRegisteredBy,
      hasExistingPaymentPortal: formValue.hasExistingPaymentPortal,
      currentModeOfPayment: formValue.currentModeOfPayment,
      estimatedTransactionNumbers: formValue.estimatedTransactionNumbers,
      estimatedAverageAmount: formValue.estimatedAverageAmount,
    };
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.businessInfoForm.reset();
    this.currentStep.set(1);
  }
}
