"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("./entities/invoice.entity");
const invoice_item_entity_1 = require("./entities/invoice-item.entity");
let InvoiceService = class InvoiceService {
    constructor(invoiceRepository, invoiceItemRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceItemRepository = invoiceItemRepository;
    }
    async create(createInvoiceDto, user) {
        const { items } = createInvoiceDto, invoiceData = __rest(createInvoiceDto, ["items"]);
        const lastInvoice = await this.invoiceRepository.findOne({
            where: {},
            order: { createdAt: 'DESC' },
        });
        let lastNumber = 0;
        if (lastInvoice === null || lastInvoice === void 0 ? void 0 : lastInvoice.invoiceNumber) {
            const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
            if (match)
                lastNumber = parseInt(match[1], 10);
        }
        const newNumber = lastNumber + 1;
        const invoiceNumber = `INV-${newNumber.toString().padStart(3, '0')}`;
        let subtotal = 0;
        const processedItems = items.map(item => {
            const amount = item.quantity * item.rate;
            subtotal += amount;
            return Object.assign(Object.assign({}, item), { amount });
        });
        const taxRate = invoiceData.taxRate || 0;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;
        const invoice = this.invoiceRepository.create(Object.assign(Object.assign({}, invoiceData), { invoiceNumber,
            subtotal,
            taxAmount,
            total, userId: user.id, status: invoiceData.status || 'draft' }));
        const savedInvoice = await this.invoiceRepository.save(invoice);
        const invoiceItems = processedItems.map(item => this.invoiceItemRepository.create(Object.assign(Object.assign({}, item), { invoiceId: savedInvoice.id })));
        await this.invoiceItemRepository.save(invoiceItems);
        return this.findOne(savedInvoice.id, user);
    }
    async findAll(query, user) {
        const { search, invoiceNumber, fromName, toName, invoiceDate, status, sortBy = 'invoiceDate', sortOrder = 'DESC', page = 1, limit = 10, } = query;
        const queryBuilder = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.items', 'items')
            .where('invoice.userId = :userId', { userId: user.id });
        if (search) {
            queryBuilder.andWhere('(invoice.invoiceNumber LIKE :search OR invoice.fromName LIKE :search OR invoice.toName LIKE :search)', { search: `%${search}%` });
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
        queryBuilder.orderBy(`invoice.${sortBy}`, sortOrder);
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
    async findOne(id, user) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id, userId: user.id },
            relations: ['items'],
        });
        if (!invoice) {
            throw new common_1.NotFoundException('Invoice not found');
        }
        return invoice;
    }
    async update(id, updateInvoiceDto, user) {
        var _a;
        const invoice = await this.findOne(id, user);
        const { items } = updateInvoiceDto, invoiceData = __rest(updateInvoiceDto, ["items"]);
        if (items && items.length) {
            await this.invoiceItemRepository.delete({ invoiceId: id });
            invoice.items = [];
            let subtotal = 0;
            const processedItems = items.map(item => {
                const amount = item.quantity * item.rate;
                subtotal += amount;
                return { description: item.description, quantity: item.quantity, rate: item.rate, amount };
            });
            const taxRate = (_a = invoiceData.taxRate) !== null && _a !== void 0 ? _a : invoice.taxRate;
            const taxAmount = (subtotal * taxRate) / 100;
            const total = subtotal + taxAmount;
            Object.assign(invoice, Object.assign(Object.assign({}, invoiceData), { subtotal, taxAmount, total }));
            await this.invoiceRepository.save(invoice);
            const invoiceItems = processedItems.map(item => this.invoiceItemRepository.create(Object.assign(Object.assign({}, item), { invoiceId: id })));
            await this.invoiceItemRepository.save(invoiceItems);
        }
        else {
            Object.assign(invoice, invoiceData);
            await this.invoiceRepository.save(invoice);
        }
        return this.findOne(id, user);
    }
    async remove(id, user) {
        const invoice = await this.findOne(id, user);
        await this.invoiceRepository.remove(invoice);
        return { message: 'Invoice deleted successfully' };
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_item_entity_1.InvoiceItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map