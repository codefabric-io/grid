import { LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import * as chalk from 'chalk';

const os = require('os');

export class AppLogger implements LoggerService {
  private readonly logger: Logger;
  private readonly isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';

    const logFormat = this.isProduction
      ? this.getProductionFormat()   // Structured JSON for production
      : this.getDevelopmentFormat(); // Colorful console log for development

    this.logger = createLogger({
      level: this.isProduction ? 'warn' : 'debug',
      format: logFormat,
      defaultMeta: {
        service: 'grid',
        env: process.env.NODE_ENV || 'development',
        hostname: os.hostname(),
        version: process.env.APP_VERSION || 'dev'
      },
      transports: [
        new transports.Console(),
      ],
    });
  }

  log(message: any, context?: string) {
    this.logger.info({ message, context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({ message, trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn({ message, context });
  }

  debug?(message: any, context?: string) {
    this.logger.debug({ message, context });
  }

  verbose?(message: any, context?: string) {
    this.logger.verbose({ message, context });
  }

  private getProductionFormat() {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
      format.errors({ stack: true }),
      format.json()
    );
  }

  private getDevelopmentFormat() {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      format.printf(({ level, message, context, timestamp }) => {
        const color = this.getColorForLevel(level);
        const contextInfo = context ? chalk.yellow(`[${context}]`) : '';
        return `${timestamp} ${color(level.toUpperCase())} ${contextInfo} ${message}`;
      })
    );
  }

  private getColorForLevel(level: string) {
    switch (level) {
      case 'error':
        return chalk.red;
      case 'warn':
        return chalk.yellow;
      case 'info':
        return chalk.green;
      case 'debug':
        return chalk.blue;
      case 'verbose':
        return chalk.magenta;
      default:
        return chalk.white;
    }
  }
}
