import { Injectable, inject } from "@angular/core"
import { FormBuilder, FormGroup, Validators, type AbstractControl, type ValidationErrors } from "@angular/forms"
import { catchError, debounceTime, map, of, switchMap, type Observable } from "rxjs"
import { ApplicationService } from "./application.service"

@Injectable({
  providedIn: "root",
})
export class FormService {
  private readonly fb = inject(FormBuilder)
  private readonly applicationService = inject(ApplicationService)

  private readonly contactNumberAsyncValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 10) {
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

  createBusinessInfoForm(): FormGroup {
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
