"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const promise_1 = require("mysql2/promise");
const swagger_1 = require("@nestjs/swagger");
async function ensureDatabaseExists() {
    const connection = await (0, promise_1.createConnection)({
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
    await ensureDatabaseExists();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Invoice Management API')
        .setDescription('API documentation for the Invoice Management System')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(3000);
    console.log('🚀 Server running on http://localhost:3000');
    console.log('📖 API Documentation: http://localhost:3000/api-docs');
}
bootstrap();
//# sourceMappingURL=main.js.map