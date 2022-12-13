// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { CrudConfigService } from '@nestjsx/crud';

CrudConfigService.load({
  query: {
    limit: 25,
    cache: 2000,
    alwaysPaginate: true,
  },
});
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

Logger.debug('Welcome ! API is running in ' + process.env.NODE_ENV + ' mode\n');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (process.env.NODE_ENV === 'dev') {
    const options = new DocumentBuilder()
      .setTitle('Mamimomo-API')
      .setDescription('The Mamimomo API documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: [
      configService.get('CLIENT_BASE_URL'),
      configService.get('PRO_BASE_URL'),
    ],
  });
  await app.listen(process.env.API_PORT);
}
bootstrap();
