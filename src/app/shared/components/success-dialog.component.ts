import { Component, input, output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-success-dialog",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Application Submitted Successfully!</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Your merchant onboarding application has been submitted. We'll review your information and get back to you within 2-3 business days.
            </p>
            <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-sm text-blue-800">
                <span class="font-medium">Reference ID:</span> {{ referenceNo() }}
              </p>
            </div>
          </div>
          <div class="items-center px-4 py-3">
            <button
              (click)="close.emit()"
              class="px-4 py-2 bg-netpay-primary-blue text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-netpay-primary-blue-dark focus:outline-none focus:ring-2 focus:ring-netpay-primary-blue"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SuccessDialogComponent {
  readonly referenceNo = input.required<string>()
  readonly close = output<void>()
}
