import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const showcases = await prisma.showcase3D.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ showcases });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch 3D showcases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      key,
      titleEn,
      titleAr,
      modelUrl,
      imageUrl,
      positionX,
      positionY,
      positionZ,
      scale,
      rotationSpeed,
      autoRotate,
      mouseInteraction,
      floatingAnim,
      lightingPower,
      cameraDistance,
      isActive,
    } = body;

    if (!key || !titleEn || !titleAr) {
      return NextResponse.json({ error: 'Key and Titles are required' }, { status: 400 });
    }

    const showcase = await prisma.showcase3D.create({
      data: {
        key: key.toLowerCase().trim(),
        titleEn,
        titleAr,
        modelUrl: modelUrl || null,
        imageUrl: imageUrl || null,
        positionX: parseFloat(positionX || 0),
        positionY: parseFloat(positionY || 0),
        positionZ: parseFloat(positionZ || 0),
        scale: parseFloat(scale || 1.0),
        rotationSpeed: parseFloat(rotationSpeed || 0.005),
        autoRotate: autoRotate !== false,
        mouseInteraction: mouseInteraction !== false,
        floatingAnim: floatingAnim !== false,
        lightingPower: parseFloat(lightingPower || 1.5),
        cameraDistance: parseFloat(cameraDistance || 5.0),
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, showcase });
  } catch (error) {
    console.error('Create 3D showcase error:', error);
    return NextResponse.json({ error: 'Failed to create 3D showcase' }, { status: 500 });
  }
}
