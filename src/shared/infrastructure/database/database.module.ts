import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { makeOrmConfig } from './typeorm.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: () => makeOrmConfig() })],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  static forRoot(options?: TypeOrmModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => options ?? makeOrmConfig(),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
