import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/env/app.config';

@Module({
  imports: [
    // This import allows us to fetch env/non-env variables without calling process.env everywhere.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/env/.env.${process.env.NODE_ENV}`,
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
