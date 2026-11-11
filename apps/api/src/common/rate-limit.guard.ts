import { CanActivate, ExecutionContext, Injectable, TooManyRequestsException } from '@nestjs/common';

@Injectable()
export class EnquiryRateGuard implements CanActivate {
  private attempts = new Map<string, { count: number; reset: number }>();
  private readonly maxEntries = 5000;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly maxAttempts = 10;

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    // Use Express sanitized req.ip (works with 'trust proxy') or remoteAddress
    const rawIp = req.ip || req.socket?.remoteAddress || 'unknown';
    const ip = String(rawIp).trim().toLowerCase();
    const now = Date.now();

    this.cleanup(now);

    let current = this.attempts.get(ip);
    if (!current || current.reset < now) {
      this.attempts.set(ip, { count: 1, reset: now + this.windowMs });
      return true;
    }

    if (current.count >= this.maxAttempts) {
      throw new TooManyRequestsException('Too many enquiry attempts. Please try again later.');
    }

    current.count++;
    return true;
  }

  private cleanup(now: number) {
    if (this.attempts.size > this.maxEntries) {
      for (const [key, value] of this.attempts.entries()) {
        if (value.reset < now) {
          this.attempts.delete(key);
        }
      }
      // If still exceeding threshold after expired eviction, drop oldest entries
      if (this.attempts.size > this.maxEntries) {
        const excess = this.attempts.size - this.maxEntries;
        let dropped = 0;
        for (const key of this.attempts.keys()) {
          this.attempts.delete(key);
          dropped++;
          if (dropped >= excess) break;
        }
      }
    }
  }
}
