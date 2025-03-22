import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppLogger } from './logger/logger.service';

const logger = new AppLogger();

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error.stack);
});

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { logger });
    app.useGlobalInterceptors(new LoggingInterceptor(logger));
    app.useGlobalFilters(new HttpExceptionFilter());
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Grid is running at http://localhost:${port}`);
  } catch (err) {
    logger.error('Failed to start Grid.', err.stack);
    process.exit(1);
  }
}

bootstrap();
