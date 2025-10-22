import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

type HealthStatus = {
  status: 'ok' | 'error';
  info: {
    app: { status: 'up' | 'down' };
    db: { status: 'up' | 'down' };
  };
};

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async get(): Promise<HealthStatus> {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        info: { app: { status: 'up' }, db: { status: 'up' } },
      };
    } catch {
      return {
        status: 'error',
        info: { app: { status: 'up' }, db: { status: 'down' } },
      };
    }
  }
}
