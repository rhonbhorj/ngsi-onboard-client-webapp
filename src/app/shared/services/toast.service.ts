import { Injectable, signal, inject, Component } from "@angular/core"
import { CommonModule } from "@angular/common"

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([])

  show(message: Omit<ToastMessage, 'id'>): void {
    const toast: ToastMessage = {
      ...message,
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      duration: message.duration || 5000
    }

    this.toasts.update(toasts => [...toasts, toast])

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast.id)
    }, toast.duration)
  }

  success(title: string, message: string, duration?: number): void {
    this.show({ type: 'success', title, message, duration })
  }

  error(title: string, message: string, duration?: number): void {
    this.show({ type: 'error', title, message, duration })
  }

  warning(title: string, message: string, duration?: number): void {
    this.show({ type: 'warning', title, message, duration })
  }

  info(title: string, message: string, duration?: number): void {
    this.show({ type: 'info', title, message, duration })
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id))
  }

  clear(): void {
    this.toasts.set([])
  }
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="group relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-lg border bg-white p-4 shadow-lg transition-all duration-300 ease-in-out"
          [class.animate-slide-up]="true"
          [class.border-green-200]="toast.type === 'success'"
          [class.border-red-200]="toast.type === 'error'"
          [class.border-yellow-200]="toast.type === 'warning'"
          [class.border-blue-200]="toast.type === 'info'"
        >
          <!-- Icon with background -->
          <div 
            class="flex h-8 w-8 items-center justify-center rounded-full"
            [class.bg-green-100]="toast.type === 'success'"
            [class.bg-red-100]="toast.type === 'error'"
            [class.bg-yellow-100]="toast.type === 'warning'"
            [class.bg-blue-100]="toast.type === 'info'"
          >
            @switch (toast.type) {
              @case ('success') {
                <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              }
              @case ('error') {
                <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              @case ('warning') {
                <svg class="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
              @case ('info') {
                <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            }
          </div>
          
          <!-- Content -->
          <div class="flex-1 space-y-1">
            <p class="text-sm font-semibold text-gray-900">{{ toast.title }}</p>
            <p class="text-sm text-gray-600">{{ toast.message }}</p>
          </div>
          
          <!-- Close button -->
          <button 
            (click)="toastService.remove(toast.id)"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .animate-slide-up {
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService)
}
