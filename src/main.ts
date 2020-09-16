import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalMiddlewares } from './middleware/globalMiddlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true 
  });
  
  const port = process.env.APP_PORT;

  globalMiddlewares(app);
  
  await app.listen(port);
}

bootstrap();