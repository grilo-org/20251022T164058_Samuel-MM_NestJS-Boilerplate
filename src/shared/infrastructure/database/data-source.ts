import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { makeOrmConfig } from './typeorm.config';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const conf = makeOrmConfig() as PostgresConnectionOptions;
const { host, port, username, password, database } = conf;
const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database: typeof database === 'string' ? database : undefined,
  synchronize: false,
  logging: false,
  entities: [
    'src/**/*.entity.ts',
    'src/**/*.typeorm.entity.ts',
    'dist/**/*.entity.js',
    'dist/**/*.typeorm.entity.js',
  ],
  migrations: [
    'src/shared/infrastructure/database/migrations/*{.ts,.js}',
    'dist/shared/infrastructure/database/migrations/*{.js}',
  ],
});

export default AppDataSource;
