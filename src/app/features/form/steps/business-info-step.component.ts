import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/components/form-field.component';
import { BusinessType, BusinessCategory } from '../../../models/merchant.component';

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
            placeholder="Enter registration number (optional)"
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
            label="Number of Employees"
            fieldId="numberOfEmployees"
            [control]="getControl('numberOfEmployees')"
            type="select"
            placeholder="Select employee range"
            [required]="true"
            [options]="employeeRanges"
          />
        </div>
        
        <div class="form-field">
          <label for="website" class="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            id="website"
            formControlName="website"
            placeholder="https://yourwebsite.com (optional)"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-netpay-primary-blue focus:border-transparent"
          />
        </div>
        
        <div class="form-field">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Business Description @if (true) { <span class="text-red-500">*</span> }
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            placeholder="Describe your business (10-500 characters)"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-netpay-primary-blue focus:border-transparent"
            [class.border-red-500]="form().get('description')?.errors && form().get('description')?.touched"
          ></textarea>
          @if (form().get('description')?.errors && form().get('description')?.touched) {
            <div class="error-message text-red-500 text-sm mt-1">
              @if (form().get('description')?.errors?.['required']) {
                This field is required
              } @else if (form().get('description')?.errors?.['minlength']) {
                Minimum length is {{ form().get('description')?.errors?.['minlength'].requiredLength }}
              } @else if (form().get('description')?.errors?.['maxlength']) {
                Maximum length is {{ form().get('description')?.errors?.['maxlength'].requiredLength }}
              }
            </div>
          }
        </div>
      </form>
    </div>
  `,
})
export class BusinessInfoStepComponent {
  readonly form = input.required<FormGroup>();
  readonly businessTypes = input.required<BusinessType[]>();
  readonly businessCategories = input.required<BusinessCategory[]>();
  
  readonly employeeRanges = [
    { label: '1-5', value: '1-5' },
    { label: '6-20', value: '6-20' },
    { label: '21-50', value: '21-50' },
    { label: '51-100', value: '51-100' },
    { label: '101-500', value: '101-500' },
    { label: '500+', value: '500+' },
  ];
  
  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl;
  }
}
