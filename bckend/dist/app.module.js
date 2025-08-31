"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const invoice_module_1 = require("./invoice/invoice.module");
const user_entity_1 = require("./auth/entities/user.entity");
const invoice_entity_1 = require("./invoice/entities/invoice.entity");
const invoice_item_entity_1 = require("./invoice/entities/invoice-item.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DATABASE_HOST || 'localhost',
                port: parseInt(process.env.DATABASE_PORT) || 3306,
                username: process.env.DATABASE_USERNAME || 'root',
                password: process.env.DATABASE_PASSWORD || 'password',
                database: 'invoice_db',
                entities: [user_entity_1.User, invoice_entity_1.Invoice, invoice_item_entity_1.InvoiceItem],
                synchronize: true,
                logging: true,
            }),
            auth_module_1.AuthModule,
            invoice_module_1.InvoiceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map