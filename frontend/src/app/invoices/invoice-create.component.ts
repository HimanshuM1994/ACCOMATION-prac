import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.interface';
import { HeaderComponent } from '../shared/header.component';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit {
  invoiceForm: FormGroup;
  isLoading = false;
  showPreview = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router
  ) {
    this.invoiceForm = this.createForm();
  }

  ngOnInit(): void {
    this.addItem(); // Add one item by default
    this.calculateTotals();
  }

  createForm(): FormGroup {
    return this.fb.group({
      invoiceNumber: [this.invoiceService.generateInvoiceNumber(), Validators.required],
      invoiceDate: [new Date().toISOString().split('T')[0], Validators.required],
      dueDate: ['', Validators.required],
      fromName: ['', Validators.required],
      fromAddress: ['', Validators.required],
      fromEmail: ['', [Validators.required, Validators.email]],
      toName: ['', Validators.required],
      toAddress: ['', Validators.required],
      toEmail: ['', [Validators.required, Validators.email]],
      items: this.fb.array([]),
      taxRate: [8, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: [''],
      subtotal: [0],
      tax: [0],
      total: [0]
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItemForm(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      rate: [0, [Validators.required, Validators.min(0.01)]],
      amount: [0] // Keep for UI display only
    });
  }

  addItem(): void {
    const itemForm = this.createItemForm();
    itemForm.get('quantity')?.valueChanges.subscribe(() => this.calculateTotals());
    itemForm.get('rate')?.valueChanges.subscribe(() => this.calculateTotals());
    this.items.push(itemForm);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotals();
    }
  }

  calculateTotals(): void {
    this.items.controls.forEach(item => {
      const quantity = item.get('quantity')?.value || 0;
      const rate = item.get('rate')?.value || 0;
      const amount = quantity * rate;
      item.get('amount')?.setValue(amount, { emitEvent: false });
    });

    const subtotal = this.items.controls.reduce((sum, item) => sum + (item.get('amount')?.value || 0), 0);
    const taxRate = this.invoiceForm.get('taxRate')?.value || 0;
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    this.invoiceForm.patchValue({ subtotal, tax, total }, { emitEvent: false });
  }

  onSubmit(): void {
    if (!this.invoiceForm.valid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.invoiceForm.value;


    const payload: any = {
      // invoiceNumber: formValue.invoiceNumber,
      fromName: formValue.fromName,
      fromEmail: formValue.fromEmail,
      fromAddress: formValue.fromAddress,
      toName: formValue.toName,
      toEmail: formValue.toEmail,
      toAddress: formValue.toAddress,
      invoiceDate: formValue.invoiceDate,
      dueDate: formValue.dueDate,
      taxRate: formValue.taxRate,
      notes: formValue.notes,
      status: 'draft',
      items: formValue.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate
      }))
    };

    console.log('Sending payload:', payload); 

   
    this.invoiceService.addInvoice(payload).subscribe({
      next: (res: any) => {
        console.log('API response:', res); // Debug log
        if (res.success) {
          this.router.navigate(['/invoices']);
        } else {
          this.errorMessage = res.message || 'Failed to create invoice';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        // Better error handling
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Server error occurred';
        }
        this.isLoading = false;
      }
    });
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  getFieldError(fieldName: string, index?: number): string {
    let field;
    if (index !== undefined) {
      field = this.items.at(index)?.get(fieldName);
    } else {
      field = this.invoiceForm.get(fieldName);
    }

    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['min']) return `Must be greater than ${field.errors['min'].min}`;
      if (field.errors['max']) return `Must be less than ${field.errors['max'].max}`;
    }
    return '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
}