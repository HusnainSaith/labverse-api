import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  RefreshTokenDto,
  PasswordResetDto,
  ResetPasswordDto,
} from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthCredentialsDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('password-forgot')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() dto: PasswordResetDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req) {
    return {
      success: true,
      message: 'User details retrieved successfully',
      data: {
        id: req.user.userId,
        email: req.user.email
      }
    };
  }
}
