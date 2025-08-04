import { Logger } from '@nestjs/common';
import { SecurityUtil } from './security.util';

export class SafeLogger extends Logger {
  static log(message: any, context?: string) {
    const sanitizedMessage =
      typeof message === 'string'
        ? SecurityUtil.sanitizeLogMessage(message)
        : message;
    super.log(sanitizedMessage, context);
  }

  static error(message: any, trace?: string, context?: string) {
    const sanitizedMessage =
      typeof message === 'string'
        ? SecurityUtil.sanitizeLogMessage(message)
        : message;
    const sanitizedTrace = trace
      ? SecurityUtil.sanitizeLogMessage(trace)
      : trace;
    super.error(sanitizedMessage, sanitizedTrace, context);
  }

  static warn(message: any, context?: string) {
    const sanitizedMessage =
      typeof message === 'string'
        ? SecurityUtil.sanitizeLogMessage(message)
        : message;
    super.warn(sanitizedMessage, context);
  }
}
