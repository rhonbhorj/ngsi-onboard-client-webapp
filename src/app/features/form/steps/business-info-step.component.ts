import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, type OnInit } from "@angular/core"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { type FormGroup, ReactiveFormsModule, type FormControl } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { FormFieldComponent } from "../../../shared/components/form-field.component"

@Component({
  selector: "app-business-info-step",
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: "./business-info-step.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessInfoStepComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  readonly form = input.required<FormGroup>()

  ngOnInit(): void {
    const contactPersonNameControl = this.getControl("contactPersonName")
    const registeredByContactNumberControl = this.getControl("registeredByContactNumber")
    const sameAsRegisteredByControl = this.getControl("sameAsRegisteredBy")

    // Listen for changes in registered by fields
    contactPersonNameControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (sameAsRegisteredByControl.value) {
        this.applySameAsRegisteredByLogic(true)
      }
    })

    registeredByContactNumberControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (sameAsRegisteredByControl.value) {
        this.applySameAsRegisteredByLogic(true)
      }
    })

    // Check if the checkbox was previously checked and restore the field states
    if (sameAsRegisteredByControl?.value) {
      this.applySameAsRegisteredByLogic(true)
    }
  }

  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.getControl(fieldName)
    return !!(control?.errors && control?.touched)
  }

  onSameAsRegisteredByChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked
    this.applySameAsRegisteredByLogic(isChecked)
  }

  private applySameAsRegisteredByLogic(isChecked: boolean): void {
    const registeredByName = this.getControl("contactPersonName").value
    const registeredByContactNumber = this.getControl("registeredByContactNumber").value

    if (isChecked) {
      this.getControl("contactPerson").disable()
      this.getControl("contactNumber").disable()

      // Only copy values if both source fields have values
      if (registeredByName && registeredByContactNumber) {
        this.getControl("contactPerson").setValue(registeredByName)
        this.getControl("contactNumber").setValue(registeredByContactNumber)
      }
    } else {
      this.getControl("contactPerson").enable()
      this.getControl("contactNumber").enable()
    }
  }

  onContactNumberInput(fieldName: string): void {
    const control = this.getControl(fieldName)
    // Mark as touched to trigger validation display
    if (control && !control.touched) {
      control.markAsTouched()
    }
  }
}
