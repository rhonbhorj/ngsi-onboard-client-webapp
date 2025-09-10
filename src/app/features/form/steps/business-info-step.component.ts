import { Component, input, type OnInit } from "@angular/core"
import { type FormGroup, ReactiveFormsModule, type FormControl } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { FormFieldComponent } from "../../../shared/components/form-field.component"

@Component({
  selector: "app-business-info-step",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <div class="form-step">
      <h2 class="text-xl font-semibold text-netpay-dark-blue mb-6 flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-netpay-primary-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          ></path>
        </svg>
        Business Information
      </h2>

      <form [formGroup]="form()" class="space-y-6">
        <!-- Registered By Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue"></label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <app-form-field
              label="REGISTERED BY"
              fieldId="contactPersonName"
              [control]="getControl('contactPersonName')"
              type="text"
              placeholder="Enter full name of business owner / authorized representative"
              [required]="true"
            />

            <!-- Registered By Contact Number with +63 prefix -->
            <div class="form-field">
              <label for="registeredByContactNumber" class="block text-sm font-medium text-gray-700 mb-2">
                REGISTERED BY CONTACT NUMBER <span class="text-red-500">*</span>
              </label>
              <div class="flex">
                <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
                  +63
                </span>
                <input
                  type="text"
                  id="registeredByContactNumber"
                  [formControl]="getControl('registeredByContactNumber')"
                  placeholder="9XXXXXXXXX"
                  class="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('registeredByContactNumber')"
                />
              </div>
              @if (getControl('registeredByContactNumber').pending) {
              <div class="text-blue-500 text-sm mt-1">
                Checking contact number...
              </div>
              } @else {
                @if (isFieldInvalid('registeredByContactNumber')) {
                <div class="error-message text-red-500 text-sm mt-1">
                  @if (getControl('registeredByContactNumber').errors?.['contactNumberExists']) {
                    This contact number is already registered.
                  } @else {
                    Please enter a valid mobile number (9XXXXXXXXX)
                  }
                </div>
                }
              }
            </div>
          </div>

        <!-- Business Details Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <app-form-field
            label="BUSINESS NAME"
            fieldId="businessName"
            [control]="getControl('businessName')"
            type="text"
            placeholder="Enter registered business name"
            [required]="true"
          />

          <app-form-field
            label="BUSINESS EMAIL"
            fieldId="businessEmail"
            [control]="getControl('businessEmail')"
            type="email"
            placeholder="Enter official business email address"
            [required]="true"
          />
        </div>

        <!-- Address Section -->
        <div class="grid grid-cols-1 gap-4 md:gap-6">
          <app-form-field
            label="BUSINESS ADDRESS"
            fieldId="businessAddress"
            [control]="getControl('businessAddress')"
            type="text"
            placeholder="Enter complete business address (street, city, country)"
            [required]="true"
          />
        </div>

        <!-- Telephone Section -->
        <div class="grid grid-cols-1 gap-4 md:gap-6">
          <app-form-field
            label="TELEPHONE NUMBER (OPTIONAL)"
            fieldId="telephoneNo"
            [control]="getControl('telephoneNo')"
            type="text"
            placeholder="Enter landline number if available"
            [required]="false"
          />
        </div>

        <!-- Contact Person Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue"></label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <app-form-field
              label="CONTACT PERSON"
              fieldId="contactPerson"
              [control]="getControl('contactPerson')"
              type="text"
              placeholder="Enter contact person name"
              [required]="true"
            />

            <!-- Contact Number with +63 prefix -->
            <div class="form-field">
              <label for="contactNumber" class="block text-sm font-medium text-gray-700 mb-2">
                CONTACT NUMBER <span class="text-red-500">*</span>
              </label>
              <div class="flex">
                <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
                  +63
                </span>
                <input
                  type="text"
                  id="contactNumber"
                  [formControl]="getControl('contactNumber')"
                  placeholder="9XXXXXXXXX"
                  class="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:border-transparent"
                  [class.border-red-500]="isFieldInvalid('contactNumber')"
                />
              </div>
              @if (getControl('contactNumber').pending) {
              <div class="text-blue-500 text-sm mt-1">
                Checking contact number...
              </div>
              } @else {
                @if (isFieldInvalid('contactNumber')) {
                <div class="error-message text-red-500 text-sm mt-1">
                  @if (getControl('contactNumber').errors?.['contactNumberExists']) {
                    This contact number is already registered.
                  } @else {
                    Please enter a valid mobile number (9XXXXXXXXX)
                  }
                </div>
                }
              }
            </div>
          </div>

          <!-- Added checkbox for "same with registered by" -->
          <div class="mt-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                [formControl]="getControl('sameAsRegisteredBy')"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
                (change)="onSameAsRegisteredByChange($event)"
              />
              <span class="text-sm text-gray-700">Same with registered by</span>
            </label>
          </div>
        </div>
    </div>
  `,
})
export class BusinessInfoStepComponent implements OnInit {
  readonly form = input.required<FormGroup>()

  ngOnInit(): void {
    const contactPersonNameControl = this.getControl("contactPersonName")
    const registeredByContactNumberControl = this.getControl("registeredByContactNumber")
    const sameAsRegisteredByControl = this.getControl("sameAsRegisteredBy")

    // Listen for changes in registered by fields
    contactPersonNameControl.valueChanges.subscribe(() => {
      if (sameAsRegisteredByControl.value) {
        this.applySameAsRegisteredByLogic(true)
      }
    })

    registeredByContactNumberControl.valueChanges.subscribe(() => {
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
}
