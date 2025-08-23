import { Component, input, signal, computed, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../shared/components/form-field.component';

@Component({
  selector: 'app-payment-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
            d="M3 10h18M7 15h1m2 0h5m-9 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          ></path>
        </svg>
        Payment & Transaction Details
      </h2>

      <form [formGroup]="form()" class="space-y-6">
        <!-- Existing Payment Portal Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            DO YOU HAVE EXISTING PAYMENT PORTAL?
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="hasExistingPaymentPortal"
                value="YES"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              YES
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="hasExistingPaymentPortal"
                value="NO"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              NO
            </label>
          </div>
        </div>

        <!-- Current Mode of Payment Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            CURRENT MODE OF PAYMENT (OPTIONAL)
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="currentModeOfPayment.cash"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              CASH
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="currentModeOfPayment.eWallets"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              E-WALLETS (GCASH, PAYMAYA, SEABANK, & ETC.)
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="currentModeOfPayment.qrph"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              QRPH
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="currentModeOfPayment.cardPayment"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              CARD PAYMENT
            </label>
          </div>
        </div>

        <!-- Estimated Transaction Numbers Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            ESTIMATED TRANSACTION NUMBERS (PER MONTH) (OPTIONAL)
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedTransactionNumbers"
                value="1 – 50"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              1 – 50
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedTransactionNumbers"
                value="51 – 100"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              51 – 100
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedTransactionNumbers"
                value="ABOVE 100"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              ABOVE 100
            </label>
          </div>
        </div>

        <!-- Estimated Average Amount Section -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            ESTIMATED AVERAGE AMOUNT (PER TRANSACTION) (OPTIONAL)
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedAverageAmount"
                value="1 – 10,000"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              1 – 10,000
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedAverageAmount"
                value="10,001 – 50,000"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              10,001 – 50,000
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedAverageAmount"
                value="ABOVE 50,000"
                class="mr-2 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              ABOVE 50,000
            </label>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class PaymentDetailsStepComponent {
  readonly form = input.required<FormGroup>();

  getControl(fieldName: string): FormControl {
    return this.form().get(fieldName) as FormControl;
  }
}
