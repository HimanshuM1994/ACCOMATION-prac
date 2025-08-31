import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { InvoiceListComponent } from './invoices/invoice-list.component';
import { InvoiceCreateComponent } from './invoices/invoice-create.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details.component';
import { AuthGuard } from './guards/auth.guard';
import { InvoiceEditComponent } from './invoices/invoice-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'invoices', component: InvoiceListComponent, canActivate: [AuthGuard] },
  { path: 'invoices/new', component: InvoiceCreateComponent, canActivate: [AuthGuard] },
  { path: 'invoices/:id', component: InvoiceDetailsComponent, canActivate: [AuthGuard] },
  { path: 'invoices/edit/:id', component: InvoiceEditComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];