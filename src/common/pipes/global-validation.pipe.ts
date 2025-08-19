import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      // Your existing configuration is good, keep it
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      validateCustomDecorators: true,

      // Override the exceptionFactory to return a cleaner response
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = this.formatErrors(errors);

        // This is the key change. We are now returning an array of specific error messages.
        return new BadRequestException(messages);
      },
    });
  }

  // You can keep this helper method, but we'll use a simpler version
  // that just extracts the top-level messages for the main response.
  private formatErrors(errors: ValidationError[]): string[] {
    const errorMessages: string[] = [];
    errors.forEach((error) => {
      if (error.constraints) {
        Object.values(error.constraints).forEach((message) => {
          errorMessages.push(message);
        });
      }
      if (error.children && error.children.length > 0) {
        errorMessages.push(...this.formatErrors(error.children));
      }
    });
    return errorMessages;
  }
}
