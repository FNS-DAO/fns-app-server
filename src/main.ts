import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResInterceptor } from 'src/interceptors/res.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new ResInterceptor())
  app.enableCors()
  await app.listen(3000)
}

bootstrap()
