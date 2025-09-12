import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationConfig {
  readonly showItemsInfo?: boolean;
  readonly showGoToPage?: boolean;
  readonly itemsPerPage?: number;
  readonly itemName?: string;
}

type PageNumber = number | '...';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 my-4 px-1" 
           role="navigation" 
           aria-label="Pagination Navigation">
        
        <!-- Results Info -->
        <div class="text-sm text-gray-600 font-medium flex-shrink-0 order-2 sm:order-1">
          Showing {{ startItem() }} to {{ endItem() }} of {{ totalCount() }} results
        </div>
        
        <!-- Pagination Controls -->
        <div class="flex items-center gap-1.5 order-1 sm:order-2">
          <!-- Previous Button -->
      <button 
            type="button"
            class="px-3 py-1.5 text-xs font-medium border border-gray-300 bg-white text-gray-700 rounded hover:border-admin-button-bg hover:text-admin-button-bg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-admin-button-bg focus:ring-offset-1"
            [disabled]="!canGoPrevious()"
            [attr.aria-label]="'Go to previous page'"
            (click)="goToPreviousPage()">
        Previous
      </button>
      
          <!-- Page Numbers -->
          <div class="flex gap-0.5 mx-2" role="group" aria-label="Page numbers">
            @for (page of pageNumbers(); track page) {
        <button 
                type="button"
                class="w-7 h-7 text-xs font-medium border rounded transition-colors duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-admin-button-bg focus:ring-offset-1"
                [class]="isCurrentPage(page) 
                  ? 'border-admin-button-bg bg-admin-button-bg text-white hover:bg-admin-button-hover-bg hover:border-admin-button-hover-bg' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-admin-button-bg hover:text-admin-button-bg hover:bg-gray-50'"
                [disabled]="isEllipsis(page)"
                [attr.aria-label]="getPageAriaLabel(page)"
                [attr.aria-current]="isCurrentPage(page) ? 'page' : null"
                (click)="goToPage(page)">
          {{ page }}
        </button>
            }
      </div>
      
          <!-- Next Button -->
      <button 
            type="button"
            class="px-3 py-1.5 text-xs font-medium border border-gray-300 bg-white text-gray-700 rounded hover:border-admin-button-bg hover:text-admin-button-bg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-admin-button-bg focus:ring-offset-1"
            [disabled]="!canGoNext()"
            [attr.aria-label]="'Go to next page'"
            (click)="goToNextPage()">
        Next
      </button>
    </div>
      </nav>
    }
  `,
})
export class PaginationComponent {
  // Inputs using new input() function
  readonly currentPage = input(1);
  readonly totalCount = input(0);
  readonly itemsPerPage = input(10);
  readonly config = input<PaginationConfig>({});
  readonly maxVisiblePages = input(5);

  // Outputs using new output() function
  readonly pageChange = output<number>();

  // Computed properties for derived state
  readonly totalPages = computed(() => 
    Math.ceil(this.totalCount() / this.itemsPerPage()) || 1
  );

  readonly startItem = computed(() => 
    (this.currentPage() - 1) * this.itemsPerPage() + 1
  );

  readonly endItem = computed(() => 
    Math.min(this.currentPage() * this.itemsPerPage(), this.totalCount())
  );

  readonly pageNumbers = computed(() => this.generatePageNumbers());

  readonly canGoPrevious = computed(() => this.currentPage() > 1);
  readonly canGoNext = computed(() => this.currentPage() < this.totalPages());

  private generatePageNumbers(): PageNumber[] {
    const total = this.totalPages();
    const current = this.currentPage();
    
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: PageNumber[] = [1];
    
    if (current <= 4) {
      pages.push(...Array.from({ length: 4 }, (_, i) => i + 2));
      pages.push('...', total);
    } else if (current >= total - 3) {
      pages.push('...', ...Array.from({ length: 5 }, (_, i) => total - 4 + i));
    } else {
      pages.push('...', current - 1, current, current + 1, '...', total);
    }
    
    return pages;
  }

  isCurrentPage(page: PageNumber): boolean {
    return page === this.currentPage();
  }

  isEllipsis(page: PageNumber): boolean {
    return page === '...';
  }

  getPageAriaLabel(page: PageNumber): string {
    if (this.isEllipsis(page)) {
      return 'More pages';
    }
    return `Go to page ${page}`;
  }

  goToPage(page: PageNumber): void {
    if (typeof page === 'number' && this.isValidPage(page)) {
      this.pageChange.emit(page);
    }
  }

  goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.canGoNext()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  private isValidPage(page: number): boolean {
    return page >= 1 && page <= this.totalPages() && page !== this.currentPage();
  }
}