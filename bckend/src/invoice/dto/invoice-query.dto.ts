import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class InvoiceQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  fromName?: string;

  @IsOptional()
  @IsString()
  toName?: string;

  @IsOptional()
  @IsDateString()
  invoiceDate?: string;
  
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsString()
  sortBy?: string = 'invoiceDate';

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}