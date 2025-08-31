"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResultResponse = void 0;
const common_1 = require("@nestjs/common");
class ApiResultResponse {
    static success(message, statusCode = common_1.HttpStatus.OK, resultData = null, success = true) {
        return {
            status: true,
            statusCode,
            message,
            resultData,
            success
        };
    }
    static error(message, statusCode = common_1.HttpStatus.BAD_REQUEST, errors = null, success = false) {
        return {
            status: false,
            statusCode,
            message,
            errors,
            success
        };
    }
}
exports.ApiResultResponse = ApiResultResponse;
//# sourceMappingURL=response.helper.js.map