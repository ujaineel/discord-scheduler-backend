import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Get port to be used to run app on.
  const port = configService.get('app.PORT');
  console.log(`Listening at port: ${port}`);
  await app.listen(port);
}
bootstrap();
