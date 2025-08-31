import { Controller, Post, Body, ValidationPipe, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResultResponse } from 'src/common/helpers/response.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return ApiResultResponse.success(
      'User registered successfully',
      HttpStatus.CREATED,
      user,
    );
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const user = await this.authService.login(loginDto);
    console.log(user);
    return ApiResultResponse.success(
      'User login successfully',
      HttpStatus.CREATED,
      user,
    );
  }
}