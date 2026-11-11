import { CanActivate, ExecutionContext, Injectable, TooManyRequestsException } from '@nestjs/common';

@Injectable()
export class LoginRateGuard implements CanActivate {
  private static attempts = new Map<string, { count: number; reset: number }>();
  private readonly maxEntries = 5000;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxIpAttempts = 50; // Allow multiple staff from same office IP
  private readonly maxAccountAttempts = 10; // Max attempts per specific email account

  static recordSuccess(email?: string) {
    if (email) {
      LoginRateGuard.attempts.delete(`email:${email.toLowerCase().trim()}`);
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
    let ipRecord = LoginRateGuard.attempts.get(ipKey);
    if (!ipRecord || ipRecord.reset < now) {
      ipRecord = { count: 1, reset: now + this.windowMs };
      LoginRateGuard.attempts.set(ipKey, ipRecord);
    } else {
      if (ipRecord.count >= this.maxIpAttempts) {
        throw new TooManyRequestsException('Too many sign-in attempts from this location. Try again in 15 minutes.');
      }
      ipRecord.count++;
    }

    // 2. Check Account rate limit if email provided
    if (email) {
      const emailKey = `email:${email}`;
      let emailRecord = LoginRateGuard.attempts.get(emailKey);
      if (!emailRecord || emailRecord.reset < now) {
        emailRecord = { count: 1, reset: now + this.windowMs };
        LoginRateGuard.attempts.set(emailKey, emailRecord);
      } else {
        if (emailRecord.count >= this.maxAccountAttempts) {
          throw new TooManyRequestsException('Too many failed sign-in attempts for this account. Try again in 15 minutes.');
        }
        emailRecord.count++;
      }
    }

    return true;
  }

  private cleanup(now: number) {
    if (LoginRateGuard.attempts.size > this.maxEntries) {
      for (const [key, value] of LoginRateGuard.attempts.entries()) {
        if (value.reset < now) {
          LoginRateGuard.attempts.delete(key);
        }
      }
      if (LoginRateGuard.attempts.size > this.maxEntries) {
        const excess = LoginRateGuard.attempts.size - this.maxEntries;
        let dropped = 0;
        for (const key of LoginRateGuard.attempts.keys()) {
          LoginRateGuard.attempts.delete(key);
          dropped++;
          if (dropped >= excess) break;
        }
      }
    }
  }
}
