import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

// In-memory rate limiting: 20 uploads per 10 minutes per IP
const uploadRateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 20;

  if (uploadRateMap.size > 2000) {
    for (const [key, val] of uploadRateMap.entries()) {
      if (val.reset < now) uploadRateMap.delete(key);
    }
  }

  const record = uploadRateMap.get(ip);
  if (!record || record.reset < now) {
    uploadRateMap.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count++;
  return false;
}

function verifyAdminSession(token: string): boolean {
  if (!token) return false;

  // Development-only demo bypass with explicit flag
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.ALLOW_DEMO_TOKENS === 'true' &&
    token === 'demo-admin-token'
  ) {
    return true;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is missing. Denying upload authentication.');
    return false;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, sigB64] = parts;

    const expectedSig = crypto
      .createHmac('sha256', jwtSecret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (
      sigB64.length !== expectedSig.length ||
      !crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig))
    ) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    const allowedRoles = ['SUPER_ADMIN', 'CONTENT_MANAGER', 'ENQUIRY_MANAGER'];
    if (payload.role && !allowedRoles.includes(payload.role)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown-ip';

    if (isRateLimited(rawIp)) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please wait a few minutes before trying again.' },
        { status: 429 },
      );
    }

    // 1. Cryptographically authenticate upload requests
    const sessionToken =
      req.cookies.get('skyray_session')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      '';

    if (!verifyAdminSession(sessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid admin authentication token required' },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. MIME type verification
    const mimeType = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP, AVIF, and GIF images are allowed.' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Size validation (max 8MB)
    if (buffer.length > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image exceeds maximum allowed size of 8MB' }, { status: 400 });
    }

    // 4. Sanitize extension & prepare file path
    const rawExt = path.extname(file.name || '').toLowerCase();
    const cleanExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg';
    const filename = `img_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${cleanExt}`;

    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, buffer);

      return NextResponse.json({
        url: `/uploads/${filename}`,
        filename,
        size: buffer.length,
        success: true,
      });
    } catch {
      // Fallback for read-only serverless environments
      const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        url: dataUri,
        filename,
        size: buffer.length,
        success: true,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Image upload failed' }, { status: 500 });
  }
}
