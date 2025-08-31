import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto, req: any): Promise<{
        status: boolean;
        statusCode: number;
        message: string;
        resultData: any;
        success: boolean;
    }>;
    findAll(query: InvoiceQueryDto, req: any): Promise<{
        status: boolean;
        statusCode: number;
        message: string;
        resultData: any;
        success: boolean;
    }>;
    findOne(id: string, req: any): Promise<{
        status: boolean;
        statusCode: number;
        message: string;
        resultData: any;
        success: boolean;
    }>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto, req: any): Promise<import("./entities/invoice.entity").Invoice>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
