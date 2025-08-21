import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-step animate-fade-in">
      <div class="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800 m-0">Contact / Personal Information</h2>
            <p class="text-gray-600 text-sm m-0 mt-1">Tell us about yourself</p>
          </div>
        </div>
        
        <!-- Form Content -->
        <div class="p-6">
          <form [formGroup]="form()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div class="field animate-slide-up">
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  <svg class="w-4 h-4 text-blue-500 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  First Name
                </label>
                <div class="relative">
                  <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <input 
                    id="firstName"
                    type="text" 
                    formControlName="firstName"
                    placeholder="Enter first name"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    [class.border-red-500]="isFieldInvalid('firstName')"
                    [class.focus:ring-red-500]="isFieldInvalid('firstName')"
                  />
                </div>
                <small class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('firstName')">
                  {{ getErrorMessage('firstName') }}
                </small>
              </div>
              
              <!-- Last Name -->
              <div class="field animate-slide-up" style="animation-delay: 0.1s;">
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  <svg class="w-4 h-4 text-blue-500 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Last Name
                </label>
                <div class="relative">
                  <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <input 
                    id="lastName"
                    type="text" 
                    formControlName="lastName"
                    placeholder="Enter last name"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    [class.border-red-500]="isFieldInvalid('lastName')"
                    [class.focus:ring-red-500]="isFieldInvalid('lastName')"
                  />
                </div>
                <small class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('lastName')">
                  {{ getErrorMessage('lastName') }}
                </small>
              </div>
              
              <!-- Position/Title -->
              <div class="field animate-slide-up" style="animation-delay: 0.2s;">
                <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
                  <svg class="w-4 h-4 text-blue-500 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                  Position/Title
                </label>
                <div class="relative">
                  <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                  <input 
                    id="position"
                    type="text" 
                    formControlName="position"
                    placeholder="Enter your position"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    [class.border-red-500]="isFieldInvalid('position')"
                    [class.focus:ring-red-500]="isFieldInvalid('position')"
                  />
                </div>
                <small class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('position')">
                  {{ getErrorMessage('position') }}
                </small>
              </div>
              
              <!-- Email Address -->
              <div class="field animate-slide-up" style="animation-delay: 0.3s;">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  <svg class="w-4 h-4 text-blue-500 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Email Address
                </label>
                <div class="relative">
                  <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <input 
                    id="email"
                    type="email" 
                    formControlName="email"
                    placeholder="Enter email address"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    [class.border-red-500]="isFieldInvalid('email')"
                    [class.focus:ring-red-500]="isFieldInvalid('email')"
                  />
                </div>
                <small class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('email')">
                  {{ getErrorMessage('email') }}
                </small>
              </div>
              
              <!-- Phone Number -->
              <div class="field animate-slide-up" style="animation-delay: 0.4s;">
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  <svg class="w-4 h-4 text-blue-500 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Phone Number
                </label>
                <div class="relative">
                  <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <input 
                    id="phone"
                    type="text" 
                    formControlName="phone"
                    placeholder="Enter phone number"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    [class.border-red-500]="isFieldInvalid('phone')"
                    [class.focus:ring-red-500]="isFieldInvalid('phone')"
                  />
                </div>
                <small class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('phone')">
                  {{ getErrorMessage('phone') }}
                </small>
              </div>
              
              <!-- Alternate Phone -->
              <div class="field animate-slide-up" style="animation-delay: 0.5s;">
                <label for="alternatePhone" class="block text-sm font-medium text-gray-700 mb-2">
                  <svg class="w-4 h-4 text-blue-500 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Alternate Phone
                </label>
                <div class="relative">
                  <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <input 
                    id="alternatePhone"
                    type="text" 
                    formControlName="alternatePhone"
                    placeholder="Enter alternate phone (optional)"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    [class.border-red-500]="isFieldInvalid('alternatePhone')"
                    [class.focus:ring-red-500]="isFieldInvalid('alternatePhone')"
                  />
                </div>
                <small class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('alternatePhone')">
                  {{ getErrorMessage('alternatePhone') }}
                </small>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }
    
    .animate-slide-up {
      animation: slideUp 0.5s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .field {
      transition: all 0.3s ease;
    }
    
    .field:hover {
      transform: translateY(-2px);
    }
    
    input:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      border-color: #3b82f6;
    }
    
    .field input {
      transition: all 0.2s ease;
    }
    
    .field input:hover {
      border-color: #3b82f6;
    }
  `]
})
export class ContactInfoStepComponent {
  readonly form = input.required<FormGroup>();
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.form().get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form().get(fieldName);
    if (!control?.errors || !control.touched) return '';
    
    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Please enter a valid format';
    return '';
  }
}
