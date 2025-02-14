/* eslint-disable import/first */
/* eslint-disable import/no-unassigned-import */
require('tsconfig-paths').register({ baseUrl: 'lib', paths: {} });
require('source-map-support/register');
/* eslint-enable import/no-unassigned-import */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from 'core/config/config.service';
import { EnvVariables } from 'core/config/config.variables';
import { RealTimeRadioModule } from 'real-time-radio/real-time-radio.module';

async function bootstrap() {
  const logger = new Logger('RealTimeRadioGraphQLService');
  const app = await NestFactory.create<NestExpressApplication>(RealTimeRadioModule, {
    logger: ConfigService.getLogLevels(),
  });

  const serverHost = ConfigService.get(EnvVariables.RADIO_SERVER_HOST);
  const serverPort = ConfigService.get(EnvVariables.RADIO_SERVER_PORT);
  const radioServerUrl = `http://${serverHost}:${serverPort}/status`;
  logger.log(`Wait until URL ${radioServerUrl} response.`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require('wait-on')({ resources: [radioServerUrl], timeout: 30000 });
  logger.log(`URL ${radioServerUrl} responded.`);

  await app.init();
  logger.log(`Real time radio service successfully started.`);
}
bootstrap();
