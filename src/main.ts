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
    .setTitle('test server')
    .setDescription('the server is under development')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/document', app, document);
  //set port for the app
  await app.listen(3000);
}
bootstrap();
