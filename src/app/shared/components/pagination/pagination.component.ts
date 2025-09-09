import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationConfig {
  showItemsInfo?: boolean;
  showGoToPage?: boolean;
  itemsPerPage?: number;
  itemName?: string;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <button 
        class="pagination-btn"
        [disabled]="currentPage === 1"
        (click)="onPreviousPage()"
        [class.disabled]="currentPage === 1">
        Previous
      </button>
      
      <div class="page-numbers">
        <button 
          *ngFor="let page of visiblePages" 
          class="pagination-btn page-number"
          [class.active]="page === currentPage"
          (click)="onPageChange(page)">
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-btn"
        [disabled]="currentPage === totalPages"
        (click)="onNextPage()"
        [class.disabled]="currentPage === totalPages">
        Next
      </button>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin: 20px 0;
    }

    .pagination-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background: #ffffff;
      color: #05113b;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(.disabled) {
      background: #f2f2f2;
      border-color: #003c6e;
    }

    .pagination-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-btn.active {
      background: #003c6e;
      color: #ffffff;
      border-color: #003c6e;
    }

    .page-numbers {
      display: flex;
      gap: 4px;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalCount: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() config: PaginationConfig = {};
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();
  @Output() firstPage = new EventEmitter<void>();
  @Output() lastPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage) || 1;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onFirstPage(): void {
    this.firstPage.emit();
  }

  onLastPage(): void {
    this.lastPage.emit();
  }

  onPreviousPage(): void {
    this.previousPage.emit();
  }

  onNextPage(): void {
    this.nextPage.emit();
  }
}