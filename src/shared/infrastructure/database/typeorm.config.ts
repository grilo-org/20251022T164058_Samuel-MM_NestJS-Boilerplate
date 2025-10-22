import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function makeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgres',
    synchronize: false,
    logging: false,
    autoLoadEntities: true,
  };
}

export const ormConfig: TypeOrmModuleOptions = makeOrmConfig();
