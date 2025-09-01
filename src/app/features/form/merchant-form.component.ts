import { Component, type OnInit, signal, inject, ChangeDetectionStrategy } from "@angular/core"
import { type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { BusinessInfoStepComponent } from "./steps/business-info-step.component"
import { PaymentDetailsStepComponent } from "./steps/payment-details-step.component"
import { ReviewInformationStepComponent } from "./steps/review-information-step.component"
import { SuccessDialogComponent } from "../../shared/components/success-dialog.component"
import { FormService } from "./services/form.service"
import { ApplicationService } from "../../services/application.service"

@Component({
  selector: "app-merchant-onboarding",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BusinessInfoStepComponent,
    PaymentDetailsStepComponent,
    ReviewInformationStepComponent,
    SuccessDialogComponent,
  ],
  template: `
    <!-- Enhanced responsive layout with better mobile spacing and typography -->
    <div class="min-h-screen bg-netpay-light-gray py-2 sm:py-4 px-2 sm:px-4 md:px-6 lg:px-8">
      <!-- Header -->
      <div class="max-w-4xl mx-auto mb-4 sm:mb-8">
        <div class="text-center bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
          <div class="flex flex-col sm:flex-row items-center justify-center mb-2 sm:mb-4">
            <div class="w-16 h-16 sm:w-30 sm:h-30 rounded-lg flex items-center justify-center mb-2 sm:mb-0 sm:mr-4">
              <img src="images/ngsi-logo.png" alt="Netpay Logo" class="w-16 h-16 sm:w-30 sm:h-30" />
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-netpay-dark-blue">
                NetPay Merchant Onboarding
              </h1>
              <p class="text-sm sm:text-base text-gray-600 mt-1">
                Complete your registration to start accepting payments
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="max-w-4xl mx-auto mb-4 sm:mb-6">
        <div class="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
          <!-- Mobile-first step indicator with responsive layout -->
          <div class="flex items-center justify-center space-x-2 sm:hidden">
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
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
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
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
              [class]="
                currentStep() >= 3
                  ? 'bg-netpay-primary-blue text-white'
                  : 'bg-gray-200 text-gray-500'
              "
            >
              3
            </div>
          </div>
          <div class="hidden sm:flex flex-row items-center justify-center space-x-4 md:space-x-8">
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
            <div class="w-8 md:w-16 h-0.5 bg-gray-300"></div>
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
            <div class="w-8 md:w-16 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                [class]="
                  currentStep() >= 3
                    ? 'bg-netpay-primary-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                "
              >
                3
              </div>
              <span
                class="ml-2 text-sm font-medium"
                [class]="currentStep() >= 3 ? 'text-netpay-dark-blue' : 'text-gray-500'"
              >
                Review Information
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Container -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg border-0 p-3 sm:p-6">
          @if (!isLoading()) {
          <!-- Step 1: Business Information -->
          @if (currentStep() === 1) {
          <app-business-info-step [form]="businessInfoForm" />
          }

          <!-- Step 2: Payment Details -->
          @if (currentStep() === 2) {
          <app-payment-details-step [form]="businessInfoForm" />
          }

          <!-- Step 3: Review Information -->
          @if (currentStep() === 3) {
          <app-review-information-step [form]="businessInfoForm" />
          }

          <!-- Navigation Buttons -->
          <div class="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t space-y-3 sm:space-y-0">
            @if (currentStep() > 1) {
            <button
              (click)="previousStep()"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm sm:text-base"
            >
              Previous
            </button>
            } @else {
            <div class="hidden sm:block"></div>
            } 
            @if (currentStep() < 3) {
            <button
              (click)="nextStep()"
              [disabled]="!isStepValid()"
              class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-netpay-primary-blue text-white rounded-md hover:bg-netpay-accent-blue focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              Next
            </button>
            } @else {
            <button
              (click)="submitForm()"
              [disabled]="isSubmitting() || !businessInfoForm.valid"
              class="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-netpay-primary-blue text-white rounded-md hover:bg-netpay-accent-blue focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              style="color: white;"
            >
              {{ getSubmitButtonText() }}
            </button>
            }
          </div>
          }
        </div>
      </div>

      <!-- Success Dialog -->
      @if (showSuccessDialog()) {
        <app-success-dialog [referenceNo]="referenceNo()" (close)="closeSuccessDialog()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOnboardingComponent implements OnInit {
  private formService = inject(FormService)
  private applicationService = inject(ApplicationService)

  // State signals
  readonly isLoading = signal(false)
  readonly isSubmitting = signal(false)
  readonly showSuccessDialog = signal(false)
  readonly referenceNo = signal("")
  readonly currentStep = signal(1)

  // Form group
  businessInfoForm!: FormGroup

  // Method to get submit button text
  getSubmitButtonText(): string {
    return this.isSubmitting() ? "Submitting..." : "Submit Application"
  }

  ngOnInit() {
    this.initializeForm()
    this.loadSavedData()
  }

  private initializeForm(): void {
    this.businessInfoForm = this.formService.createBusinessInfoForm()

    // Auto-save form changes
    this.businessInfoForm.valueChanges.subscribe(() => {
      this.saveFormData()
    })
  }

  // Auto-save form data to localStorage
  private saveFormData(): void {
    const formData = {
      step: this.currentStep(),
      formValues: this.businessInfoForm.value,
    }
    localStorage.setItem("merchant_form_data", JSON.stringify(formData))
  }

  // Load saved form data from localStorage
  private loadSavedData(): void {
    const savedData = localStorage.getItem("merchant_form_data")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.step) {
          this.currentStep.set(data.step)
        }
        if (data.formValues) {
          this.businessInfoForm.patchValue(data.formValues)
        }
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }

  // Clear saved form data
  private clearSavedData(): void {
    localStorage.removeItem("merchant_form_data")
  }

  nextStep(): void {
    if (this.isStepValid() && this.currentStep() < 3) {
      this.currentStep.set(this.currentStep() + 1)
      this.saveFormData()
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1)
      this.saveFormData()
    }
  }

  isStepValid(): boolean {
    if (this.currentStep() === 1) {
      const step1Fields = [
        "contactPersonName",
        "contactNumber",
        "businessName",
        "businessEmail",
        "businessAddress",
        "industryOrBusinessStyle",
        "typeOfBusiness",
      ]
      return step1Fields.every((field) => this.businessInfoForm.get(field)?.valid)
    } else if (this.currentStep() === 2) {
      // Payment details step validation - at least one payment mode should be selected
      const paymentModes = this.businessInfoForm.get("currentModeOfPayment")?.value
      const hasPaymentMode = paymentModes && Object.values(paymentModes).some((mode: any) => mode === true)
      const hasPaymentPortal = this.businessInfoForm.get("hasExistingPaymentPortal")?.value
      const hasTransactionNumbers = this.businessInfoForm.get("estimatedTransactionNumbers")?.value
      const hasAverageAmount = this.businessInfoForm.get("estimatedAverageAmount")?.value

      return !!(hasPaymentPortal && hasPaymentMode && hasTransactionNumbers && hasAverageAmount)
    }
    return true
  }

  submitForm(): void {
    if (!this.businessInfoForm.valid) return

    this.isSubmitting.set(true)

    const formData = this.buildFormData()

    this.applicationService.submitApplication(formData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false)
        this.referenceNo.set(response.reference_id)
        this.showSuccessDialog.set(true)
        this.clearSavedData() // Clear saved data after successful submission
      },
      error: (error) => {
        console.error("Error submitting application:", error)
        this.isSubmitting.set(false)
        alert("Error submitting application. Please try again.")
      },
    })
  }

  private buildFormData(): any {
    const formValue = this.businessInfoForm.value
    return {
      contactPersonName: formValue.contactPersonName,
      contactNumber: formValue.contactNumber,
      businessName: formValue.businessName,
      businessEmail: formValue.businessEmail,
      businessAddress: formValue.businessAddress,
      industryOrBusinessStyle: formValue.industryOrBusinessStyle,
      telephoneNo: formValue.telephoneNo,
      typeOfBusiness: formValue.typeOfBusiness,
      hasExistingPaymentPortal: formValue.hasExistingPaymentPortal,
      currentModeOfPayment: formValue.currentModeOfPayment,
      estimatedTransactionNumbers: formValue.estimatedTransactionNumbers,
      estimatedAverageAmount: formValue.estimatedAverageAmount,
    }
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog.set(false)
    this.resetForm()
  }

  private resetForm(): void {
    this.businessInfoForm.reset()
    this.currentStep.set(1)
  }
}
