import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InvoiceModule } from './invoice/invoice.module';
import { User } from './auth/entities/user.entity';
import { Invoice } from './invoice/entities/invoice.entity';
import { InvoiceItem } from './invoice/entities/invoice-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: 'invoice_db',
      entities: [User, Invoice, InvoiceItem],
      synchronize: true, // Set to false in production
      logging: true,
    }),
    AuthModule,
    InvoiceModule,
  ],
})
export class AppModule {}