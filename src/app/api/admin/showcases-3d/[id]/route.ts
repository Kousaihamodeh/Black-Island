import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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

    const showcase = await prisma.showcase3D.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        modelUrl: modelUrl || null,
        imageUrl: imageUrl || null,
        positionX: parseFloat(positionX || 0),
        positionY: parseFloat(positionY || 0),
        positionZ: parseFloat(positionZ || 0),
        scale: parseFloat(scale || 1.0),
        rotationSpeed: parseFloat(rotationSpeed || 0.005),
        autoRotate: !!autoRotate,
        mouseInteraction: !!mouseInteraction,
        floatingAnim: !!floatingAnim,
        lightingPower: parseFloat(lightingPower || 1.5),
        cameraDistance: parseFloat(cameraDistance || 5.0),
        isActive: !!isActive,
      },
    });

    return NextResponse.json({ success: true, showcase });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update 3D showcase' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.showcase3D.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete 3D showcase' }, { status: 500 });
  }
}
