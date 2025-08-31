import { Type } from 'class-transformer';
import { 
  IsString, IsEmail, IsNotEmpty, IsDateString, IsNumber, 
  IsOptional, IsArray, ValidateNested, Min 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'Web Development Services', description: 'Item description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10, description: 'Quantity of the item' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ example: 100, description: 'Rate per item' })
  @IsNumber()
  @Min(0.01)
  rate: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'INV-001', description: 'Invoice number' })
  // @IsString()
  // @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ example: 'Acme Corporation', description: 'Sender name' })
  @IsString()
  @IsNotEmpty()
  fromName: string;

  @ApiProperty({ example: 'billing@acme.com', description: 'Sender email' })
  @IsEmail()
  fromEmail: string;

  @ApiProperty({ example: '123 Business St, City', description: 'Sender address' })
  @IsString()
  @IsNotEmpty()
  fromAddress: string;

  @ApiProperty({ example: 'Tech Solutions Inc', description: 'Recipient name' })
  @IsString()
  @IsNotEmpty()
  toName: string;

  @ApiProperty({ example: 'payments@techsolutions.com', description: 'Recipient email' })
  @IsEmail()
  toEmail: string;

  @ApiProperty({ example: '456 Client Ave, City', description: 'Recipient address' })
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({ example: '2025-08-31', description: 'Invoice date in YYYY-MM-DD format' })
  @IsDateString()
  invoiceDate: string;

  @ApiProperty({ example: '2025-09-15', description: 'Due date in YYYY-MM-DD format' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 8, description: 'Tax rate in percentage', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  taxRate?: number;

  @ApiProperty({ example: 'Thanks for your business!', description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'draft', description: 'Invoice status', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ type: [CreateInvoiceItemDto], description: 'List of invoice items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
