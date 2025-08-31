export declare class CreateInvoiceItemDto {
    description: string;
    quantity: number;
    rate: number;
}
export declare class CreateInvoiceDto {
    invoiceNumber: string;
    fromName: string;
    fromEmail: string;
    fromAddress: string;
    toName: string;
    toEmail: string;
    toAddress: string;
    invoiceDate: string;
    dueDate: string;
    taxRate?: number;
    notes?: string;
    status?: string;
    items: CreateInvoiceItemDto[];
}
