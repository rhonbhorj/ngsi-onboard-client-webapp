import { Injectable, inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Injectable({
  providedIn: "root",
})
export class FormService {
  private fb = inject(FormBuilder)

  // Step 1: Business Information
  createBusinessInfoForm(): FormGroup {
    return this.fb.group({
      // Business Information fields
      contactPersonName: ["", [Validators.required, Validators.minLength(2)]],
      contactNumber: ["", [Validators.required, Validators.pattern(/^09\d{9}$/)]], // PH mobile format
      businessName: ["", [Validators.required, Validators.minLength(2)]],
      businessEmail: ["", [Validators.required, Validators.email]],
      businessAddress: ["", [Validators.required, Validators.minLength(10)]],
      industryOrBusinessStyle: ["", [Validators.required, Validators.minLength(2)]],
      telephoneNo: [""], // Optional
      typeOfBusiness: ["", [Validators.required]],

      // Payment Details fields
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

  // Step 2: Payment Details
  // createPaymentDetailsForm(): FormGroup {
  //   return this.fb.group({
  //     hasExistingPaymentPortal: ["", [Validators.required]],
  //     currentModeOfPayment: ["", [Validators.required]],
  //     estimatedTransactionNumbers: ["", [Validators.required, Validators.min(1)]],
  //     estimatedAverageAmount: ["", [Validators.required, Validators.min(1)]],
  //   });
  // }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key)
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      } else {
        control?.markAsTouched()
      }
    })
  }

  isFormValid(formGroup: FormGroup): boolean {
    return formGroup.valid
  }
}
