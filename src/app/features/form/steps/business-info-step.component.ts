import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/components/form-field.component';
import { BusinessType, BusinessCategory, Country } from '../../../models/merchant.component';

@Component({
  selector: 'app-business-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <div class="form-step">
      <h2 class="text-xl font-semibold text-netpay-dark-blue mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        Business Information
      </h2>

      <form [formGroup]="form()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="Business Name"
            fieldId="businessName"
            [control]="getControl('businessName')"
            type="text"
            placeholder="Enter your business name"
            [required]="true"
          />
          
          <app-form-field
            label="Business Type"
            fieldId="businessType"
            [control]="getControl('businessType')"
            type="select"
            placeholder="Select business type"
            [required]="true"
            [options]="businessTypes()"
          />
          
          <app-form-field
            label="Business Category"
            fieldId="businessCategory"
            [control]="getControl('businessCategory')"
            type="select"
            placeholder="Select business category"
            [required]="true"
            [options]="businessCategories()"
          />
          
          <app-form-field
            label="Business Registration Number"
            fieldId="registrationNumber"
            [control]="getControl('registrationNumber')"
            type="text"
            placeholder="Enter registration number"
            [required]="true"
          />
          
          <app-form-field
            label="Year Established"
            fieldId="yearEstablished"
            [control]="getControl('yearEstablished')"
            type="number"
            placeholder="Enter year established"
            [required]="true"
            [min]="1800"
            [max]="2024"
          />

          <app-form-field
            label="Country"
            fieldId="country"
            [control]="getControl('country')"
            type="select"
            placeholder="Select country"
            [required]="true"
            [options]="countries()"
          />
        </div>

        <app-form-field
          label="Business / Company Address"
          fieldId="address"
          [control]="getControl('address')"
          type="text"
          placeholder="Enter full business address"
          [required]="true"
        />
      </form>
    </div>
  `,
})
export class BusinessInfoStepComponent {
  readonly form = input.required<FormGroup>();
  readonly businessTypes = input.required<BusinessType[]>();
  readonly businessCategories = input.required<BusinessCategory[]>();
  readonly countries = input.required<Country[]>();
  
  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl;
  }
}
