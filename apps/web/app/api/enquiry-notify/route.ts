import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Sliding window rate limiter for enquiry email notifications (5 requests per 10 min per IP)
const enquiryRateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 5;

  if (enquiryRateMap.size > 2000) {
    for (const [key, val] of enquiryRateMap.entries()) {
      if (val.reset < now) enquiryRateMap.delete(key);
    }
  }

  const record = enquiryRateMap.get(ip);
  if (!record || record.reset < now) {
    enquiryRateMap.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count++;
  return false;
}

function escapeHtml(str: string): string {
  return String(str || '').replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}

export async function POST(req: Request) {
  try {
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    if (isRateLimited(rawIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many enquiry requests. Please wait a few minutes before trying again.' },
        { status: 429 },
      );
    }

    const body = await req.json();

    // Anti-bot honeypot: reject if hidden spam field is populated
    if (body.website || body.botTrap || body.hp) {
      return NextResponse.json({ success: true, message: 'Enquiry received' });
    }

    const {
      reference,
      fullName,
      phone,
      email,
      members,
      preferredDate,
      days,
      instructions,
      packageName,
    } = body;

    // Validate essential inputs
    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and contact phone are required' },
        { status: 400 },
      );
    }

    const safeRef = String(reference || '').slice(0, 30);
    const safeName = String(fullName || '').slice(0, 100);
    const safePhone = String(phone || '').slice(0, 30);
    const safeEmail = String(email || '').slice(0, 100);
    const safePkg = String(packageName || 'General Enquiry').slice(0, 150);
    const safeDate = preferredDate ? String(preferredDate).slice(0, 10) : '—';
    const safeDays = Math.min(Math.max(1, Number(days) || 1), 365);
    const safeMembers = Math.min(Math.max(1, Number(members) || 1), 100);
    const safeInstructions = String(instructions || '').slice(0, 2000);

    const user = (process.env.SMTP_USER || '').replace(/^["']|["']$/g, '').trim();
    const pass = (process.env.SMTP_PASSWORD || '').replace(/^["']|["']$/g, '').trim();
    const to = (process.env.ENQUIRY_NOTIFICATION_EMAIL || user).trim();
    const from = (process.env.SMTP_FROM || `"SkyRay Holidays" <${user}>`).replace(/^[']|[']$/g, '').trim();

    if (!user || !pass) {
      console.warn('⚠️ SMTP credentials not configured in environment. Skipping email dispatch.');
      return NextResponse.json(
        { success: false, error: 'Email service credentials not configured in environment.' },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
      auth: { user, pass },
    } as any);

    const rows = [
      ['Enquiry reference', safeRef || '—'],
      ['Name', safeName],
      ['Phone', safePhone],
      ['Email', safeEmail || '—'],
      ['Members', String(safeMembers)],
      ['Package', safePkg],
      ['Travel date', safeDate],
      ['Days', String(safeDays)],
      ['Instructions', safeInstructions || '—'],
    ];

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#202b36">
        <h2 style="color:#17496b">New customer enquiry</h2>
        <p>A new customer enquiry has been submitted through the SkyRay Holidays portal.</p>
        <h3 style="color:#35a9e0">Reference: ${escapeHtml(safeRef || '—')}</h3>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              (r) => `<tr>
                <td style="border-bottom:1px solid #ddd;color:#687785;font-weight:600">${escapeHtml(r[0])}</td>
                <td style="border-bottom:1px solid #ddd">${escapeHtml(r[1])}</td>
              </tr>`,
            )
            .join('')}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#82909a">SkyRay Holidays · Explore. Plan. Travel.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from,
      to,
      replyTo: safeEmail || undefined,
      subject: `New SkyRay enquiry ${safeRef}`.trim(),
      html,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('Failed to dispatch enquiry notification via Next.js:', err?.message || err);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch email' },
      { status: 500 },
    );
  }
}
