import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../../../shared/components/file-upload.component';

@Component({
  selector: 'app-documents-step',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  template: `
    <div class="form-step">
      <h2 class="text-xl font-semibold text-netpay-dark-blue mb-6 flex items-center">
        <svg class="w-5 h-5 mr-2 text-netpay-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Identity & Verification Documents
      </h2>

      <div class="space-y-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Document Requirements</h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Please upload the following documents to verify your business and identity:</p>
                <ul class="mt-1 list-disc list-inside">
                  <li>Business License (if applicable)</li>
                  <li>Valid Government ID (Driver's License, Passport, etc.)</li>
                </ul>
                <p class="mt-1">Maximum file size: 5MB per document</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <app-file-upload
            label="Business License"
            fieldId="businessLicense"
            accept=".pdf,.jpg,.jpeg,.png"
            (fileSelected)="onFileSelect.emit({file: $event, type: 'businessLicense'})"
            (fileRemoved)="onFileRemove.emit('businessLicense')"
          />
          
          <app-file-upload
            label="Valid Government ID"
            fieldId="validId"
            accept=".pdf,.jpg,.jpeg,.png"
            [required]="true"
            (fileSelected)="onFileSelect.emit({file: $event, type: 'validId'})"
            (fileRemoved)="onFileRemove.emit('validId')"
          />
        </div>

        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-800">Security & Privacy</h3>
              <p class="mt-1 text-sm text-gray-600">
                All uploaded documents are encrypted and stored securely. We only use these documents for verification purposes and will never share them with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DocumentsStepComponent {
  readonly onFileSelect = output<{file: File, type: string}>();
  readonly onFileRemove = output<string>();
}
