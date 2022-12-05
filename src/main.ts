import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { Logger as AppLogger } from '@nestjs/common';

async function bootstrap() {
  const logger = new AppLogger('App');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.flushLogs();
  const configService = app.get(ConfigService);
  // Get port to be used to run app on.
  const port = configService.get('app.PORT');
  if (process.env.NODE_ENV === 'local') {
    logger.log({ port: port }, 'App Started and listening');
  }
  await app.listen(port);
}
bootstrap();
