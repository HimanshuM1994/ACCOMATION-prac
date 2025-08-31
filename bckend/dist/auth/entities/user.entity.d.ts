import { Invoice } from '../../invoice/entities/invoice.entity';
export declare class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    invoices: Invoice[];
    createdAt: Date;
    updatedAt: Date;
}
