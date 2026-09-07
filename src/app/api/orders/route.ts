import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerWhatsapp,
      governorate,
      cityArea,
      address,
      notes,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      items,
    } = body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    const orderNumber = `BI-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerWhatsapp: customerWhatsapp || customerPhone,
        governorate,
        cityArea,
        address,
        notes: notes || null,
        subtotal: parseFloat(subtotal),
        deliveryFee: parseFloat(deliveryFee || 0),
        discount: parseFloat(discount || 0),
        total: parseFloat(total),
        paymentMethod: paymentMethod || 'COD',
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.productName,
            size: item.size,
            color: item.color,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            total: parseFloat(item.total),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    // Optionally decrement stock for variants
    for (const item of items) {
      if (item.productId) {
        const variant = await prisma.productVariant.findFirst({
          where: {
            productId: item.productId,
            size: item.size,
            colorName: item.color,
          },
        });
        if (variant) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { stock: Math.max(0, variant.stock - item.quantity) },
          });
        }
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              include: { images: true, variants: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
