import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

import 'reflect-metadata';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    console.error('❌ FATAL: JWT_SECRET must be at least 32 characters in production.');
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }

  if (isProduction && process.env.COOKIE_SECURE !== 'true') {
    console.warn('⚠️ NOTICE: COOKIE_SECURE is false or unset. Set COOKIE_SECURE=true when serving over HTTPS.');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  // Security: Disable X-Powered-By header to prevent fingerprinting
  app.disable('x-powered-by');

  if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
  }

  // Set reasonable JSON & form payload limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });

  // Enable Helmet for robust HTTP security headers
  app.use(helmet());
  app.use(cookieParser());

  const allowedOrigins = (process.env.CORS_ORIGINS || 'https://skyrayholidays.com')
    .split(',')
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, cb) => {
      // Allow non-browser requests (e.g. mobile app, curl, server-to-server) without Origin
      if (!origin) return cb(null, true);

      const cleanOrigin = origin.toLowerCase().trim();

      // 1. Check explicitly configured origins in CORS_ORIGINS
      if (allowedOrigins.includes(cleanOrigin)) return cb(null, true);

      try {
        const parsed = new URL(cleanOrigin);
        const host = parsed.hostname;

        // 2. Strict production domain verification
        if (
          host === 'skyrayholidays.com' ||
          host === 'www.skyrayholidays.com' ||
          host === 'skyrayholidays.vercel.app' ||
          host.endsWith('.skyrayholidays.com')
        ) {
          return cb(null, true);
        }

        // 3. Local development and LAN origins (only permitted when NOT in production)
        if (
          !isProduction &&
          (host === 'localhost' ||
            host === '127.0.0.1' ||
            /^192\.168\.\d+\.\d+$/.test(host) ||
            /^10\.\d+\.\d+\.\d+$/.test(host))
        ) {
          return cb(null, true);
        }
      } catch {
        return cb(new Error('Invalid origin format'));
      }

      return cb(new Error('Origin blocked by CORS policy'));
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
  console.log(`🚀 SkyRay API is running securely on port ${port} (prefix: /api/v1)`);
}

bootstrap();
