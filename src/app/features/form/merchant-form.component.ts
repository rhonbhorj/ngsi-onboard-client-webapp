import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, computed, inject, signal, type OnInit } from "@angular/core"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { FormBuilder, Validators, type AbstractControl, type FormGroup, type ValidationErrors, ReactiveFormsModule } from "@angular/forms"
import { CommonModule, NgOptimizedImage } from "@angular/common"
import { BusinessInfoStepComponent } from "./steps/business-info-step.component"
import { PaymentDetailsStepComponent } from "./steps/payment-details-step.component"
import { ReviewInformationStepComponent } from "./steps/review-information-step.component"
import { SuccessDialogComponent } from "./components/success-dialog.component"
import { ApplicationService } from "./application.service"
import { catchError, debounceTime, map, of, switchMap, type Observable } from "rxjs"
import type { MerchantApplicationPayload, PaymentMode } from "./models/merchant-application.model"

@Component({
  selector: "app-merchant-onboarding",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BusinessInfoStepComponent,
    PaymentDetailsStepComponent,
    ReviewInformationStepComponent,
    SuccessDialogComponent,
  ],
  templateUrl: "./merchant-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOnboardingComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  private readonly fb = inject(FormBuilder)
  private readonly applicationService = inject(ApplicationService)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly storageKey = "merchant_form_data"
  private isRestoringData = false

  private readonly contactNumberAsyncValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (this.isRestoringData || !control.value || control.value.length < 10) {
      return of(null)
    }

    return of(control.value).pipe(
      debounceTime(300),
      switchMap((contactNumber) =>
        this.applicationService.checkContactNumberExists(contactNumber).pipe(
          map((exists) => (exists ? { contactNumberExists: true } : null)),
          catchError(() => of(null)),
        ),
      ),
    )
  }

  private createBusinessInfoForm(): FormGroup {
    return this.fb.group({
      contactPersonName: ["", [Validators.required, Validators.minLength(2)]],
      registeredByContactNumber: [
        "",
        [Validators.required, Validators.pattern(/^9\d{9}$/)],
        [this.contactNumberAsyncValidator],
      ],
      contactNumber: ["", [Validators.required, Validators.pattern(/^9\d{9}$/)], [this.contactNumberAsyncValidator]],
      contactPerson: ["", [Validators.required, Validators.minLength(2)]],
      sameAsRegisteredBy: [false],
      businessName: ["", [Validators.required, Validators.minLength(2)]],
      businessEmail: ["", [Validators.required, Validators.email]],
      businessAddress: ["", [Validators.required, Validators.minLength(10)]],
      telephoneNo: [""],
      hasExistingPaymentPortal: [""],
      currentModeOfPayment: this.fb.group({
        cash: [false],
        eWallets: [false],
        qrph: [false],
        cardPayment: [false],
      }),
      estimatedTransactionNumbers: [""],
      estimatedAverageAmount: [""],
    })
  }

  // State signals
  readonly isLoading = signal(false)
  readonly isSubmitting = signal(false)
  readonly showSuccessDialog = signal(false)
  readonly referenceNo = signal("")
  readonly currentStep = signal(1)
  readonly submitButtonText = computed(() => (this.isSubmitting() ? "Submitting..." : "Submit Application"))

  // Form group
  businessInfoForm!: FormGroup

  ngOnInit() {
    this.initializeForm()
    setTimeout(() => {
      this.loadSavedData()
    }, 0)
  }

  private initializeForm(): void {
    this.businessInfoForm = this.createBusinessInfoForm()

    this.businessInfoForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.markForCheck()
    })

    this.businessInfoForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.saveFormData()
    })
  }

  // Auto-save form data to localStorage
  private saveFormData(): void {
    const formData = {
      step: this.currentStep(),
      formValues: this.businessInfoForm.getRawValue(),
    }
    localStorage.setItem(this.storageKey, JSON.stringify(formData))
  }

  // Load saved form data from localStorage
  private loadSavedData(): void {
    const savedData = localStorage.getItem(this.storageKey)
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        if (data.formValues) {
          this.isRestoringData = true
          this.businessInfoForm.patchValue(data.formValues)
          this.businessInfoForm.updateValueAndValidity()
          this.isRestoringData = false
          this.cdr.markForCheck()
          setTimeout(() => {
            this.businessInfoForm.markAllAsTouched()
            this.cdr.markForCheck()
          }, 100)
        }
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }

  // Clear saved form data
  private clearSavedData(): void {
    localStorage.removeItem(this.storageKey)
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
        "registeredByContactNumber",
        "contactPerson",
        "contactNumber",
        "businessName",
        "businessEmail",
        "businessAddress",
      ]
      return step1Fields.every((field) => {
        const control = this.businessInfoForm.get(field)
        if (control?.disabled) {
          return control.value && control.value.trim() !== ""
        }
        // For contact number fields, check if they have valid format and are not pending
        if (field === "registeredByContactNumber" || field === "contactNumber") {
          return control?.valid && !control?.pending && control?.value && control.value.length === 10
        }
        return control?.valid && !control?.pending
      })
    } else if (this.currentStep() === 2) {
      // Payment details step validation - at least one payment mode should be selected
      const paymentModes = this.businessInfoForm.get("currentModeOfPayment")?.value as PaymentMode | null
      const hasPaymentMode = paymentModes ? Object.values(paymentModes).some((mode) => mode) : false
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
        this.clearSavedData() 
      },
      error: (error) => {
        console.error("Error submitting application:", error)
        this.isSubmitting.set(false)
        alert("Error submitting application. Please try again.")
      },
    })
  }

  private buildFormData(): MerchantApplicationPayload {
    const formValue = this.businessInfoForm.getRawValue()
    return {
      registeredBy: formValue.contactPersonName,
      registeredByContactNumber: formValue.registeredByContactNumber,
      contactPersonName: formValue.contactPerson,
      contactPerson: formValue.contactPerson,
      contactNumber: formValue.contactNumber,
      businessName: formValue.businessName,
      businessEmail: formValue.businessEmail,
      businessAddress: formValue.businessAddress,
      telephoneNo: formValue.telephoneNo,
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
