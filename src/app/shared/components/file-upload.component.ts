import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field">
      <label [for]="fieldId()" class="block text-sm font-medium text-gray-700 mb-2">
        {{ label() }} @if (required()) { <span class="text-red-500">*</span> }
      </label>
      
      <div class="space-y-3">
        @if (uploadedFile()) {
          <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm text-green-700">{{ uploadedFile()?.name }}</span>
            </div>
            <button
              type="button"
              (click)="removeFile()"
              class="text-red-500 hover:text-red-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        } @else {
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-netpay-primary-blue transition-colors">
            <input
              [id]="fieldId()"
              type="file"
              [accept]="accept()"
              (change)="onFileSelect($event)"
              class="hidden"
            />
            <label [for]="fieldId()" class="cursor-pointer">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mt-1 text-sm text-gray-600">
                <span class="font-medium text-netpay-primary-blue hover:text-netpay-primary-blue-dark">
                  Upload a file
                </span>
                or drag and drop
              </p>
              <p class="mt-1 text-xs text-gray-500">{{ accept() }} up to {{ formatFileSize(maxSize()) }}</p>
            </label>
          </div>
        }
      </div>
    </div>
  `,
})
export class FileUploadComponent {
  // Inputs
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly accept = input<string>('*/*');
  readonly required = input(false);
  readonly maxSize = input<number>(5000000); // 5MB default
  
  // State
  readonly uploadedFile = signal<File | null>(null);
  
  // Outputs
  readonly fileSelected = output<File>();
  readonly fileRemoved = output<void>();
  
  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.size <= this.maxSize()) {
      this.uploadedFile.set(file);
      this.fileSelected.emit(file);
    }
  }
  
  removeFile(): void {
    this.uploadedFile.set(null);
    this.fileRemoved.emit();
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
