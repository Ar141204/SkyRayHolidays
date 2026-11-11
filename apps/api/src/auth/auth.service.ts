import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRateGuard } from '../common/login-rate.guard';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(body: any, res: Response) {
    if (!body?.email || !body?.password) {
      throw new BadRequestException('Email and password are required');
    }

    const email = String(body.email).toLowerCase().trim();
    const user = await this.db.adminUser.findUnique({ where: { email } });

    if (!user || !user.active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(String(body.password), user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Clear rate limiter tracking for successfully authenticated account
    LoginRateGuard.recordSuccess(email);

    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });

    const isSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
    const sameSiteMode = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

    res.cookie('skyray_session', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSiteMode,
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    });

    await this.db.auditLog.create({
      data: {
        actorId: user.id,
        actorLabel: user.email,
        action: 'LOGIN',
        entity: 'AdminUser',
        entityId: user.id,
      },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
