import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  try {
    config();
  } catch (error) {
    console.error('Error loading .env file');
    console.error(error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  configureSwagger(app);
  enableCors(app);
  setupGlobalPipes(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

function configureSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('CDRRMO API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function enableCors(app) {
  app.enableCors({
    origin: [
      'http://localhost:5173', 'http://cdrrmo-client:5173',
      'http://localhost:8000', 'http://cdrrmo-client:8000',
      'http://localhost',
    ],
    methods: '*',
    credentials: true,
  });
}

function setupGlobalPipes(app) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
}

bootstrap();
