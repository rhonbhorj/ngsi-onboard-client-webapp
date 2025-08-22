import { Component, input } from '@angular/core';
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="Representative / Owner Name"
            fieldId="representativeName"
            [control]="getControl('representativeName')"
            type="text"
            placeholder="Enter representative or owner name"
            [required]="true"
          />

          <app-form-field
            label="Position Title"
            fieldId="positionTitle"
            [control]="getControl('positionTitle')"
            type="text"
            placeholder="Enter position title"
            [required]="true"
          />

          <app-form-field
            label="Company Name"
            fieldId="companyName"
            [control]="getControl('companyName')"
            type="text"
            placeholder="Enter company name"
            [required]="true"
          />

          <app-form-field
            label="Email Address"
            fieldId="emailAddress"
            [control]="getControl('emailAddress')"
            type="email"
            placeholder="Enter email address"
            [required]="true"
          />

          <app-form-field
            label="Mobile Number"
            fieldId="mobileNumber"
            [control]="getControl('mobileNumber')"
            type="text"
            placeholder="Enter mobile number"
            [required]="true"
          />
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
}
