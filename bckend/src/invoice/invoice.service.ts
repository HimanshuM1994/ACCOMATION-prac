import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { User } from '../auth/entities/user.entity';


@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto, user: User) {
    const { items, ...invoiceData } = createInvoiceDto;
    const lastInvoice = await this.invoiceRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });
    let lastNumber = 0;
    if (lastInvoice?.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if (match) lastNumber = parseInt(match[1], 10);
    }
    const newNumber = lastNumber + 1;
    const invoiceNumber = `INV-${newNumber.toString().padStart(3, '0')}`;
    let subtotal = 0;
    const processedItems = items.map(item => {
      const amount = item.quantity * item.rate;
      subtotal += amount;
      return { ...item, amount };
    });

    const taxRate = invoiceData.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    const invoice = this.invoiceRepository.create({
      ...invoiceData,
      invoiceNumber,
      subtotal,
      taxAmount,
      total,
      userId: user.id,
      status: invoiceData.status || 'draft',
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);
    const invoiceItems = processedItems.map(item =>
      this.invoiceItemRepository.create({
        ...item,
        invoiceId: savedInvoice.id,
      })
    );

    await this.invoiceItemRepository.save(invoiceItems);

    return this.findOne(savedInvoice.id, user);
  }


  async findAll(query: InvoiceQueryDto, user: User) {
    const {
      search,
      invoiceNumber,
      fromName,
      toName,
      invoiceDate,
      status,
      sortBy = 'invoiceDate',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.items', 'items')
      .where('invoice.userId = :userId', { userId: user.id });

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(invoice.invoiceNumber LIKE :search OR invoice.fromName LIKE :search OR invoice.toName LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (invoiceNumber) {
      queryBuilder.andWhere('invoice.invoiceNumber LIKE :invoiceNumber', {
        invoiceNumber: `%${invoiceNumber}%`,
      });
    }

    if (fromName) {
      queryBuilder.andWhere('invoice.fromName LIKE :fromName', {
        fromName: `%${fromName}%`,
      });
    }

    if (toName) {
      queryBuilder.andWhere('invoice.toName LIKE :toName', {
        toName: `%${toName}%`,
      });
    }

    if (invoiceDate) {
      const startDate = new Date(invoiceDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      queryBuilder.andWhere('invoice.invoiceDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }
    if (query.fromDate) {
      queryBuilder.andWhere('invoice.invoiceDate >= :fromDate', { fromDate: query.fromDate });
    }

    if (query.toDate) {
      queryBuilder.andWhere('invoice.invoiceDate <= :toDate', { toDate: query.toDate });
    }
    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    // Apply sorting
    queryBuilder.orderBy(`invoice.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [invoices, total] = await queryBuilder.getManyAndCount();

    return {
      data: invoices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, user: User) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id, userId: user.id },
      relations: ['items'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto, user: User) {
  const invoice = await this.findOne(id, user);
  const { items, ...invoiceData } = updateInvoiceDto;
  if (items && items.length) {
    await this.invoiceItemRepository.delete({ invoiceId: id });
    invoice.items = [];
    let subtotal = 0;
    const processedItems = items.map(item => {
      const amount = item.quantity * item.rate;
      subtotal += amount;
      return { description: item.description, quantity: item.quantity, rate: item.rate, amount };
    });

    const taxRate = invoiceData.taxRate ?? invoice.taxRate;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    Object.assign(invoice, { ...invoiceData, subtotal, taxAmount, total });

    await this.invoiceRepository.save(invoice);
    const invoiceItems = processedItems.map(item =>
      this.invoiceItemRepository.create({ ...item, invoiceId: id })
    );
    await this.invoiceItemRepository.save(invoiceItems);
  } else {
    Object.assign(invoice, invoiceData);
    await this.invoiceRepository.save(invoice);
  }

  return this.findOne(id, user);
}

  async remove(id: number, user: User) {
    const invoice = await this.findOne(id, user);
    await this.invoiceRepository.remove(invoice);
    return { message: 'Invoice deleted successfully' };
  }
}