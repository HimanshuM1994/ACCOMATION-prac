export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class InvoiceQueryDto {
    search?: string;
    invoiceNumber?: string;
    fromName?: string;
    toName?: string;
    invoiceDate?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    sortOrder?: SortOrder;
    sortBy?: string;
    page?: number;
    limit?: number;
}
