import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    // This import allows us to fetch env/non-env variables without calling process.env everywhere.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/env/.env.${process.env.NODE_ENV}`,
      load: [appConfig, databaseConfig],
    }),
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'local'
          ? {
              transport: {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
            }
          : {},
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        discovery: {
          warnWhenNoEntities: false,
        },
        autoLoadEntities: true,
        entities: ['./dist/**/entities/*'],
        entitiesTs: ['./src/**/entities/*'],
        type: 'postgresql',
        dbName: configService.get('database.NAME'),
        host: configService.get('database.HOST'),
        port: configService.get('database.PORT'),
        user: configService.get('database.USERNAME'),
        password: configService.get('database.PASSWORD'),
        debug: true,
        logger: (message: string) => console.info(message),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
