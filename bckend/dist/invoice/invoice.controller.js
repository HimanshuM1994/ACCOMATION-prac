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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const invoice_service_1 = require("./invoice.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const update_invoice_dto_1 = require("./dto/update-invoice.dto");
const invoice_query_dto_1 = require("./dto/invoice-query.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const response_helper_1 = require("../common/helpers/response.helper");
let InvoiceController = class InvoiceController {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async create(createInvoiceDto, req) {
        const createInvoice = await this.invoiceService.create(createInvoiceDto, req.user);
        return response_helper_1.ApiResultResponse.success('Invoice create successfully', common_1.HttpStatus.CREATED, createInvoice);
    }
    async findAll(query, req) {
        const getallinvoice = await this.invoiceService.findAll(query, req.user);
        console.log(getallinvoice);
        return response_helper_1.ApiResultResponse.success('Get all invoice successfully', common_1.HttpStatus.CREATED, getallinvoice);
    }
    async findOne(id, req) {
        const invoiceData = await this.invoiceService.findOne(+id, req.user);
        return response_helper_1.ApiResultResponse.success('Get invoice successfully', common_1.HttpStatus.CREATED, invoiceData);
    }
    update(id, updateInvoiceDto, req) {
        return this.invoiceService.update(+id, updateInvoiceDto, req.user);
    }
    remove(id, req) {
        return this.invoiceService.remove(+id, req.user);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: create_invoice_dto_1.CreateInvoiceDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_query_dto_1.InvoiceQueryDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_invoice_dto_1.UpdateInvoiceDto, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "remove", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map