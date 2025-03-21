import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] as string || nanoid(10);
    req.headers['x-request-id'] = requestId;
    (req as any).requestId = requestId;
    next();
  }
}
