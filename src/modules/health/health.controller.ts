import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from '../auth/public.decorator';

@Controller('health')
export class HealthController {
  constructor(private dataSource: DataSource) {}

  @Get()
  @Public()
  async checkHealth() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok', db: 'connected' };
    } catch (err) {
      return { status: 'error', db: 'unreachable' };
    }
  }
}
