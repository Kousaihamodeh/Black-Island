import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    let files = (formData.getAll('files') as File[]).filter(Boolean);

    if (files.length === 0) {
      const singleFile = formData.get('file') as File;
      if (singleFile) files = [singleFile];
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const savedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    let canWriteToDisk = true;

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      canWriteToDisk = false;
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      if (canWriteToDisk) {
        try {
          const filePath = path.join(uploadDir, filename);
          await writeFile(filePath, buffer);
          savedUrls.push(`/uploads/${filename}`);
          continue;
        } catch (err) {
          console.warn('Disk write failed, converting to Base64 data URL:', err);
        }
      }

      // Base64 Data URL Fallback for serverless or read-only environments
      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      savedUrls.push(dataUrl);
    }

    return NextResponse.json({ success: true, urls: savedUrls, count: savedUrls.length });
  } catch (error: any) {
    console.error('Upload Route Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to upload image files' }, { status: 500 });
  }
}

