export interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  governorate: string;
  cityArea: string;
  address: string;
  notes?: string | null;
  items: Array<{
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee?: number;
  discount: number;
  total: number;
  paymentMethod: string;
}

export function generateWhatsAppOrderMessage(
  payload: WhatsAppOrderPayload,
  phone: string = '0938098917'
): string {
  let formattedPhone = phone.trim().replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '963' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('963')) {
    formattedPhone = '963' + formattedPhone;
  }

  const itemsList = payload.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*\n   • المقاس (Size): *${item.size}*\n   • اللون (Color): *${item.color}*\n   • الكمية (Qty): ${item.quantity} x $${item.price.toLocaleString()}`
    )
    .join('\n\n');

  const text = `🔥 *طلب جديد - BLACK ISLAND* 🔥
---------------------------------
📌 *رقم الطلب:* #${payload.orderNumber}
👤 *الاسم:* ${payload.customerName}
📞 *رقم الهاتف:* ${payload.customerPhone}
💬 *واتساب:* ${payload.customerWhatsapp}
📍 *المحافظة:* ${payload.governorate}
🏙️ *المنطقة/المدينة:* ${payload.cityArea}
🏠 *العنوان التفصيلي:* ${payload.address}
${payload.notes ? `📝 *ملاحظات:* ${payload.notes}\n` : ''}
---------------------------------
🛍️ *المنتجات المطلوبة:*

${itemsList}

---------------------------------
💰 *مجموع المنتجات:* $${payload.subtotal.toLocaleString()}
🚚 *التوصيل:* سيتم الاتفاق معك على أجور التوصيل عند تأكيد الطلب
${payload.discount > 0 ? `🎟️ *الخصم:* -$${payload.discount.toLocaleString()}\n` : ''}
💳 *إجمالي المنتجات:* *$${payload.total.toLocaleString()}*
---------------------------------
🚚 *طريقة الدفع:* ${payload.paymentMethod === 'COD' ? 'الدفع نقداً عند الاستلام (COD)' : 'طلب عبر الواتساب'}

شكراً لتعاملكم مع BLACK ISLAND 🇹🇷`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}
