import { Component, Input, ChangeDetectionStrategy } from "@angular/core"
import { type FormGroup, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-review-information-step",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-netpay-dark-blue mb-2">Review Your Information</h2>
        <p class="text-gray-600">Please review all the information you entered before submitting your application.</p>
      </div>
      <!-- Business Information Section -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-netpay-dark-blue mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          Business Information
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div>
              <!-- Changed label from "Contact Person Name" to "Registered By" -->
              <label class="block text-sm font-medium text-gray-700 mb-1">Registered By</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('contactPersonName')?.value || 'N/A' }}</p>
            </div>
            
            <!-- Added registered by contact number field display -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Registered By Contact Number</label>
              <p class="text-gray-900 bg-white p-2 rounded border">+63{{ form.get('registeredByContactNumber')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <!-- Added new Contact Person field display -->
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('contactPerson')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <p class="text-gray-900 bg-white p-2 rounded border">+63{{ form.get('contactNumber')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telephone Number</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('telephoneNo')?.value || 'N/A' }}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('businessName')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('businessEmail')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('businessAddress')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Industry/Business Style</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('industryOrBusinessStyle')?.value || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-netpay-dark-blue mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m2 0h5m-9 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 003 3v8a3 3 0 003 3z"></path>
          </svg>
          Payment Details
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Has Existing Payment Portal</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('hasExistingPaymentPortal')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Mode of Payment</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ getSelectedPaymentModes() || 'N/A' }}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Transaction Numbers (Per Month)</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('estimatedTransactionNumbers')?.value || 'N/A' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Average Amount (Per Transaction)</label>
              <p class="text-gray-900 bg-white p-2 rounded border">{{ form.get('estimatedAverageAmount')?.value || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

       Confirmation Section 
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="text-sm font-medium text-blue-800 mb-1">Important Notice</h4>
            <p class="text-sm text-blue-700">
              By submitting this application, you confirm that all the information provided is accurate and complete. 
              Our team will review your application and contact you within 2-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewInformationStepComponent {
  @Input() form!: FormGroup

  getSelectedPaymentModes(): string {
    const paymentModes = this.form.get("currentModeOfPayment")?.value
    if (!paymentModes) return ""

    const selectedModes: string[] = []
    if (paymentModes.cash) selectedModes.push("Cash")
    if (paymentModes.eWallets) selectedModes.push("E-Wallets")
    if (paymentModes.qrph) selectedModes.push("QRPH")
    if (paymentModes.cardPayment) selectedModes.push("Card Payment")

    return selectedModes.length > 0 ? selectedModes.join(", ") : ""
  }
}
