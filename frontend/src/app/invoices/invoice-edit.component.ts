import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header.component';

@Component({
  selector: 'app-invoice-edit.component',
  imports: [CommonModule, RouterLink, HeaderComponent, ReactiveFormsModule],
  templateUrl: './invoice-edit.component.html',
  styleUrl: './invoice-edit.component.css'
})
export class InvoiceEditComponent {
  invoiceForm: FormGroup = this.fb.group({});
  isLoading = false;
  showPreview = false;
  invoiceId: any;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadInvoice();
  }

  initializeForm(): void {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      taxRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      fromName: ['', Validators.required],
      fromAddress: ['', Validators.required],
      fromEmail: ['', [Validators.required, Validators.email]],
      // fromPhone: ['', Validators.required],
      toName: ['', Validators.required],
      toAddress: ['', Validators.required],
      toEmail: ['', [Validators.required, Validators.email]],
      items: this.fb.array([]),
      subtotal: [0],
      tax: [0],
      total: [0],
      notes: ['']
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(item?: any): void {
    const group = this.fb.group({
      description: [item?.description || '', Validators.required],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(0.01)]],
      rate: [item?.rate || 0, [Validators.required, Validators.min(0)]],
      amount: [0]
    });

    // Auto-calculate totals when an item changes
    group.valueChanges.subscribe(() => this.calculateTotals());

    this.items.push(group);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotals();
    }
  }

  loadInvoice(): void {
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
      next: (data: any) => {
        console.log('Invoice data loaded:', data);
        // Patch main invoice fields
        this.invoiceForm.patchValue({
          invoiceNumber: data.resultData.invoiceNumber || '',
          invoiceDate: data.resultData.invoiceDate || '',
          dueDate: data.resultData.dueDate || '',
          taxRate: data.resultData.taxRate || 0,
          fromName: data.resultData.fromName || '',
          fromAddress: data.resultData.fromAddress || '',
          fromEmail: data.resultData.fromEmail || '',
          // fromPhone: data.resultData.fromPhone || '',
          toName: data.resultData.toName || '',
          toAddress: data.resultData.toAddress || '',
          toEmail: data.resultData.toEmail || '',
          notes: data.resultData.notes || ''
        });

        // Clear existing items
        this.items.clear();

        // Populate items
        if (data.resultData.items && data.resultData.items.length > 0) {
          data.resultData.items.forEach((item: any) => this.addItem(item));
        } else {
          this.addItem(); // At least one item
        }

        // Recalculate totals
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Failed to load invoice:', err);
      }
    });
  }


  calculateTotals(): void {
    let subtotal = 0;
    this.items.controls.forEach((item) => {
      const qty = parseFloat(item.get('quantity')?.value) || 0;
      const rate = parseFloat(item.get('rate')?.value) || 0;
      const amount = qty * rate;
      item.patchValue({ amount }, { emitEvent: false });
      subtotal += amount;
    });

    const taxRate = parseFloat(this.invoiceForm.get('taxRate')?.value) || 0;
    const tax = (subtotal * taxRate) / 100;

    this.invoiceForm.patchValue({
      subtotal,
      tax,
      total: subtotal + tax
    }, { emitEvent: false });
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  getFieldError(field: string, index?: number): string | null {
    if (index != null) {
      const control = this.items.at(index).get(field);
      return control?.touched && control?.invalid ? 'Field is required' : null;
    }
    const control = this.invoiceForm.get(field);
    return control?.touched && control?.invalid ? 'Field is required' : null;
  }

  formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  //   onSubmit(): void {
  //     if (this.invoiceForm.invalid) {
  //       this.invoiceForm.markAllAsTouched();
  //       return;
  //     }
  // console.log('Submitting invoice:', this.invoiceForm.value);
  //     this.isLoading = true;
  //     this.invoiceService.updateInvoice(this.invoiceId, this.invoiceForm.value).subscribe({
  //       next: () => {
  //         this.isLoading = false;
  //         this.router.navigate(['/invoices']);
  //       },
  //       error: () => {
  //         this.isLoading = false;
  //       }
  //     });
  //   }
 onSubmit(): void {
  if (!this.invoiceForm.valid) {
    this.invoiceForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  const formValue = this.invoiceForm.value;

  const payload: any = {
    fromName: formValue.fromName,
    fromEmail: formValue.fromEmail,
    fromAddress: formValue.fromAddress,
    toName: formValue.toName,
    toEmail: formValue.toEmail,
    toAddress: formValue.toAddress,
    invoiceDate: formValue.invoiceDate,
    dueDate: formValue.dueDate,
    taxRate: formValue.taxRate !== null && formValue.taxRate !== ''
      ? Number(formValue.taxRate)
      : 0, // ensure it's at least 0
    notes: formValue.notes,
    status: 'draft',
    items: formValue.items
      .filter((item: any) => item.description)
      .map((item: any) => ({
        description: item.description,
        quantity: Math.max(Number(item.quantity), 0.01),
        rate: Math.max(Number(item.rate), 0.01)
      }))
  };

  console.log('Sending payload:', payload);

  this.invoiceService.updateInvoice(this.invoiceId, payload).subscribe({
    next: () => {
      this.isLoading = false;
      this.router.navigate(['/invoices']);
    },
    error: (err) => {
      this.isLoading = false;
      console.error('API error:', err);
      if (err.error && err.error.message) {
        this.errorMessage = err.error.message;
      } else if (err.message) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'Server error occurred';
      }
    }
  });
}


}
