import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

const attempts = new Map<string, { count: number; reset: number }>();

@Injectable()
export class LoginRateGuard implements CanActivate {
  private readonly maxEntries = 5000;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxIpAttempts = 50; // Allow multiple staff from same office IP
  private readonly maxAccountAttempts = 10; // Max attempts per specific email account

  static recordSuccess(email?: string) {
    if (email) {
      attempts.delete(`email:${email.toLowerCase().trim()}`);
    }
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const rawIp = req.ip || req.socket?.remoteAddress || 'unknown';
    const ip = String(rawIp).trim().toLowerCase();
    const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : null;
    const now = Date.now();

    this.cleanup(now);

    // 1. Check IP rate limit
    const ipKey = `ip:${ip}`;
    let ipRecord = attempts.get(ipKey);
    if (!ipRecord || ipRecord.reset < now) {
      ipRecord = { count: 1, reset: now + this.windowMs };
      attempts.set(ipKey, ipRecord);
    } else {
      if (ipRecord.count >= this.maxIpAttempts) {
        throw new HttpException(
          'Too many sign-in attempts from this location. Try again in 15 minutes.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      ipRecord.count++;
    }

    // 2. Check Account rate limit if email provided
    if (email) {
      const emailKey = `email:${email}`;
      let emailRecord = attempts.get(emailKey);
      if (!emailRecord || emailRecord.reset < now) {
        emailRecord = { count: 1, reset: now + this.windowMs };
        attempts.set(emailKey, emailRecord);
      } else {
        if (emailRecord.count >= this.maxAccountAttempts) {
          throw new HttpException(
            'Too many failed sign-in attempts for this account. Try again in 15 minutes.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        emailRecord.count++;
      }
    }

    return true;
  }

  private cleanup(now: number) {
    if (attempts.size > this.maxEntries) {
      for (const [key, value] of attempts.entries()) {
        if (value.reset < now) {
          attempts.delete(key);
        }
      }
      if (attempts.size > this.maxEntries) {
        const excess = attempts.size - this.maxEntries;
        let dropped = 0;
        for (const key of attempts.keys()) {
          attempts.delete(key);
          dropped++;
          if (dropped >= excess) break;
        }
      }
    }
  }
}
