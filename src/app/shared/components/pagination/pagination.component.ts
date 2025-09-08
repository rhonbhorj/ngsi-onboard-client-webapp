import { Component, Input, Output, EventEmitter, computed } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

export interface PaginationConfig {
  showItemsInfo?: boolean
  showGoToPage?: boolean
  itemsPerPage?: number
  itemName?: string
}

@Component({
  selector: "app-pagination",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="px-6 py-4 border-t flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0"
         style="border-color: var(--netpay-blue-gray)">
      
      <!-- Left side: Items info -->
      @if (config.showItemsInfo) {
      <div class="flex items-center">
        <p class="text-sm" style="color: var(--netpay-medium-blue)">
          {{ getItemsInfoText() }}
        </p>
      </div>
      }
      
      <!-- Right side: Navigation controls -->
      <div class="flex items-center space-x-2">
        <!-- First Page Button -->
        <button
          (click)="onFirstPage()"
          [disabled]="currentPage === 1"
          class="px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style="border-color: var(--netpay-blue-gray); color: var(--netpay-medium-blue)"
          title="First Page">
          &lt;&lt;
        </button>

        <!-- Previous Page Button -->
        <button
          (click)="onPreviousPage()"
          [disabled]="currentPage === 1"
          class="px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style="border-color: var(--netpay-blue-gray); color: var(--netpay-medium-blue)"
          title="Previous Page">
          &lt;
        </button>

        <!-- Page Info -->
        <span class="px-4 py-2 text-sm font-medium" style="color: var(--netpay-medium-blue)">
          Page {{ currentPage }} of {{ totalPages() }}
        </span>

        <!-- Next Page Button -->
        <button
          (click)="onNextPage()"
          [disabled]="currentPage === totalPages()"
          class="px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style="border-color: var(--netpay-blue-gray); color: var(--netpay-medium-blue)"
          title="Next Page">
          &gt;
        </button>

        <!-- Last Page Button -->
        <button
          (click)="onLastPage()"
          [disabled]="currentPage === totalPages()"
          class="px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style="border-color: var(--netpay-blue-gray); color: var(--netpay-medium-blue)"
          title="Last Page">
          &gt;&gt;
        </button>

        <!-- Go to Page Input -->
        @if (config.showGoToPage) {
        <div class="flex items-center ml-4">
          <span class="text-sm mr-2" style="color: var(--netpay-medium-blue)">Go to:</span>
          <input
            type="number"
            [(ngModel)]="goToPageValue"
            (keyup.enter)="onGoToPage()"
            min="1"
            [max]="totalPages()"
            class="w-16 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-offset-1"
            style="border-color: var(--netpay-blue-gray)"
            placeholder="1" />
        </div>
        }
      </div>
    </div>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 1
  @Input() totalCount = 0
  @Input() itemsPerPage = 10
  @Input() config: PaginationConfig = {
    showItemsInfo: true,
    showGoToPage: true,
    itemsPerPage: 10,
    itemName: "applications",
  }

  @Output() pageChange = new EventEmitter<number>()
  @Output() firstPage = new EventEmitter<void>()
  @Output() lastPage = new EventEmitter<void>()
  @Output() previousPage = new EventEmitter<void>()
  @Output() nextPage = new EventEmitter<void>()

  goToPageValue = ""

  readonly totalPages = computed(() => {
    return Math.ceil(this.totalCount / this.itemsPerPage)
  })

  getItemsInfoText(): string {
    const itemName = this.config.itemName || "items"
    return `Total ${itemName} in the system: ${this.totalCount}`
  }

  onFirstPage(): void {
    if (this.currentPage !== 1) {
      this.firstPage.emit()
      this.pageChange.emit(1)
    }
  }

  onLastPage(): void {
    const lastPage = this.totalPages()
    if (this.currentPage !== lastPage) {
      this.lastPage.emit()
      this.pageChange.emit(lastPage)
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.previousPage.emit()
      this.pageChange.emit(this.currentPage - 1)
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.nextPage.emit()
      this.pageChange.emit(this.currentPage + 1)
    }
  }

  onGoToPage(): void {
    const page = Number.parseInt(this.goToPageValue)
    if (!isNaN(page) && page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page)
      this.goToPageValue = ""
    }
  }
}
