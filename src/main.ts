import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { SecurityConfig } from './config/security.config';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet(SecurityConfig.helmet as any));
  app.use(rateLimit(SecurityConfig.rateLimit));

  // Enable CORS
  app.enableCors(SecurityConfig.cors);

  // Global validation pipe with strict validation
  app.useGlobalPipes(new GlobalValidationPipe());
  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger documentation with proper bearer auth configuration
  const config = new DocumentBuilder()
    .setTitle('LabVerse API')
    .setDescription('Complete project management and CRM system API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching and can be any string
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger with additional options to ensure bearer token works
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps auth data on page refresh
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
