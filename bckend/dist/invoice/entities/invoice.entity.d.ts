import { User } from '../../auth/entities/user.entity';
import { InvoiceItem } from './invoice-item.entity';
export declare class Invoice {
    id: number;
    invoiceNumber: string;
    fromName: string;
    fromEmail: string;
    fromAddress: string;
    toName: string;
    toEmail: string;
    toAddress: string;
    invoiceDate: Date;
    dueDate: Date;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes: string;
    status: string;
    user: User;
    userId: number;
    items: InvoiceItem[];
    createdAt: Date;
    updatedAt: Date;
}
