import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MerchantOnboardingData, BusinessType, BusinessCategory, Country } from '../../models/merchant.component';
import { ProgressStepsComponent } from '../../shared/components/progress-steps.component';
import { BusinessInfoStepComponent } from './steps/business-info-step.component';
import { ContactInfoStepComponent } from './steps/contact-info-step.component';
import { DocumentsStepComponent } from './steps/documents-step.component';
import { ReviewStepComponent } from './steps/review-step.component';
import { SuccessDialogComponent } from '../../shared/components/success-dialog.component';
import { FormService } from '../../services/form.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-merchant-onboarding',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ProgressStepsComponent,
    BusinessInfoStepComponent,
    ContactInfoStepComponent,
    DocumentsStepComponent,
    ReviewStepComponent,
    SuccessDialogComponent
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
                Netpay Merchant Onboarding
              </h1>
              <p class="text-gray-600 mt-1">Complete your registration to start accepting payments</p>
            </div>
          </div>

          <!-- Progress Steps -->
          <div class="mt-6">
            <app-progress-steps [steps]="steps()" [activeIndex]="activeIndex()" />
          </div>
        </div>
      </div>

      <!-- Main Form Container -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg border-0 p-6">
          @if (!isLoading()) {
            <!-- Step 1: Business Information -->
            @if (activeIndex() === 0) {
              <app-business-info-step 
                [form]="businessInfoForm" 
                [businessTypes]="businessTypes()" 
                [businessCategories]="businessCategories()" 
                [countries]="countries()"
              />
            }

            <!-- Step 2: Contact Information -->
            @if (activeIndex() === 1) {
              <app-contact-info-step 
                [form]="contactForm" 
              />
            }

            <!-- Step 3: Documents -->
            @if (activeIndex() === 2) {
              <app-documents-step 
                (onFileSelect)="onFileSelect($event)"
                (onFileRemove)="onFileRemove($event)"
              />
            }

            <!-- Step 4: Review -->
            @if (activeIndex() === 3) {
              <app-review-step [data]="formData()" />
            }

            <!-- Navigation Buttons -->
            <div class="flex justify-between mt-8 pt-6 border-t">
              @if (activeIndex() > 0) {
                <button
                  (click)="previousStep()"
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue"
                >
                  Previous
                </button>
              }
              <div></div>
              
              @if (activeIndex() < steps().length - 1) {
                <button
                  (click)="nextStep()"
                  class="px-6 py-2 bg-netpay-primary-blue text-white rounded-md hover:bg-netpay-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue"
                >
                  Next
                </button>
              } @else {
                <button
                  (click)="submitForm()"
                  [disabled]="isSubmitting()"
                  class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
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
        <app-success-dialog 
          [merchantId]="merchantId()" 
          (close)="closeSuccessDialog()" 
        />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOnboardingComponent implements OnInit {
  private formService = inject(FormService);
  private apiService = inject(ApiService);

  // State signals
  readonly activeIndex = signal(0);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly showSuccessDialog = signal(false);
  readonly merchantId = signal('');

  // Computed values
  readonly steps = computed(() => ['Business Info', 'Contact / Personal Info', 'Identity & Verification Docs', 'Review']);
  readonly currentStep = computed(() => this.steps()[this.activeIndex()]);

  // Form groups
  businessInfoForm!: FormGroup;
  contactForm!: FormGroup;

  // Dropdown data
  readonly businessTypes = signal<BusinessType[]>([]);
  readonly businessCategories = signal<BusinessCategory[]>([]);
  readonly countries = signal<Country[]>([]);

  // File management
  readonly uploadedFiles = signal<{ [key: string]: File }>({});

  // Computed form data for review
  readonly formData = computed(() => this.buildFormData());

  ngOnInit() {
    this.initializeForms();
    this.loadDropdownData();
  }

  private initializeForms(): void {
    this.businessInfoForm = this.formService.createBusinessInfoForm();
    this.contactForm = this.formService.createContactForm();
  }

    private loadDropdownData(): void {
    this.isLoading.set(true);

    // Use mock data directly for now (until backend is ready)
    this.businessTypes.set([
      { label: "Sole Proprietorship", value: "sole_prop" },
      { label: "Partnership", value: "partnership" },
      { label: "Limited Liability Company (LLC)", value: "llc" },
      { label: "Corporation", value: "corporation" },
      { label: "Cooperative", value: "cooperative" },
      { label: "Non-Profit", value: "non_profit" }
    ]);

    this.businessCategories.set([
      { label: 'Retail', value: 'retail' },
      { label: 'E-commerce', value: 'ecommerce' },
      { label: 'Restaurant/Food Service', value: 'restaurant' },
      { label: 'Professional Services', value: 'professional_services' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Technology', value: 'technology' },
      { label: 'Manufacturing', value: 'manufacturing' },
      { label: 'Education', value: 'education' },
      { label: 'Other', value: 'other' }
    ]);

    this.countries.set([
      { label: 'United States', value: 'US', code: 'US' },
      { label: 'Canada', value: 'CA', code: 'CA' },
      { label: 'United Kingdom', value: 'GB', code: 'GB' },
      { label: 'Germany', value: 'DE', code: 'DE' },
      { label: 'France', value: 'FR', code: 'FR' },
      { label: 'Australia', value: 'AU', code: 'AU' },
      { label: 'Japan', value: 'JP', code: 'JP' },
      { label: 'Singapore', value: 'SG', code: 'SG' }
    ]);

    this.isLoading.set(false);

    // TODO: When backend is ready, replace above with API calls:
    /*
    this.apiService.getBusinessTypes().subscribe({
      next: (types) => this.businessTypes.set(types),
      error: (error) => {
        console.error('Error loading business types:', error);
        // Fallback to mock data if API fails
        this.businessTypes.set([...mock data...]);
      }
    });
    */
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.activeIndex.update(index => index + 1);
    } else {
      this.markCurrentFormGroupTouched();
    }
  }

  previousStep(): void {
    this.activeIndex.update(index => index - 1);
  }

  private isCurrentStepValid(): boolean {
    switch (this.activeIndex()) {
      case 0: return this.businessInfoForm.valid;
      case 1: return this.contactForm.valid;
      case 2: return true; // Documents are optional
      case 3: return this.isAllFormsValid();
      default: return false;
    }
  }

  private isAllFormsValid(): boolean {
    return this.businessInfoForm.valid && this.contactForm.valid;
  }

  private markCurrentFormGroupTouched(): void {
    const form = this.activeIndex() === 0 ? this.businessInfoForm : this.contactForm;
    this.formService.markFormGroupTouched(form);
  }

  onFileSelect(event: {file: File, type: string}): void {
    this.uploadedFiles.update(files => ({ ...files, [event.type]: event.file }));
  }

  onFileRemove(documentType: string): void {
    this.uploadedFiles.update(files => {
      const newFiles = { ...files };
      delete newFiles[documentType];
      return newFiles;
    });
  }

  submitForm(): void {
    if (!this.isAllFormsValid()) return;

    this.isSubmitting.set(true);

    // Mock form submission (replace with real API when backend is ready)
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.merchantId.set('MERCH_' + Date.now());
      this.showSuccessDialog.set(true);
    }, 2000); // Simulate 2-second API call

    // TODO: When backend is ready, replace above with real API call:
    /*
    const formData = this.buildFormData();
    this.apiService.submitMerchantApplication(formData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.merchantId.set(response.merchantId || 'MERCH_' + Date.now());
        this.showSuccessDialog.set(true);
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.isSubmitting.set(false);
        alert('Error submitting application. Please try again.');
      }
    });
    */
  }

  private buildFormData(): MerchantOnboardingData {
    return {
      businessName: this.businessInfoForm.get('businessName')?.value,
      businessType: this.businessInfoForm.get('businessType')?.value,
      businessCategory: this.businessInfoForm.get('businessCategory')?.value,
      registrationNumber: this.businessInfoForm.get('registrationNumber')?.value,
      taxId: '',
      yearEstablished: this.businessInfoForm.get('yearEstablished')?.value,
      businessAddress: {
        street: this.businessInfoForm.get('address')?.value,
        city: '',
        state: '',
        postalCode: '',
        country: this.businessInfoForm.get('country')?.value,
      },
      contactPerson: {
        firstName: this.contactForm.get('firstName')?.value,
        lastName: this.contactForm.get('lastName')?.value,
        position: this.contactForm.get('position')?.value,
        email: this.contactForm.get('email')?.value,
        phone: this.contactForm.get('phone')?.value,
        alternatePhone: this.contactForm.get('alternatePhone')?.value || '',
      },
      bankingDetails: { bankName: '', accountNumber: '', routingNumber: '', accountType: '', accountHolderName: '' },
      documents: {
        businessLicense: this.uploadedFiles()['businessLicense'],
        identityDocument: this.uploadedFiles()['validId'],
      },
      agreements: { termsAccepted: true, privacyPolicyAccepted: true, processingAgreementAccepted: true, marketingConsent: false },
    };
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog.set(false);
    this.resetForm();
  }

  private resetForm(): void {
    this.businessInfoForm.reset();
    this.contactForm.reset();
    this.uploadedFiles.set({});
    this.activeIndex.set(0);
  }
}
