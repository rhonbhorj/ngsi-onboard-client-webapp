import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private fb = inject(FormBuilder);

  createBusinessInfoForm(): FormGroup {
    return this.fb.group({
      // Step 1: Basic Business Information
      registeredByName: ['', [Validators.required, Validators.minLength(2)]],
      registeredByContact: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      businessEmail: ['', [Validators.required, Validators.email]],
      businessAddress: ['', [Validators.required, Validators.minLength(10)]],
      businessWebsite: [''],
      industryOrBusinessStyle: ['', [Validators.required, Validators.minLength(2)]],
      telephoneNo: [''],
      typeOfBusiness: ['', [Validators.required]],
      contactPerson: ['', [Validators.required, Validators.minLength(2)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      sameAsRegisteredBy: [false],

      // Step 2: Payment & Transaction Details
      hasExistingPaymentPortal: ['', [Validators.required]],
      currentModeOfPayment: this.fb.group({
        cash: [false],
        eWallets: [false],
        qrph: [false],
        cardPayment: [false],
      }),
      estimatedTransactionNumbers: [''],
      estimatedAverageAmount: [''],
    });
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      alternatePhone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  isFormValid(formGroup: FormGroup): boolean {
    return formGroup.valid;
  }
}
