import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Boilerplate')
    .setDescription('API RESTful com NestJS, TypeORM, SOLID, DDD')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Informe o JWT para autorizar',
      name: 'Authorization',
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
