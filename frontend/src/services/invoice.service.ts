import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Invoice } from '../models/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/api/invoices';

  constructor(private http: HttpClient) { }

  // Helper to add Authorization header with Content-Type
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    console.log('Token being sent:', token ? 'Token exists' : 'No token found'); // Debug log

    return new HttpHeaders({
      'Content-Type': 'application/json',  // Added Content-Type
      'Authorization': `Bearer ${token}`
    });
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('Invoice Service Error:', error);

    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = `Error Code: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  // Get all invoices
  getInvoices(): Observable<{ success: boolean; data: Invoice[] }> {
    return this.http.get<{ success: boolean; data: Invoice[] }>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get single invoice by ID
  getInvoiceById(id: string): Observable<{ success: boolean; data: Invoice }> {
    return this.http.get<{ success: boolean; data: Invoice }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Add new invoice
  addInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Observable<{ success: boolean; data: Invoice }> {
    console.log('Sending invoice data:', invoice); // Debug log
    return this.http.post<{ success: boolean; data: Invoice }>(this.apiUrl, invoice, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => console.log('Invoice creation response:', response)), // Debug log
      catchError(this.handleError.bind(this))
    );
  }

  // Update invoice
  updateInvoice(id: string, updates: Partial<Invoice>): Observable<{ success: boolean; data: Invoice }> {
    return this.http.patch<{ success: boolean; data: Invoice }>(`${this.apiUrl}/${id}`, updates, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Delete invoice
  deleteInvoice(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Search invoices
  searchInvoices(paramsObj: any): Observable<{ data: Invoice[]; total: number }> {
    let params = new HttpParams();
    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key] !== null && paramsObj[key] !== undefined && paramsObj[key] !== '') {
        params = params.set(key, paramsObj[key]);
      }
    });

    return this.http.get<{ data: Invoice[]; total: number }>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      catchError(err => {
        console.error('Invoice Service Error:', err);
        return throwError(() => err);
      })
    );
  }

  // Generate invoice number (optional, can also be handled server-side)
  generateInvoiceNumber(lastNumber: number = 0): string {
    return `INV-${String(lastNumber + 1).padStart(3, '0')}`;
  }

  // Helper method to check if user is authenticated
  private isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Get current user ID from token (if needed)
  getCurrentUserId(): string | null {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || null;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
}