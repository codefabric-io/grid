import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const duration = Date.now() - now;
        this.logger.log(
          `${method} ${url} - ${statusCode} - ${duration}ms`,
          `Request ${request.requestId}`
        );
      }),
      catchError((err) => {
        const duration = Date.now() - now;
        const statusCode = err.status || 500;

        this.logger.error(
          `${method} ${url} - ${statusCode} - ${duration}ms - ${err.message}`,
          err.stack,
          `Request ${request.requestId}`
        );

        // TODO: integrate external error reporting (e.g., Sentry)
        // Example:
        // Sentry.withScope((scope) => {
        //   scope.setTag('service', 'grid');
        //   scope.setContext('request', {
        //     method,
        //     url,
        //     headers: request.headers,
        //     requestId: request.requestId,
        //   });
        //   if (request.user) {
        //     scope.setUser({ email: request.user.email, id: request.user.id });
        //   }
        //   Sentry.captureException(err);
        // });

        return throwError(() => err);
      })
    );
  }
}
