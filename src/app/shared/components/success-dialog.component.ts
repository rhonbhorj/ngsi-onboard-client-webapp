import { Component, input, output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-success-dialog",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        <div class="flex flex-col items-center text-center p-6 sm:p-8">
          <!-- Animated checkmark -->
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" 
                    class="animate-draw"></path>
            </svg>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Application Submitted Successfully!</h3>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="text-center">
              <p class="text-sm font-medium text-blue-700 mb-1">Reference No.:</p>
              <p class="text-lg font-bold text-blue-900">{{ referenceNo() }}</p>
            </div>
          </div>

          <div class="w-full space-y-4 mt-4">
            <p class="text-sm text-gray-600 leading-relaxed">
              Thank you for your interest in applying as a merchant for our new payment method via QRPH. Our Sales Team will contact you soon to discuss the Payment Gateway Service in more detail.
            </p>
            
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-2">Required business documents:</p>
              <div class="text-sm text-gray-600 space-y-1">
                <div class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>BIR 2303 / Certificate of Registration</span>
                </div>
                <div class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>SEC / DTI Certificate</span>
                </div>
                <div class="flex items-start">
                  <span class="mr-2">•</span>
                  <span>Mayor's Permit</span>
                </div>
              </div>
            </div>
            
            <div class="text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span class="font-medium whitespace-nowrap">Contact:</span>
              <a href="mailto:sales@netglobalsolutions.net" class="text-blue-600 hover:underline break-all">sales@netglobalsolutions.net</a>
              <span class="hidden sm:inline">|</span>
              <span class="font-medium whitespace-nowrap">+63 917 145 0310</span>
              <span class="hidden sm:inline">/</span>
              <span class="font-medium whitespace-nowrap">+63 917 179 3481</span>
            </div>
          </div>
          
          <div class="mt-6 w-full">
            <button
              (click)="close.emit()"
              class="px-6 py-3 bg-form-button-bg text-white-text text-base font-medium rounded-lg w-full shadow-sm hover:bg-form-button-hover-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-form-button-bg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      display: block;
    }
    
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
    
    .animate-draw {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: draw 0.6s ease-in-out forwards;
      animation-delay: 0.2s;
    }
  `,
  ],
})
export class SuccessDialogComponent {
  readonly referenceNo = input.required<string>()
  readonly close = output<void>()
}
