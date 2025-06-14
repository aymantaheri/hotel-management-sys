import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  await app.listen(3003, '0.0.0.0');
  console.log('Reservation Service is running on http://localhost:3003');
}
bootstrap();

