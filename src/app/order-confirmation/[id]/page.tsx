import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { OrderConfirmationClient } from './OrderConfirmationClient';

interface OrderConfirmationProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { id } = await params;

  let order = null;

  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      notFound();
    }
  } catch (err) {
    console.error('Error fetching order', err);
  }

  return <OrderConfirmationClient order={order} />;
}
