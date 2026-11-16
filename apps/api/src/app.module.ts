import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validateEnv } from './config/env.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: ConfigService доступен во всех модулях без повторного импорта.
      isGlobal: true,
      // Единый .env лежит в корне монорепо, а api запускается из apps/api.
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
