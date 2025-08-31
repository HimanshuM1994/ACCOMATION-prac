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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInvoiceDto = exports.CreateInvoiceItemDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateInvoiceItemDto {
}
exports.CreateInvoiceItemDto = CreateInvoiceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Web Development Services', description: 'Item description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Quantity of the item' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Rate per item' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "rate", void 0);
class CreateInvoiceDto {
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INV-001', description: 'Invoice number' }),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Acme Corporation', description: 'Sender name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "fromName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'billing@acme.com', description: 'Sender email' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "fromEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Business St, City', description: 'Sender address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "fromAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tech Solutions Inc', description: 'Recipient name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "toName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'payments@techsolutions.com', description: 'Recipient email' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "toEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '456 Client Ave, City', description: 'Recipient address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "toAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-31', description: 'Invoice date in YYYY-MM-DD format' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-15', description: 'Due date in YYYY-MM-DD format' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8, description: 'Tax rate in percentage', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "taxRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thanks for your business!', description: 'Additional notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'draft', description: 'Invoice status', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateInvoiceItemDto], description: 'List of invoice items' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
//# sourceMappingURL=create-invoice.dto.js.map