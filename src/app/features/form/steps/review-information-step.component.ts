import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { type FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-information-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Mobile-first responsive review layout -->
    <div class="review-information-step space-y-4 sm:space-y-6">
      <div class="text-center mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-netpay-dark-blue mb-2">
          Review Your Information
        </h2>
        <p class="text-sm sm:text-base text-gray-600">
          Please review all the information below before submitting your application
        </p>
      </div>

      <!-- Business Information Section -->
      <div class="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200">
        <h3
          class="text-base sm:text-lg font-semibold text-netpay-dark-blue mb-3 sm:mb-4 flex items-center"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-netpay-primary-blue"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            />
          </svg>
          Business Information
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Contact Person</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('contactPersonName')?.value || 'Not provided' }}
            </p>
          </div>

          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Contact Number</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('contactNumber')?.value || 'Not provided' }}
            </p>
          </div>

          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Business Name</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('businessName')?.value || 'Not provided' }}
            </p>
          </div>

          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Business Email</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('businessEmail')?.value || 'Not provided' }}
            </p>
          </div>

          <div class="review-field sm:col-span-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Business Address</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('businessAddress')?.value || 'Not provided' }}
            </p>
          </div>

          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Industry/Business Style</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('industryOrBusinessStyle')?.value || 'Not provided' }}
            </p>
          </div>

          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Type of Business</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('typeOfBusiness')?.value || 'Not provided' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Payment Information Section -->
      <div class="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200">
        <h3
          class="text-base sm:text-lg font-semibold text-netpay-dark-blue mb-3 sm:mb-4 flex items-center"
        >
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-netpay-primary-blue"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            />
          </svg>
          Payment & Transaction Details
        </h3>

        <div class="space-y-3 sm:space-y-4">
          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >Existing Payment Portal</label
            >
            <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
              {{ form.get('hasExistingPaymentPortal')?.value || 'Not specified' }}
            </p>
          </div>

          <div class="review-field">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >Current Payment Methods</label
            >
            <div class="flex flex-wrap gap-2">
              @if (getSelectedPaymentMethods().length > 0) { @for (method of
              getSelectedPaymentMethods(); track method) {
              <span
                class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-netpay-primary-blue text-white"
              >
                {{ method }}
              </span>
              } } @else {
              <span class="text-sm text-gray-500">No payment methods selected</span>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="review-field">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >Estimated Monthly Transactions</label
              >
              <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
                {{ form.get('estimatedTransactionNumbers')?.value || 'Not specified' }}
              </p>
            </div>

            <div class="review-field">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                >Average Transaction Amount</label
              >
              <p class="text-sm sm:text-base text-netpay-dark-blue font-medium">
                {{ form.get('estimatedAverageAmount')?.value || 'Not specified' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Notice -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div class="flex items-start">
          <svg
            class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h4 class="text-sm sm:text-base font-medium text-blue-800 mb-1">Ready to Submit</h4>
            <p class="text-xs sm:text-sm text-blue-700">
              By clicking "Submit Application", you confirm that all information provided is
              accurate and complete. Our team will review your application and contact you within
              2-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewInformationStepComponent {
  @Input() form!: FormGroup;

  getSelectedPaymentMethods(): string[] {
    const paymentModes = this.form.get('currentModeOfPayment')?.value;
    if (!paymentModes) return [];

    const methods: string[] = [];
    if (paymentModes.cash) methods.push('Cash');
    if (paymentModes.qrph) methods.push('QRPH');
    if (paymentModes.eWallets) methods.push('E-Wallets');
    if (paymentModes.cardPayment) methods.push('Card Payment');

    return methods;
  }
}
