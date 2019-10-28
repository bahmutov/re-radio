require('tsconfig-paths/register'); // This line must be placed first
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from 'core/config/config.service';
import { EnvVariables } from 'core/config/config.variables';
import { RadioModule } from 'radio/radio.module';

async function bootstrap() {
  const logger = new Logger('RadioGraphQLService');
  const app = await NestFactory.create<NestExpressApplication>(RadioModule);
  const port = app.get(ConfigService).get(EnvVariables.RADIO_SERVER_PORT);
  await app.listen(port);
  logger.log(`Radio GraphQL service successfully started at port ${port}.`);
}
bootstrap();
