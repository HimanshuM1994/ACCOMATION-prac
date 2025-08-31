import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { User } from '../auth/entities/user.entity';
export declare class InvoiceService {
    private invoiceRepository;
    private invoiceItemRepository;
    constructor(invoiceRepository: Repository<Invoice>, invoiceItemRepository: Repository<InvoiceItem>);
    create(createInvoiceDto: CreateInvoiceDto, user: User): Promise<Invoice>;
    findAll(query: InvoiceQueryDto, user: User): Promise<{
        data: Invoice[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number, user: User): Promise<Invoice>;
    update(id: number, updateInvoiceDto: UpdateInvoiceDto, user: User): Promise<Invoice>;
    remove(id: number, user: User): Promise<{
        message: string;
    }>;
}
