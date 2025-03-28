import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { ValidationPipe } from '@nestjs/common';
=======
import { BadRequestException, ValidationPipe } from '@nestjs/common';
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
<<<<<<< HEAD
    forbidNonWhitelisted: true
=======
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new BadRequestException(errors),
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  }));

  await app.listen(3001);
}
bootstrap();
