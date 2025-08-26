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
        <!-- Contact Person Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <app-form-field
            label="CONTACT PERSON NAME*"
            fieldId="contactPersonName"
            [control]="getControl('contactPersonName')"
            type="text"
            placeholder="Enter full name of business owner / authorized representative"
            [required]="true"
          />

          <app-form-field
            label="CONTACT NUMBER*"
            [control]="getControl('contactNumber')"
            fieldId="contactNumber"
            type="text"
            placeholder="Enter mobile number"
            [required]="true"
          />
        </div>

        <!-- Business Details Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <app-form-field
            label="BUSINESS / COMPANY NAME*"
            fieldId="businessName"
            [control]="getControl('businessName')"
            type="text"
            placeholder="Enter registered business name"
            [required]="true"
          />

          <app-form-field
            label="BUSINESS EMAIL*"
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
            label="BUSINESS ADDRESS*"
            fieldId="businessAddress"
            [control]="getControl('businessAddress')"
            type="text"
            placeholder="Enter complete business address (street, city, country)"
            [required]="true"
          />
        </div>

        <!-- Industry and Telephone Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <app-form-field
            label="INDUSTRY / BUSINESS CATEGORY*"
            fieldId="industryOrBusinessStyle"
            [control]="getControl('industryOrBusinessStyle')"
            type="text"
            placeholder="Enter industry type (e.g., Retail, Food & Beverage, Tech, etc.)"
            [required]="true"
          />

          <app-form-field
            label="TELEPHONE NUMBER (OPTIONAL)"
            fieldId="telephoneNo"
            [control]="getControl('telephoneNo')"
            type="text"
            placeholder="Enter landline number if available"
            [required]="false"
          />
        </div>

        <!-- Type of Business Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            TYPE OF BUSINESS*
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Sole Proprietorship"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">Sole Proprietorship</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Partnership"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">Partnership</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Corporation"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">Corporation</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="typeOfBusiness"
                value="Others"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">Others</span>
            </label>
          </div>
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
