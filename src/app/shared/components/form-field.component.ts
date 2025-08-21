import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field">
      <label [for]="fieldId()" class="block text-sm font-medium text-gray-700 mb-2">
        {{ label() }} @if (required()) { <span class="text-red-500">*</span> }
      </label>
      
      @if (type() === 'select') {
        <select
          [id]="fieldId()"
          [formControl]="control()"
          [class]="inputClasses()"
          [class.border-red-500]="isInvalid()"
        >
          <option value="">{{ placeholder() }}</option>
          @for (option of options(); track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      } @else {
        <input
          [type]="type()"
          [id]="fieldId()"
          [formControl]="control()"
          [placeholder]="placeholder()"
          [class]="inputClasses()"
          [class.border-red-500]="isInvalid()"
          [min]="min()"
          [max]="max()"
        />
      }
      
      @if (isInvalid()) {
        <div class="error-message text-red-500 text-sm mt-1">
          {{ getErrorMessage() }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  // Inputs
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly type = input<'text' | 'email' | 'number' | 'select'>('text');
  readonly placeholder = input<string>('');
  readonly required = input(false);
  readonly options = input<{label: string, value: string}[]>([]);
  readonly min = input<number>();
  readonly max = input<number>();

  // Computed
  readonly inputClasses = () => 
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-netpay-primary-blue focus:border-transparent';
  
  readonly isInvalid = () => 
    this.control()?.errors && this.control()?.touched;

  getErrorMessage(): string {
    const control = this.control();
    if (!control?.errors || !control.touched) return '';
    
    const errors = control.errors;
    if (errors['required']) return 'This field is required';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Please enter a valid format';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    return '';
  }
}
