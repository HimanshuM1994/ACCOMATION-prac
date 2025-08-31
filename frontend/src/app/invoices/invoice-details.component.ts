import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.interface';
import { HeaderComponent } from '../shared/header.component';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: Invoice | null = null;
  isLoading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInvoice(id);
    } else {
      this.router.navigate(['/invoices']);
    }
  }

  loadInvoice(id: string): void {
  this.isLoading = true;
  this.invoiceService.getInvoiceById(id).subscribe({
    next: (response:any) => {
      if (response.success && response.resultData) {
        this.invoice = response.resultData; 
      } else {
        this.notFound = true;
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Server error:', err);
      this.isLoading = false;
      this.notFound = true;
    }
  });
}


  getStatusColor(status: Invoice['status']): string {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'sent': return 'status-sent';
      case 'overdue': return 'status-overdue';
      default: return 'status-draft';
    }
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
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  printInvoice(): void {
    window.print();
  }

  downloadInvoice(): void {
    // This would typically trigger a PDF download
    alert('PDF download functionality would be implemented here');
  }

  sendInvoice(): void {
    if (this.invoice) {
      this.invoiceService.updateInvoice(this.invoice.id, { status: 'sent' });
      this.invoice.status = 'sent';
    }
  }

  markAsPaid(): void {
    if (this.invoice) {
      this.invoiceService.updateInvoice(this.invoice.id, { status: 'paid' });
      this.invoice.status = 'paid';
    }
  }
}