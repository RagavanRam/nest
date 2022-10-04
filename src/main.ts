import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //set global validaion pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  //set global prefix for the api's
  app.setGlobalPrefix('api');
  //set swagger document
  const config = new DocumentBuilder()
    .setTitle('SIS NVTC API')
    .addServer('http://')
    .addServer('https://')
    .setDescription('The SIS NVTC API is under development.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customCss: '.swagger-ui .topbar { background-color: #014f79; }',
  });
  //set port for the app
  await app.listen(3000);
}
bootstrap();
