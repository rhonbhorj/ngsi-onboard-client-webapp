import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private fb = inject(FormBuilder);

  createBusinessInfoForm(): FormGroup {
    return this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', Validators.required],
      businessCategory: ['', Validators.required],
      registrationNumber: [''],
      yearEstablished: ['', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]],
      numberOfEmployees: ['', Validators.required],
      website: [''],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
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
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFormValid(formGroup: FormGroup): boolean {
    return formGroup.valid;
  }
}
