import 'reflect-metadata';
import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS habilitado (temporal - abierto para desarrollo)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Validation pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Exception filter global
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3010;
  await app.listen(port, '0.0.0.0');

  console.log(`\n🚀 Flow Backend (NestJS) running on: http://localhost:${port}/api`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.DB_DATABASE}@${process.env.DB_HOST}\n`);
}

bootstrap();
