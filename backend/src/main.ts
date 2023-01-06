import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://woanso.shop',
      'https://examplezi.shop',
    ],
    credentials: true,
  });
  app.use(graphqlUploadExpress());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(3000);
}
bootstrap();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalFilters(new HttpExceptionFilter());

//   app.use(graphqlUploadExpress()); // 16버전에 문제 있음 => 13.0.0으로 변경
//   await app.listen(3000);
// }
// bootstrap();
