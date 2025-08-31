import { Invoice } from './invoice.entity';
export declare class InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    invoice: Invoice;
    invoiceId: number;
}
