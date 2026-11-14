import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    const user = (process.env.SMTP_USER || 'contact.skyrayholidays@gmail.com').replace(/^["']|["']$/g, '').trim();
    const pass = (process.env.SMTP_PASSWORD || 'uugb dfnc imon hhyz').replace(/^["']|["']$/g, '').trim();
    const to = (process.env.ENQUIRY_NOTIFICATION_EMAIL || 'syedrahamathullah@skyrayholidays.com').trim();
    const from = (process.env.SMTP_FROM || `"SkyRay Holidays" <${user}>`).replace(/^[']|[']$/g, '').trim();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
      auth: { user, pass },
    } as any);

    const rows = [
      ['Enquiry reference', reference || '—'],
      ['Name', fullName || '—'],
      ['Phone', phone || '—'],
      ['Email', email || '—'],
      ['Members', String(members || 1)],
      ['Package', packageName || 'General Enquiry'],
      ['Travel date', preferredDate ? String(preferredDate).slice(0, 10) : '—'],
      ['Days', String(days || 1)],
      ['Instructions', instructions || '—'],
    ];

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#202b36">
        <h2 style="color:#17496b">New customer enquiry</h2>
        <p>A new customer enquiry has been submitted through the SkyRay Holidays portal.</p>
        <h3 style="color:#35a9e0">Reference: ${reference || '—'}</h3>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              (r) => `<tr>
                <td style="border-bottom:1px solid #ddd;color:#687785;font-weight:600">${r[0]}</td>
                <td style="border-bottom:1px solid #ddd">${String(r[1]).replace(
                  /[&<>"']/g,
                  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || ''),
                )}</td>
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
      replyTo: email || undefined,
      subject: `New SkyRay enquiry ${reference || ''}`.trim(),
      html,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (err: any) {
    console.error('Failed to dispatch enquiry notification via Next.js:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch email' },
      { status: 500 },
    );
  }
}
