import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpParameterExceptionFilter } from './common/filters/http-parameter-exception.filter';
import MathTools from './utils/MathTools';
/**
 * █████▒█      ██  ▄████▄   ██ ▄█▀     ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒      ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░      ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄      ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄     ██████╔╝╚██████╔╝╚██████╔╝
 * ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒     ╚═════╝  ╚═════╝  ╚═════╝
 * ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 * ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 * ░     ░ ░      ░  ░
 * Copyright 2021 Clover.
 * <p>
 *  程序启动入口文件
 * </p>
 * @author Clover
 * @create 2021-11-08 15:27
 */
async function bootstrap() {
  //生成公私密匙
  MathTools.generateKey();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname, '..', 'resources'), {
    prefix: '/static/',
  });
  app.useGlobalFilters(new HttpParameterExceptionFilter());
  app.enableCors();
  // 开启API文档
  const swaggerOptions = new DocumentBuilder()
    .setTitle('对象网盘API文档')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // 文档访问地址：/doc
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000, () => {
    showBanner();
    console.log('👹👹the application start on the 3000 port...🍺🍺');
  });
}

/**
 * 打印banner
 */
function showBanner() {
  try {
    const bannerPath = path.join(__dirname, '../resources', 'banner.txt');
    const file = fs.readFileSync(bannerPath);
    console.log(file.toString());
  } catch (e) {}
}
bootstrap();
