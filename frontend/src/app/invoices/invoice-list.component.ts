import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.interface';
import { HeaderComponent } from '../shared/header.component';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, HeaderComponent],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  paginatedInvoices: Invoice[] = [];

  // Form group for all filters
  filtersForm = new FormGroup({
    invoiceNumber: new FormControl(''),
    fromName: new FormControl(''),
    toName: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl('')
  });

  // Sorting
  sortField: keyof Invoice = 'invoiceDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pageSizeOptions = [5, 10, 20, 50];

  // Loading state
  isLoading = true;

  // Track active filters for display
  activeFilters: Array<{ label: string, value: string, field: string }> = [];

  constructor(private invoiceService: InvoiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadInvoices();
    this.setupFilters();
  }


  loadInvoices(): void {
    this.isLoading = true;
    this.invoiceService.getInvoices().subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('Fetched invoices:', response.resultData.data);
          this.invoices = response.resultData.data;
          this.applyFiltersAndSort();
        } else {

          console.error('Failed to load invoices');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Server error:', err);
        this.isLoading = false;
      }
    });
  }


  setupFilters(): void {
    // Set up individual filter subscriptions with startWith to handle initial empty values
    this.filtersForm.get('invoiceNumber')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.resetToFirstPage();
      this.applyFiltersAndSort();
    });

    this.filtersForm.get('fromName')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.resetToFirstPage();
      this.applyFiltersAndSort();
    });

    this.filtersForm.get('toName')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.resetToFirstPage();
      this.applyFiltersAndSort();
    });

    this.filtersForm.get('fromDate')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.resetToFirstPage();
      this.applyFiltersAndSort();
    });

    this.filtersForm.get('toDate')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.resetToFirstPage();
      this.applyFiltersAndSort();
    });
  }

  // applyFiltersAndSort(): void {
  //   let result = [...this.invoices];
  //   const filters = this.filtersForm.value;

  //   // Apply invoice number filter
  //   if (filters.invoiceNumber?.trim()) {
  //     result = result.filter(invoice =>
  //       invoice.invoiceNumber.toLowerCase().includes(filters.invoiceNumber!.toLowerCase().trim())
  //     );
  //   }

  //   // Apply from name filter
  //   if (filters.fromName?.trim()) {
  //     result = result.filter(invoice =>
  //       invoice.fromName.toLowerCase().includes(filters.fromName!.toLowerCase().trim())
  //     );
  //   }

  //   // Apply to name filter
  //   if (filters.toName?.trim()) {
  //     result = result.filter(invoice =>
  //       invoice.toName.toLowerCase().includes(filters.toName!.toLowerCase().trim())
  //     );
  //   }

  //   // Apply date range filter
  //   if (filters.fromDate || filters.toDate) {
  //     result = result.filter(invoice => {
  //       // Convert invoice date to YYYY-MM-DD string format for comparison
  //       const invoiceDateStr = invoice.invoiceDate instanceof Date
  //         ? invoice.invoiceDate.toISOString().split('T')[0]
  //         : new Date(invoice.invoiceDate).toISOString().split('T')[0];

  //       let matches = true;

  //       if (filters.fromDate) {
  //         matches = matches && invoiceDateStr >= filters.fromDate;
  //       }

  //       if (filters.toDate) {
  //         matches = matches && invoiceDateStr <= filters.toDate;
  //       }

  //       return matches;
  //     });
  //   }

  //   // Apply sorting
  //   result.sort((a, b) => {
  //     let aValue: any = a[this.sortField];
  //     let bValue: any = b[this.sortField];

  //     if (aValue instanceof Date) {
  //       aValue = aValue.getTime();
  //       bValue = (bValue as Date).getTime();
  //     }

  //     if (typeof aValue === 'string') {
  //       aValue = aValue.toLowerCase();
  //       bValue = bValue.toLowerCase();
  //     }

  //     if (this.sortDirection === 'asc') {
  //       return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  //     } else {
  //       return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  //     }
  //   });

  //   this.filteredInvoices = result;
  //   this.updateActiveFilters();
  //   this.updatePagination();
  // }

  applyFiltersAndSort(): void {
    const filters = this.filtersForm.value;

    const params: any = {
      sortBy: this.sortField,
      sortOrder: this.sortDirection.toUpperCase(),
      page: this.currentPage,
      limit: this.pageSize
    };

    if (filters.invoiceNumber?.trim()) params.invoiceNumber = filters.invoiceNumber.trim();
    if (filters.fromName?.trim()) params.fromName = filters.fromName.trim();
    if (filters.toName?.trim()) params.toName = filters.toName.trim();
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;

    this.invoiceService.searchInvoices(params).subscribe({
      next: (res: any) => {
        console.log('Search invoices response:', res);
        this.filteredInvoices = res.resultData.data;
        this.totalPages = res.totalPages;
        this.updatePagination();
        this.updateActiveFilters();
      },
      error: (err) => {
        console.error('Failed to fetch invoices', err);
        this.filteredInvoices = [];
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredInvoices.length / this.pageSize);
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Calculate start and end indices for current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedInvoices = this.filteredInvoices.slice(startIndex, endIndex);
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // reset to first page
    this.loadInvoices();  // refresh data with new page size
  }

  resetToFirstPage(): void {
    this.currentPage = 1;
  }

  // Get page numbers for pagination display
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, this.currentPage - halfVisible);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  updateActiveFilters(): void {
    const filters = this.filtersForm.value;
    this.activeFilters = [];

    if (filters.invoiceNumber?.trim()) {
      this.activeFilters.push({
        label: 'Invoice #',
        value: filters.invoiceNumber.trim(),
        field: 'invoiceNumber'
      });
    }

    if (filters.fromName?.trim()) {
      this.activeFilters.push({
        label: 'From',
        value: filters.fromName.trim(),
        field: 'fromName'
      });
    }

    if (filters.toName?.trim()) {
      this.activeFilters.push({
        label: 'Client',
        value: filters.toName.trim(),
        field: 'toName'
      });
    }

    if (filters.fromDate && filters.toDate) {
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      this.activeFilters.push({
        label: 'Date Range',
        value: `${this.formatDate(fromDate)} - ${this.formatDate(toDate)}`,
        field: 'dateRange'
      });
    } else if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      this.activeFilters.push({
        label: 'From Date',
        value: `From ${this.formatDate(fromDate)}`,
        field: 'fromDate'
      });
    } else if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      this.activeFilters.push({
        label: 'To Date',
        value: `Until ${this.formatDate(toDate)}`,
        field: 'toDate'
      });
    }
  }

  clearFilter(field: string): void {
    if (field === 'dateRange') {
      this.filtersForm.get('fromDate')?.setValue('');
      this.filtersForm.get('toDate')?.setValue('');
    } else {
      this.filtersForm.get(field)?.setValue('');
    }
    this.resetToFirstPage();
  }

  clearAllFilters(): void {
    this.filtersForm.reset();
    this.resetToFirstPage();
  }

  sort(field: keyof Invoice): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  getStatusColor(status: Invoice['status']): string {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'sent': return 'status-sent';
      case 'overdue': return 'status-overdue';
      default: return 'status-draft';
    }
  }

  viewInvoice(id: string): void {
    this.router.navigate(['/invoices', id]);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  // Getters for template
  get hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  get totalItems(): number {
    return this.filteredInvoices.length;
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  editInvoice(id: string): void {
    console.log('Navigating to edit invoice with ID:', id);
    this.router.navigate(['/invoices/edit', id]);
  }

  deleteInvoice(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.deleteInvoice(id).subscribe({
          next: () => {
            this.filteredInvoices = this.filteredInvoices.filter(inv => inv.id !== id);
            this.updatePagination();

            Swal.fire(
              'Deleted!',
              'Invoice has been deleted.',
              'success'
            );
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire(
              'Failed!',
              'Failed to delete the invoice.',
              'error'
            );
          }
        });
      }
    });
  }

}