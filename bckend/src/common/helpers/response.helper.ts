// src/common/helpers/response.helper.ts
import { HttpStatus } from '@nestjs/common';

export class ApiResultResponse {
  static success(
    message: string,
    statusCode: number = HttpStatus.OK,
    resultData: any = null,
    success: boolean = true,
  ) {
    return {
      status: true,
      statusCode,
      message,
      resultData,
      success
    };
  }

  static error(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    errors: any = null,
    success: boolean = false,
  ) {
    return {
      status: false,
      statusCode,
      message,
      errors,
      success
    };
  }
}
