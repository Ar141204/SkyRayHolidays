import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    console.warn('⚠️ WARNING: JWT_SECRET is recommended to be at least 32 characters in production.');
  }

  if (process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'true') {
    console.warn('⚠️ NOTICE: COOKIE_SECURE is false or unset. Set COOKIE_SECURE=true when serving over HTTPS.');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
  }

  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });
  app.use(helmet());
  app.use(cookieParser());

  const allowed = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((x) => x.trim());

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      if (
        process.env.NODE_ENV !== 'production' ||
        /\.vercel\.app$/.test(origin) ||
        /\.onrender\.com$/.test(origin) ||
        /skyrayholidays\.com$/.test(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)
      ) {
        return cb(null, true);
      }
      cb(new Error('Origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 SkyRay API is running on port ${port} (prefix: /api/v1)`);
}

bootstrap();
