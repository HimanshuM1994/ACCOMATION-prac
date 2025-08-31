import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { createConnection } from 'mysql2/promise';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function ensureDatabaseExists() {
  const connection = await createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`invoice_db\`;`);
  await connection.end();
  console.log('✅ Database ensured: invoice_db');
}

async function bootstrap() {
  // ✅ Ensure DB before Nest tries to connect
  await ensureDatabaseExists();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
app.enableCors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // // Global response transformer
  // app.useGlobalInterceptors(new TransformInterceptor());

  // Set global prefix
  app.setGlobalPrefix('api');
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Invoice Management API')
    .setDescription('API documentation for the Invoice Management System')
    .setVersion('1.0')
    .addBearerAuth() // If using JWT Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
  console.log('📖 API Documentation: http://localhost:3000/api-docs');
}

bootstrap();
