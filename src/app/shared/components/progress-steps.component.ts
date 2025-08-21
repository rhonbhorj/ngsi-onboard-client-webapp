import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-steps',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center space-x-2 sm:space-x-4">
      @for (step of steps(); track step; let i = $index) {
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300"
              [class.bg-netpay-primary-blue]="i <= activeIndex()"
              [class.text-white]="i <= activeIndex()"
              [class.bg-gray-300]="i > activeIndex()"
              [class.text-gray-600]="i > activeIndex()"
            >
              {{ i + 1 }}
            </div>
            <span
              class="hidden sm:block text-xs mt-2 text-center font-medium"
              [class.text-netpay-primary-blue]="i <= activeIndex()"
              [class.text-gray-500]="i >= activeIndex()"
            >
              {{ step }}
            </span>
          </div>
          @if (i < steps().length - 1) {
            <div
              class="w-8 sm:w-16 h-1 mx-2"
              [class.bg-netpay-primary-blue]="i < activeIndex()"
              [class.bg-gray-300]="i >= activeIndex()"
            ></div>
          }
        </div>
      }
    </div>
  `,
})
export class ProgressStepsComponent {
  readonly steps = input.required<string[]>();
  readonly activeIndex = input.required<number>();
}
