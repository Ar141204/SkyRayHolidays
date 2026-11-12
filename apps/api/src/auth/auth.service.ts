import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRateGuard } from '../common/login-rate.guard';

interface AccountSecurity {
  failedAttempts: number;
  lockedUntil: number;
  unlockCode?: string;
  codeExpires?: number;
}

const accountSecurityMap = new Map<string, AccountSecurity>();

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
    const now = Date.now();
    const sec = accountSecurityMap.get(email) || { failedAttempts: 0, lockedUntil: 0 };

    // Check if account is currently locked
    if (sec.lockedUntil > now) {
      const remainingSeconds = Math.ceil((sec.lockedUntil - now) / 1000);
      throw new HttpException(
        {
          message: 'Admin panel is locked due to 5 consecutive failed login attempts.',
          locked: true,
          remainingSeconds,
          email,
        },
        HttpStatus.LOCKED,
      );
    }

    const user = await this.db.adminUser.findUnique({ where: { email } });

    if (!user || !user.active) {
      this.handleFailedAttempt(email, sec);
    }

    const isMatch = await bcrypt.compare(String(body.password), user!.passwordHash);
    if (!isMatch) {
      this.handleFailedAttempt(email, sec);
    }

    // Clear failed attempts upon successful login
    accountSecurityMap.delete(email);
    LoginRateGuard.recordSuccess(email);

    const accessToken = await this.jwt.signAsync({ sub: user!.id, role: user!.role });

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
        actorId: user!.id,
        actorLabel: user!.email,
        action: 'LOGIN',
        entity: 'AdminUser',
        entityId: user!.id,
      },
    });

    return {
      accessToken,
      user: {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
      },
    };
  }

  private handleFailedAttempt(email: string, sec: AccountSecurity) {
    sec.failedAttempts += 1;

    if (sec.failedAttempts >= 5) {
      sec.lockedUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
      sec.unlockCode = Math.floor(100000 + Math.random() * 900000).toString();
      sec.codeExpires = Date.now() + 15 * 60 * 1000;
      accountSecurityMap.set(email, sec);

      // Send emergency unlock code email to owner
      this.sendEmergencyLockEmail(email, sec.unlockCode);

      throw new HttpException(
        {
          message:
            'Admin panel has been locked due to 5 consecutive failed login attempts. A 6-digit emergency unlock code has been sent to the verified owner email.',
          locked: true,
          remainingSeconds: 15 * 60,
          email,
        },
        HttpStatus.LOCKED,
      );
    } else {
      accountSecurityMap.set(email, sec);
      const remaining = 5 - sec.failedAttempts;
      throw new UnauthorizedException(
        `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before admin panel is locked.`,
      );
    }
  }

  async unlock(body: any) {
    const email = String(body?.email || '').toLowerCase().trim();
    const code = String(body?.code || '').trim();

    if (!email || !code) {
      throw new BadRequestException('Email and 6-digit unlock code are required');
    }

    const sec = accountSecurityMap.get(email);
    if (!sec || sec.lockedUntil <= Date.now()) {
      return { ok: true, message: 'Admin panel is not locked. You can sign in.' };
    }

    if (!sec.unlockCode || sec.unlockCode !== code) {
      throw new BadRequestException('Invalid unlock code. Please check your email or request a new code.');
    }

    if (sec.codeExpires && sec.codeExpires < Date.now()) {
      throw new BadRequestException('This unlock code has expired. Please request a new code.');
    }

    // Reset lock
    accountSecurityMap.delete(email);

    await this.db.auditLog.create({
      data: {
        actorLabel: email,
        action: 'PANEL_UNLOCKED_VIA_CODE',
        entity: 'AdminUser',
      },
    });

    return {
      ok: true,
      message: 'Admin panel has been unlocked successfully! You may now sign in with your password.',
    };
  }

  async resendUnlockCode(body: any) {
    const email = String(body?.email || '').toLowerCase().trim();
    if (!email) {
      throw new BadRequestException('Email address is required');
    }

    const sec = accountSecurityMap.get(email);
    if (!sec || sec.lockedUntil <= Date.now()) {
      throw new BadRequestException('Admin panel is not currently locked.');
    }

    sec.unlockCode = Math.floor(100000 + Math.random() * 900000).toString();
    sec.codeExpires = Date.now() + 15 * 60 * 1000;
    accountSecurityMap.set(email, sec);

    await this.sendEmergencyLockEmail(email, sec.unlockCode);

    return {
      ok: true,
      message: 'A new 6-digit emergency unlock code has been sent to your verified email.',
    };
  }

  private async sendEmergencyLockEmail(toEmail: string, code: string) {
    console.log(`\n==================================================`);
    console.log(`🚨 [SECURITY ALERT] PANEL LOCKED FOR: ${toEmail}`);
    console.log(`🔑 EMERGENCY 6-DIGIT UNLOCK CODE: ${code}`);
    console.log(`==================================================\n`);

    try {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, SMTP_SECURE } = process.env;
      if (!SMTP_HOST || !SMTP_USER) return;

      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
      });

      await transporter.sendMail({
        from: `"SkyRay Holidays Security" <${SMTP_FROM || SMTP_USER}>`,
        to: toEmail,
        subject: `🚨 [Security Alert] SkyRay Holidays Admin Panel Locked - Unlock Code: ${code}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #dc2626; margin-top: 0;">🚨 SkyRay Admin Panel Locked</h2>
            <p style="color: #334155; font-size: 15px;">
              5 consecutive incorrect password attempts were detected on your administrator account.
            </p>
            <p style="color: #334155; font-size: 14px;">
              To prevent unauthorized access, the admin panel has been temporarily locked for 15 minutes.
            </p>
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 18px; text-align: center; margin: 24px 0;">
              <span style="font-size: 13px; color: #991b1b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Your Emergency 6-Digit Unlock Code</span>
              <div style="font-size: 32px; font-weight: 800; color: #b91c1c; letter-spacing: 6px; margin-top: 8px;">${code}</div>
            </div>
            <p style="color: #64748b; font-size: 13px;">
              Enter this code on the admin login screen to instantly unlock your panel. This code is valid for 15 minutes.
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <small style="color: #94a6b2;">SkyRay Holidays Security Systems · Automated Security Notification</small>
          </div>
        `,
      });
    } catch (err: any) {
      console.error('Failed to send unlock email via SMTP:', err.message);
    }
  }
}
