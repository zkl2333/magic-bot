import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from './transform.interceptor'
import { AllExceptionsFilter } from './all-exceptions.filter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const config = new DocumentBuilder()
    .setTitle('AI Web')
    .setDescription('The AI Web API description')
    .setVersion('1.0')
    .addTag('AI Web')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(configService.get('PORT') || 3000)
}

bootstrap()
