import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHmac,
  timingSafeEqual,
} from 'crypto';

@Injectable()
export class IntegrationsService implements OnModuleInit, OnModuleDestroy {
  private timer: NodeJS.Timeout | null = null;
  private busy = false;
  private readonly log = new Logger(IntegrationsService.name);

  // Cached Google Places reviews (1 hour TTL)
  private googleReviewsCache: { data: any; expiresAt: number } | null = null;

  // Cached Nodemailer transporter
  private cachedTransporter: nodemailer.Transporter | null = null;
  private transporterKey = '';

  constructor(private readonly db: PrismaService) {}

  onModuleInit() {
    this.timer = setInterval(() => this.processJobs().catch((e) => this.log.error(e)), 15000);
    this.processJobs().catch((e) => this.log.error(e));
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async getEnquiry(id: string) {
    return this.db.enquiry.findUnique({ where: { id }, include: { package: true } });
  }

  async processJobs() {
    if (this.busy) return;
    this.busy = true;

    try {
      const now = new Date();
      const stale = new Date(Date.now() - 5 * 60 * 1000);

      const jobs = await this.db.integrationJob.findMany({
        where: {
          OR: [
            { status: 'PENDING', nextAttemptAt: { lte: now } },
            { status: 'PROCESSING', updatedAt: { lt: stale } },
          ],
        },
        take: 8,
        orderBy: { createdAt: 'asc' },
      });

      for (const job of jobs) {
        const claim = await this.db.integrationJob.updateMany({
          where: { id: job.id, status: job.status, updatedAt: job.updatedAt },
          data: { status: 'PROCESSING', attempts: { increment: 1 } },
        });
        if (!claim.count) continue;

        try {
          if (job.type === 'COMPANY_EMAIL' || job.type === 'CUSTOMER_EMAIL') {
            await this.sendEmail(job);
          } else if (job.type === 'EXCEL_SYNC') {
            await this.syncExcel(job);
          }

          await this.db.integrationJob.update({
            where: { id: job.id },
            data: { status: 'SUCCEEDED', lastError: null },
          });
        } catch (e: any) {
          const attempts = job.attempts + 1;
          const permanent = attempts >= 8;
          const blocked = /not configured|has not been connected/i.test(String(e.message || e));

          await this.db.integrationJob.update({
            where: { id: job.id },
            data: {
              status: blocked ? 'BLOCKED' : permanent ? 'FAILED' : 'PENDING',
              lastError: String(e.message || e).slice(0, 1800),
              nextAttemptAt: new Date(Date.now() + Math.min(60, 2 ** attempts) * 60000),
            },
          });
        }
      }
    } catch (err: any) {
      // Database offline or connection issue
      this.log.warn(`Skipping job queue processing (database offline): ${err?.message || err}`);
    } finally {
      this.busy = false;
    }
  }

  private getMailTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE } = process.env;
    const currentKey = `${SMTP_HOST}:${SMTP_PORT}:${SMTP_USER}:${SMTP_SECURE}`;

    if (this.cachedTransporter && this.transporterKey === currentKey) {
      return this.cachedTransporter;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: SMTP_SECURE === 'true',
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
    });

    this.cachedTransporter = transporter;
    this.transporterKey = currentKey;
    return transporter;
  }

  private async sendEmail(job: any) {
    const { SMTP_HOST, SMTP_FROM, ENQUIRY_NOTIFICATION_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_FROM) {
      throw new Error('SMTP is not configured; email job is awaiting provider setup');
    }

    const e = await this.getEnquiry(job.enquiryId);
    if (!e) throw new Error('Enquiry record not found');

    const to =
      job.type === 'COMPANY_EMAIL'
        ? ENQUIRY_NOTIFICATION_EMAIL || process.env.SEED_ADMIN_EMAIL || 'syedrahamathullah@skyrayholidays.com'
        : e.email;
    if (!to) throw new Error('Email recipient is not configured');

    const subject =
      job.type === 'COMPANY_EMAIL'
        ? `New SkyRay enquiry ${e.reference}`
        : `We received your SkyRay Holidays enquiry ${e.reference}`;

    const rows = [
      ['Enquiry reference', e.reference],
      ['Name', e.fullName],
      ['Phone', e.phone],
      ['Email', e.email],
      ['Members', String(e.members)],
      ['Package', e.packageNameSnapshot || 'Not sure yet'],
      ['Travel date', e.preferredDate.toISOString().slice(0, 10)],
      ['Days', String(e.days)],
      ['Instructions', e.instructions || '—'],
    ];

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#202b36">
        <h2 style="color:#17496b">${
          job.type === 'COMPANY_EMAIL' ? 'New customer enquiry' : 'Thank you for contacting SkyRay Holidays'
        }</h2>
        <p>${
          job.type === 'COMPANY_EMAIL'
            ? 'A new enquiry has been submitted through the portal.'
            : 'Your enquiry has been received. Our travel team will review your request and contact you soon.'
        }</p>
        <h3 style="color:#35a9e0">Reference: ${e.reference}</h3>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              (r) => `<tr>
                <td style="border-bottom:1px solid #ddd;color:#687785">${r[0]}</td>
                <td style="border-bottom:1px solid #ddd">${String(r[1]).replace(
                  /[&<>"']/g,
                  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
                )}</td>
              </tr>`,
            )
            .join('')}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#82909a">SkyRay Holidays · Explore. Plan. Travel.</p>
      </div>
    `;

    const transporter = this.getMailTransporter();
    await transporter.sendMail({ from: SMTP_FROM, to, subject, html });
  }

  private encryptionKey() {
    const raw = process.env.MS_TOKEN_ENCRYPTION_KEY;
    if (!raw) throw new Error('Microsoft token encryption key is not configured');
    const key = Buffer.from(raw, 'base64');
    if (key.length !== 32) throw new Error('MS_TOKEN_ENCRYPTION_KEY must be 32 bytes encoded as base64');
    return key;
  }

  private encrypt(value: any) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey(), iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
    return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join('.');
  }

  private decrypt(value: string) {
    const [iv, tag, data] = value.split('.');
    const d = createDecipheriv('aes-256-gcm', this.encryptionKey(), Buffer.from(iv, 'base64'));
    d.setAuthTag(Buffer.from(tag, 'base64'));
    return JSON.parse(Buffer.concat([d.update(Buffer.from(data, 'base64')), d.final()]).toString('utf8'));
  }

  async connectUrl(userId: string) {
    const { MS_TENANT_ID, MS_CLIENT_ID, MS_REDIRECT_URI } = process.env;
    if (!MS_CLIENT_ID || !MS_REDIRECT_URI) throw new Error('Microsoft OAuth settings are not configured');

    const payload = Buffer.from(
      JSON.stringify({ sub: userId, nonce: randomBytes(16).toString('hex'), ts: Date.now() }),
    ).toString('base64url');
    const signature = createHmac('sha256', process.env.JWT_SECRET || 'development-only-change-this-secret-32chars')
      .update(payload)
      .digest('base64url');
    const state = `${payload}.${signature}`;

    const u = new URL(`https://login.microsoftonline.com/${MS_TENANT_ID || 'common'}/oauth2/v2.0/authorize`);
    u.searchParams.set('client_id', MS_CLIENT_ID);
    u.searchParams.set('response_type', 'code');
    u.searchParams.set('redirect_uri', MS_REDIRECT_URI);
    u.searchParams.set('response_mode', 'query');
    u.searchParams.set('scope', 'offline_access Files.ReadWrite User.Read');
    u.searchParams.set('state', state);

    return { url: u.toString() };
  }

  async microsoftCallback(code: string, state: string) {
    const [payload, signature] = String(state || '').split('.');
    if (!payload || !signature) throw new Error('Invalid Microsoft authorization state');

    const expected = createHmac('sha256', process.env.JWT_SECRET || 'development-only-change-this-secret-32chars')
      .update(payload)
      .digest();
    const received = Buffer.from(signature, 'base64url');
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
      throw new Error('Invalid Microsoft authorization state signature');
    }

    const s = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() - s.ts > 10 * 60 * 1000) throw new Error('Microsoft connection state expired');

    const { MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI } = process.env;
    const body = new URLSearchParams({
      client_id: MS_CLIENT_ID || '',
      client_secret: MS_CLIENT_SECRET || '',
      grant_type: 'authorization_code',
      code,
      redirect_uri: MS_REDIRECT_URI || '',
      scope: 'offline_access Files.ReadWrite User.Read',
    });

    const r = await fetch(`https://login.microsoftonline.com/${MS_TENANT_ID || 'common'}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data: any = await r.json();
    if (!r.ok) throw new Error(data.error_description || 'Microsoft authorization failed');

    data.expires_at = Date.now() + Number(data.expires_in) * 1000;
    await this.db.integrationSecret.upsert({
      where: { provider: 'microsoft-graph' },
      create: { provider: 'microsoft-graph', encryptedValue: this.encrypt(data) },
      update: { encryptedValue: this.encrypt(data) },
    });

    return s.sub;
  }

  private async accessToken() {
    const row = await this.db.integrationSecret.findUnique({ where: { provider: 'microsoft-graph' } });
    if (!row) throw new Error('Microsoft 365 has not been connected by an administrator');

    const token = this.decrypt(row.encryptedValue);
    if (token.expires_at && token.expires_at > Date.now() + 120000) {
      return token.access_token;
    }

    const { MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI } = process.env;
    const body = new URLSearchParams({
      client_id: MS_CLIENT_ID || '',
      client_secret: MS_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      redirect_uri: MS_REDIRECT_URI || '',
      scope: 'offline_access Files.ReadWrite User.Read',
    });

    const r = await fetch(`https://login.microsoftonline.com/${MS_TENANT_ID || 'common'}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const next: any = await r.json();
    if (!r.ok) throw new Error(next.error_description || 'Microsoft token refresh failed');

    next.expires_at = Date.now() + Number(next.expires_in) * 1000;
    // CRITICAL: Preserve refresh token if Microsoft omits it in refresh response
    next.refresh_token = next.refresh_token || token.refresh_token;

    await this.db.integrationSecret.update({
      where: { provider: 'microsoft-graph' },
      data: { encryptedValue: this.encrypt(next) },
    });

    return next.access_token;
  }

  private async graph(url: string, init: any = {}) {
    const token = await this.accessToken();
    const r = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error?.message || `Microsoft Graph request failed (${r.status})`);
    return d;
  }

  private async syncExcel(job: any) {
    const { MS_DRIVE_ID, MS_WORKBOOK_ITEM_ID, MS_TABLE_NAME } = process.env;
    if (!MS_DRIVE_ID || !MS_WORKBOOK_ITEM_ID || !MS_TABLE_NAME) {
      throw new Error('Excel workbook location is not configured');
    }

    const e = await this.getEnquiry(job.enquiryId);
    if (!e) throw new Error('Enquiry record not found');

    const base = `https://graph.microsoft.com/v1.0/drives/${MS_DRIVE_ID}/items/${MS_WORKBOOK_ITEM_ID}/workbook/tables/${encodeURIComponent(
      MS_TABLE_NAME,
    )}`;

    // Get table columns count first to align values
    let columnCount = 11;
    try {
      const colData = await this.graph(`${base}/columns?$select=id,name`);
      if (Array.isArray(colData?.value) && colData.value.length > 0) {
        columnCount = colData.value.length;
      }
    } catch {
      // Default to 11 if column check fails
    }

    const fullValues = [
      e.reference,
      e.createdAt.toISOString(),
      e.fullName,
      e.phone,
      e.email,
      e.members,
      e.packageNameSnapshot || 'Not sure yet',
      e.preferredDate.toISOString().slice(0, 10),
      e.days,
      e.instructions || '',
      e.status,
    ];

    // Pad or trim values to match actual table columns
    const values = fullValues.slice(0, columnCount);
    while (values.length < columnCount) {
      values.push('');
    }

    // Check recent 100 rows to find existing reference instead of unbounded scan
    const recentRows = await this.graph(`${base}/rows?$top=100&$orderby=index desc`).catch(() => ({ value: [] }));
    const rows = recentRows?.value || [];
    const existingIndex = rows.findIndex((r: any) => String(r.values?.[0]?.[0]) === e.reference);

    if (existingIndex >= 0) {
      await this.graph(`${base}/rows/itemAt(index=${existingIndex})`, {
        method: 'PATCH',
        body: JSON.stringify({ values: [values] }),
      });
    } else {
      await this.graph(`${base}/rows/add`, {
        method: 'POST',
        body: JSON.stringify({ index: null, values: [values] }),
      });
    }
  }

  async googleReviews() {
    const now = Date.now();
    // Return cached reviews if valid
    if (this.googleReviewsCache && this.googleReviewsCache.expiresAt > now) {
      return this.googleReviewsCache.data;
    }

    const key = process.env.GOOGLE_PLACES_API_KEY;
    const place = process.env.GOOGLE_PLACE_ID;
    if (!key || !place) {
      return { available: false, message: 'Google Business review integration is not configured' };
    }

    try {
      const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
        place,
      )}?fields=displayName,rating,userRatingCount,reviews,googleMapsUri&key=${encodeURIComponent(key)}`;
      const r = await fetch(url, {
        headers: {
          'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews,googleMapsUri',
        },
      });

      const d: any = await r.json();
      if (!r.ok) {
        return { available: false, message: 'Review provider is temporarily unavailable' };
      }

      const result = {
        available: true,
        name: d.displayName?.text,
        rating: d.rating,
        reviewCount: d.userRatingCount,
        reviews: (d.reviews || []).map((x: any) => ({
          author: x.authorAttribution?.displayName,
          rating: x.rating,
          text: x.text?.text,
          publishTime: x.publishTime,
        })),
        url: d.googleMapsUri,
      };

      // Cache for 1 hour
      this.googleReviewsCache = { data: result, expiresAt: now + 60 * 60 * 1000 };
      return result;
    } catch {
      return { available: false, message: 'Review provider is temporarily unavailable' };
    }
  }
}
