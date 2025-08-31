import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { ApiResultResponse } from 'src/common/helpers/response.helper';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  @ApiBody({ type: CreateInvoiceDto })
  async create(@Body(ValidationPipe) createInvoiceDto: CreateInvoiceDto, @Request() req) {
    const createInvoice = await this.invoiceService.create(createInvoiceDto, req.user);
    return ApiResultResponse.success(
      'Invoice create successfully',
      HttpStatus.CREATED,
      createInvoice,
    );
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: InvoiceQueryDto, @Request() req) {
    const getallinvoice = await this.invoiceService.findAll(query, req.user);
    console.log(getallinvoice);
    return ApiResultResponse.success(
      'Get all invoice successfully',
      HttpStatus.CREATED,
      getallinvoice,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const invoiceData = await this.invoiceService.findOne(+id, req.user);
    return ApiResultResponse.success(
      'Get invoice successfully',
      HttpStatus.CREATED,
      invoiceData,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateInvoiceDto: UpdateInvoiceDto,
    @Request() req,
  ) {
    return this.invoiceService.update(+id, updateInvoiceDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.invoiceService.remove(+id, req.user);
  }
}