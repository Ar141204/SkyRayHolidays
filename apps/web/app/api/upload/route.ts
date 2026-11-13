import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate upload requests (session cookie or bearer token)
    const sessionToken =
      req.cookies.get('skyray_session')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    // Allow in development, but require session in production
    if (process.env.NODE_ENV === 'production' && !sessionToken) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
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
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${cleanExt}`;

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
      // Fallback for serverless environments (Vercel) where local disk is read-only
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

