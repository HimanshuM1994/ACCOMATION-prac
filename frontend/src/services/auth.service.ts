import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message?: string }> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response?.resultData?.access_token) {
          const user = response.resultData.user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('access_token', response.resultData.access_token);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      map(response => ({ success: true, message: response.message }))
    );
  }

  register(userData: { email: string; password: string; firstName: string; lastName: string; company?: string }): Observable<{ success: boolean; message?: string }> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response?.resultData?.access_token) {
          const user = response.resultData.user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('access_token', response.resultData.access_token);
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      map(response => ({ success: true, message: response.message }))
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
