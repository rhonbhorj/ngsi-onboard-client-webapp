import { Injectable, inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators, type AbstractControl, type ValidationErrors } from "@angular/forms"
import { ApplicationService } from "../../../services/application.service"
import { type Observable, of } from "rxjs"
import { map, catchError, debounceTime, switchMap } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class FormService {
  private fb = inject(FormBuilder)
  private applicationService = inject(ApplicationService)

  private contactNumberAsyncValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 10) {
      return of(null)
    }

    return of(control.value).pipe(
      debounceTime(500), // Wait 500ms after user stops typing
      switchMap((contactNumber) =>
        this.applicationService.checkContactNumberExists(contactNumber).pipe(
          map((exists) => (exists ? { contactNumberExists: true } : null)),
          catchError(() => of(null)), // If API fails, don't block the form
        ),
      ),
    )
  }

  // Step 1: Business Information
  createBusinessInfoForm(): FormGroup {
    return this.fb.group({
      // Business Information fields
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
      telephoneNo: [""], // Optional

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
