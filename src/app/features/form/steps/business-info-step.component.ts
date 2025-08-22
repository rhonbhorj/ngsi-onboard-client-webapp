import { Component, input, signal, computed, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/components/form-field.component';

@Component({
  selector: 'app-business-info-step',
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          ></path>
        </svg>
        Business Information
      </h2>

      <form [formGroup]="form()" class="space-y-6">
        <!-- Registered By Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="REGISTERED BY (NAME)"
            fieldId="registeredByName"
            [control]="getControl('registeredByName')"
            type="text"
            placeholder="Enter registered by name"
            [required]="true"
          />

          <app-form-field
            label="CONTACT NUMBER"
            fieldId="registeredByContact"
            [control]="getControl('registeredByContact')"
            type="text"
            placeholder="Enter contact number"
            [required]="true"
          />
        </div>

        <!-- Business Details Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="BUSINESS NAME (REQUIRED)"
            fieldId="businessName"
            [control]="getControl('businessName')"
            type="text"
            placeholder="Enter business name"
            [required]="true"
          />

          <app-form-field
            label="BUSINESS EMAIL (REQUIRED)"
            fieldId="businessEmail"
            [control]="getControl('businessEmail')"
            type="email"
            placeholder="Enter business email"
            [required]="true"
          />
        </div>

        <!-- Address and Website Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="BUSINESS ADDRESS (REQUIRED)"
            fieldId="businessAddress"
            [control]="getControl('businessAddress')"
            type="text"
            placeholder="Enter complete business address"
            [required]="true"
          />

          <app-form-field
            label="BUSINESS WEBSITE (OPTIONAL)"
            fieldId="businessWebsite"
            [control]="getControl('businessWebsite')"
            type="text"
            placeholder="Enter business website"
            [required]="false"
          />
        </div>

        <!-- Industry and Telephone Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="INDUSTRY OR BUSINESS STYLE (REQUIRED)"
            fieldId="industryOrBusinessStyle"
            [control]="getControl('industryOrBusinessStyle')"
            type="text"
            placeholder="Enter industry or business style"
            [required]="true"
          />

          <app-form-field
            label="TELEPHONE NO (OPTIONAL)"
            fieldId="telephoneNo"
            [control]="getControl('telephoneNo')"
            type="text"
            placeholder="Enter telephone number"
            [required]="false"
          />
        </div>

        <!-- Type of Business Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            TYPE OF BUSINESS (REQUIRED)
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Sole Proprietorship"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              Sole Proprietorship
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Partnership"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              Partnership
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Corporation"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              Corporation
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Others"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              Others
            </label>
          </div>
        </div>

        <!-- Contact Person Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="CONTACT PERSON (REQUIRED)"
            fieldId="contactPerson"
            [control]="getControl('contactPerson')"
            type="text"
            placeholder="Enter contact person name"
            [required]="true"
          />

          <app-form-field
            label="CONTACT NUMBER (REQUIRED)"
            fieldId="contactNumber"
            [control]="getControl('contactNumber')"
            type="text"
            placeholder="Enter contact number"
            [required]="true"
          />
        </div>

        <!-- Same as Registered By Checkbox -->
        <div class="space-y-2">
          <label class="flex items-center">
            <input
              type="checkbox"
              formControlName="sameAsRegisteredBy"
              (change)="onSameAsRegisteredByChange($event)"
              class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
            />
            (SAME WITH REGISTERED BY - check if the contact person and contact number is same on
            registered by above)
          </label>
        </div>
      </form>
    </div>
  `,
})
export class BusinessInfoStepComponent {
  readonly form = input.required<FormGroup>();

  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl;
  }

  onSameAsRegisteredByChange(event: any): void {
    if (event.target.checked) {
      const registeredByName = this.form().get('registeredByName')?.value;
      const registeredByContact = this.form().get('registeredByContact')?.value;

      this.form().patchValue({
        contactPerson: registeredByName,
        contactNumber: registeredByContact,
      });
    }
  }
}
