import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import {
  RefreshTokenDto,
  PasswordResetDto,
  ResetPasswordDto,
} from './dto/refresh-token.dto';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { SecurityUtil } from '../../common/utils/security.util';
import { SafeLogger } from '../../common/utils/logger.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    if (!SecurityUtil.validateEmail(dto.email)) {
      throw new UnauthorizedException('Invalid email format');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email, {
      includePassword: true,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(dto: AuthCredentialsDto): Promise<LoginResponseDto> {
    if (!SecurityUtil.validateEmail(dto.email)) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const user = await this.usersService.findByEmail(dto.email, {
      includePassword: true,
    });
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials.');

    const { password: _, ...userSafe } = user;
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.generateRefreshToken(user.id);

    SafeLogger.log(`User logged in: ${dto.email}`, 'AuthService');
    return { accessToken, refreshToken: refreshToken.token, user: userSafe };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: dto.refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = {
      sub: refreshToken.user.id,
      email: refreshToken.user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { isRevoked: true },
    );
  }

  async requestPasswordReset(dto: PasswordResetDto): Promise<void> {
    if (!SecurityUtil.validateEmail(dto.email)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    // In production, send email with reset token
    // For now, just log the token
    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );
    SafeLogger.log(`Password reset requested for user`, 'AuthService');
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(dto.token);
      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      await this.usersService.updatePassword(payload.sub, hashedPassword);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async generateRefreshToken(userId: string): Promise<RefreshToken> {
    const token = await this.jwtService.signAsync(
      { sub: userId, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const refreshToken = this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return this.refreshTokenRepository.save(refreshToken);
  }
}
