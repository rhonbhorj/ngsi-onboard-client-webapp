import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantOnboardingData } from '../../../models/merchant.component';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-step">
      <h2 class="text-xl font-semibold text-netpay-dark-blue mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        Review & Submit
      </h2>

      <div class="space-y-6">
        <!-- Business Information -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Business Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                         <div><span class="font-medium">Business Name:</span> {{ data().businessName }}</div>
             <div><span class="font-medium">Business Type:</span> {{ data().businessType }}</div>
             <div><span class="font-medium">Category:</span> {{ data().businessCategory }}</div>
             <div><span class="font-medium">Year Established:</span> {{ data().yearEstablished }}</div>
             <div><span class="font-medium">Employees:</span> {{ data().numberOfEmployees }}</div>
             <div><span class="font-medium">Website:</span> {{ data().website || 'Not provided' }}</div>
             <div class="md:col-span-2">
               <span class="font-medium">Description:</span> {{ data().description }}
             </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Contact Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                         <div><span class="font-medium">Name:</span> {{ data().contactPerson.firstName }} {{ data().contactPerson.lastName }}</div>
             <div><span class="font-medium">Position:</span> {{ data().contactPerson.position }}</div>
             <div><span class="font-medium">Email:</span> {{ data().contactPerson.email }}</div>
             <div><span class="font-medium">Phone:</span> {{ data().contactPerson.phone }}</div>
             <div><span class="font-medium">Address:</span> {{ data().businessAddress.street }}</div>
             <div><span class="font-medium">City:</span> {{ data().businessAddress.city }}, {{ data().businessAddress.state }}</div>
             <div><span class="font-medium">Postal Code:</span> {{ data().businessAddress.postalCode }}</div>
             <div><span class="font-medium">Country:</span> {{ data().businessAddress.country }}</div>
          </div>
        </div>

        <!-- Documents -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Documents
          </h3>
          <div class="space-y-2 text-sm">
                         <div><span class="font-medium">Business License:</span> {{ data().documents.businessLicense?.name || 'Not uploaded' }}</div>
             <div><span class="font-medium">Government ID:</span> {{ data().documents.identityDocument?.name || 'Not uploaded' }}</div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Terms & Conditions</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>By submitting this form, you agree to our Terms of Service, Privacy Policy, and Processing Agreement. You also consent to receive communications about your account and our services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReviewStepComponent {
  readonly data = input.required<MerchantOnboardingData>();
}
