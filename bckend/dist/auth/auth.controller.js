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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const response_helper_1 = require("../common/helpers/response.helper");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        const user = await this.authService.register(registerDto);
        return response_helper_1.ApiResultResponse.success('User registered successfully', common_1.HttpStatus.CREATED, user);
    }
    async login(loginDto) {
        const user = await this.authService.login(loginDto);
        console.log(user);
        return response_helper_1.ApiResultResponse.success('User login successfully', common_1.HttpStatus.CREATED, user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map