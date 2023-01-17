import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: [
      // 'http://localhost:3000/graphql',
      'https://woanso.shop',
      'https://examplezi.shop',
      'https://127.0.0.1:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'https://localhost:3000',
    ],
    credentials: true,
  });
  app.use(graphqlUploadExpress());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(3000);
}
bootstrap();
