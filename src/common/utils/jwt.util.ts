// token.util.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenUtil {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Extract user ID from JWT access token
   * @param token - JWT access token (with or without 'Bearer ' prefix)
   * @returns User ID from token payload
   */
  extractUserIdFromToken(token: string): string {
    try {
      // Remove 'Bearer ' prefix if present
      const cleanToken = token.replace(/^Bearer\s+/, '');

      // Decode and verify the token
      const payload = this.jwtService.verify(cleanToken);

      // Extract user ID (adjust the property name based on your JWT payload structure)
      const userId = payload.sub || payload.id || payload.userId;

      if (!userId) {
        throw new UnauthorizedException(
          'Invalid token: User ID not found in token payload',
        );
      }

      return userId;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token format');
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Failed to extract user ID from token');
    }
  }

  /**
   * Extract user ID from request headers
   * @param request - Express request object
   * @returns User ID from Authorization header
   */
  extractUserIdFromRequest(request: any): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    return this.extractUserIdFromToken(authHeader);
  }

  /**
   * Get full token payload
   * @param token - JWT access token
   * @returns Decoded token payload
   */
  getTokenPayload(token: string): any {
    try {
      const cleanToken = token.replace(/^Bearer\s+/, '');
      return this.jwtService.verify(cleanToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

// Updated User Service

import { Request } from 'express';
import { SecurityUtil } from './security.util';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly tokenUtil: TokenUtil, // Inject TokenUtil
  ) {}

  /**
   * Remove user (self-delete) - extracts user ID from token
   * @param request - Express request object containing Authorization header
   */
  async removeSelf(request: Request): Promise<ServiceResponse<void>> {
    try {
      // Extract user ID from token
      const userId = this.tokenUtil.extractUserIdFromRequest(request);

      // Validate the extracted ID
      const validId = SecurityUtil.validateId(userId);

      const user = await this.userRepository.findOne({
        where: { id: validId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);

      return {
        success: true,
        message: 'User account deleted successfully',
        data: undefined,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new Error(`Failed to delete user account: ${error.message}`);
    }
  }

  /**
   * Remove user by ID (admin function) - original functionality
   * @param id - User ID to delete
   */
  async remove(id: string): Promise<ServiceResponse<void>> {
    try {
      const validId = SecurityUtil.validateId(id);

      const user = await this.userRepository.findOne({
        where: { id: validId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);

      return {
        success: true,
        message: 'User deleted successfully',
        data: undefined,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Get current user profile from token
   * @param request - Express request object
   */
  async getCurrentUser(request: Request): Promise<ServiceResponse<User>> {
    try {
      const userId = this.tokenUtil.extractUserIdFromRequest(request);
      const validId = SecurityUtil.validateId(userId);

      const user = await this.userRepository.findOne({
        where: { id: validId },
        select: ['id', 'email', 'password', 'createdAt', 'updatedAt'], // Include password for authentication purposes
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }
}
