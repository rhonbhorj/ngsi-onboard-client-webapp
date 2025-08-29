import { Component, Input } from "@angular/core"
import { type FormGroup, ReactiveFormsModule, type FormControl } from "@angular/forms"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-payment-details-step",
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
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m2 0h5m-9 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 003 3v8a3 3 0 003 3z"
          ></path>
        </svg>
        Payment & Transaction Details
      </h2>

      <form [formGroup]="form" class="space-y-8">
        <!-- Existing Payment Portal Section -->
        <div class="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            DO YOU HAVE EXISTING PAYMENT PORTAL?
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="hasExistingPaymentPortal"
                value="YES"
                name="hasExistingPaymentPortal"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">YES</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="hasExistingPaymentPortal"
                value="NO"
                name="hasExistingPaymentPortal"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">NO</span>
            </label>
          </div>
        </div>

        <!-- Current Mode of Payment Section -->
        <div
          class="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
          formGroupName="currentModeOfPayment"
        >
          <label class="block text-sm font-medium text-netpay-dark-blue">
            CURRENT MODE OF PAYMENT
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="cash"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">CASH</span>
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="eWallets"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">E-WALLETS (GCASH, PAYMAYA, SEABANK, & ETC.)</span>
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="qrph"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">QRPH</span>
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                formControlName="cardPayment"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">CARD PAYMENT</span>
            </label>
          </div>
        </div>

        <!-- Estimated Transaction Numbers Section -->
        <div class="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            ESTIMATED TRANSACTION NUMBERS (PER MONTH)
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedTransactionNumbers"
                value="1 – 50"
                name="estimatedTransactionNumbers"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">1 – 50</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedTransactionNumbers"
                value="51 – 100"
                name="estimatedTransactionNumbers"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">51 – 100</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedTransactionNumbers"
                value="ABOVE 100"
                name="estimatedTransactionNumbers"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">ABOVE 100</span>
            </label>
          </div>
        </div>

        <!-- Estimated Average Amount Section -->
        <div class="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label class="block text-sm font-medium text-netpay-dark-blue">
            ESTIMATED AVERAGE AMOUNT (PER TRANSACTION)
          </label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedAverageAmount"
                value="1 – 10,000"
                name="estimatedAverageAmount"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">1 – 10,000</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedAverageAmount"
                value="10,001 – 50,000"
                name="estimatedAverageAmount"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">10,001 – 50,000</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                formControlName="estimatedAverageAmount"
                value="ABOVE 50,000"
                name="estimatedAverageAmount"
                class="mr-3 text-netpay-primary-blue focus:ring-netpay-primary-blue"
              />
              <span class="text-sm">ABOVE 50,000</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class PaymentDetailsStepComponent {
  @Input() form!: FormGroup

  getControl(fieldName: string): FormControl {
    return this.form.get(fieldName) as FormControl
  }

  // Reset all selections in this step
  resetStep(): void {
    this.form.patchValue({
      hasExistingPaymentPortal: "",
      currentModeOfPayment: {
        cash: false,
        eWallets: false,
        qrph: false,
        cardPayment: false,
      },
      estimatedTransactionNumbers: "",
      estimatedAverageAmount: "",
    })
  }

  // Check if step has any selections
  hasSelections(): boolean {
    const hasPaymentPortal = this.form.get("hasExistingPaymentPortal")?.value
    const paymentModes = this.form.get("currentModeOfPayment")?.value
    const hasTransactionNumbers = this.form.get("estimatedTransactionNumbers")?.value
    const hasAverageAmount = this.form.get("estimatedAverageAmount")?.value

    return !!(
      hasPaymentPortal ||
      (paymentModes && Object.values(paymentModes).some((mode) => mode === true)) ||
      hasTransactionNumbers ||
      hasAverageAmount
    )
  }
}
