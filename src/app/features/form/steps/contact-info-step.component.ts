import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/components/form-field.component';
import { Country } from '../../../models/merchant.component';

@Component({
  selector: 'app-contact-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  template: `
    <div class="form-step">
      <h2 class="text-xl font-semibold text-netpay-dark-blue mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        Contact & Personal Information
      </h2>

      <form [formGroup]="form()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-form-field
            label="First Name"
            fieldId="firstName"
            [control]="getControl('firstName')"
            type="text"
            placeholder="Enter first name"
            [required]="true"
          />
          
          <app-form-field
            label="Last Name"
            fieldId="lastName"
            [control]="getControl('lastName')"
            type="text"
            placeholder="Enter last name"
            [required]="true"
          />
          
          <app-form-field
            label="Position/Title"
            fieldId="position"
            [control]="getControl('position')"
            type="text"
            placeholder="Enter your position"
            [required]="true"
          />
          
          <app-form-field
            label="Email Address"
            fieldId="email"
            [control]="getControl('email')"
            type="email"
            placeholder="Enter email address"
            [required]="true"
          />
          
          <app-form-field
            label="Phone Number"
            fieldId="phone"
            [control]="getControl('phone')"
            type="text"
            placeholder="Enter phone number"
            [required]="true"
          />
          
          <app-form-field
            label="Alternate Phone"
            fieldId="alternatePhone"
            [control]="getControl('alternatePhone')"
            type="text"
            placeholder="Enter alternate phone (optional)"
          />
        </div>
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <app-form-field
                label="Street Address"
                fieldId="street"
                [control]="getControl('street')"
                type="text"
                placeholder="Enter street address"
                [required]="true"
              />
            </div>
            
            <app-form-field
              label="City"
              fieldId="city"
              [control]="getControl('city')"
              type="text"
              placeholder="Enter city"
              [required]="true"
            />
            
            <app-form-field
              label="State/Province"
              fieldId="state"
              [control]="getControl('state')"
              type="text"
              placeholder="Enter state/province"
              [required]="true"
            />
            
            <app-form-field
              label="Postal Code"
              fieldId="postalCode"
              [control]="getControl('postalCode')"
              type="text"
              placeholder="Enter postal code"
              [required]="true"
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
        </div>
      </form>
    </div>
  `,
})
export class ContactInfoStepComponent {
  readonly form = input.required<FormGroup>();
  readonly countries = input.required<Country[]>();
  
  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl;
  }
}
