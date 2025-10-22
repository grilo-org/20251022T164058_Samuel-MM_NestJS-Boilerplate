import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from '@/shared/infrastructure/exception-filters/all-exceptions.filter';
import { setupSwagger } from '@/shared/infrastructure/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: false, value: false },
      exceptionFactory: (errors) => {
        const messages = errors.map((e) => ({
          fields: e.property,
          messages: Object.values(e.constraints ?? {}),
        }));
        return new UnprocessableEntityException({
          statusCode: 422,
          message: 'Dados inválidos',
          errors: messages,
        });
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
