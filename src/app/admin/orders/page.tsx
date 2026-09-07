'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Send, Phone, MapPin, CheckCircle, Clock, X, Package, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Resolve color-specific image or fallback to main product cover
  const getItemImage = (item: any): string => {
    if (item.product?.variants && Array.isArray(item.product.variants)) {
      const matchVariant = item.product.variants.find(
        (v: any) => v.colorName?.toLowerCase() === item.color?.toLowerCase()
      );
      if (matchVariant) {
        if (matchVariant.colorImage) return matchVariant.colorImage;
        if (matchVariant.colorImages) {
          const imgs = matchVariant.colorImages.split(',').filter(Boolean);
          if (imgs.length > 0) return imgs[0];
        }
      }
    }

    const mainImage =
      item.product?.images?.find((img: any) => img.isMain)?.url ||
      item.product?.images?.[0]?.url;

    return mainImage || '/logo.png';
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">CUSTOMER FULFILLMENT & VISUAL ORDERS</span>
        <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">ORDERS MANAGEMENT ({orders.length})</h1>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading customer orders...</div>
      ) : (
        <div className="bg-brand-950 border border-brand-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-brand-900 border-b border-brand-800 text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="p-4">ORDER ID</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">GOVERNORATE & ADDRESS</th>
                  <th className="p-4">ORDERED ITEMS (LARGE PREVIEW)</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-850">
                {orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-brand-900/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-gold text-sm">#{order.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-bold text-white block text-sm">{order.customerName}</span>
                        <span className="text-gray-400 text-xs block mt-0.5">{order.customerPhone}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-white block font-semibold">{order.governorate}</span>
                        <span className="text-gray-400 text-[11px] block max-w-xs truncate">{order.address}</span>
                      </td>

                      {/* Prominent Large Thumbnails Grid in Order Row */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-4 overflow-hidden py-1">
                            {order.items.slice(0, 3).map((item: any, idx: number) => {
                              const imgUrl = getItemImage(item);
                              return (
                                <div
                                  key={idx}
                                  onClick={() => setLightboxImage({ url: imgUrl, title: `${item.productName} (${item.color} - ${item.size})` })}
                                  className="w-14 h-18 rounded-xl bg-brand-900 border-2 border-brand-800 overflow-hidden shrink-0 cursor-pointer shadow-md hover:scale-105 hover:z-10 transition-all relative group"
                                >
                                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <ZoomIn className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div>
                            <span className="text-white font-bold block">{order.items.length} Product(s)</span>
                            <span className="text-[11px] text-brand-gold font-mono block">
                              {order.items[0]?.productName} ({order.items[0]?.color} / {order.items[0]?.size})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-white text-sm">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase border bg-brand-900 cursor-pointer focus:outline-none ${
                            order.status === 'PENDING'
                              ? 'text-amber-400 border-amber-800'
                              : order.status === 'DELIVERED'
                              ? 'text-emerald-400 border-emerald-800'
                              : 'text-white border-brand-700'
                          }`}
                        >
                          <option value="PENDING" className="bg-brand-950">PENDING</option>
                          <option value="CONFIRMED" className="bg-brand-950">CONFIRMED</option>
                          <option value="PREPARING" className="bg-brand-950">PREPARING</option>
                          <option value="OUT_FOR_DELIVERY" className="bg-brand-950">OUT FOR DELIVERY</option>
                          <option value="DELIVERED" className="bg-brand-950">DELIVERED</option>
                          <option value="CANCELLED" className="bg-brand-950">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-2 bg-brand-gold hover:bg-amber-400 text-black rounded-xl text-xs flex items-center gap-1.5 font-bold ml-auto shadow-md transition-all"
                        >
                          <Eye className="w-4 h-4" /> View Full Order & Photos
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Visual Order Modal with LARGE Photos */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in font-mono text-xs my-auto relative">
            <div className="flex items-center justify-between border-b border-brand-850 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <Package className="w-7 h-7 text-brand-gold" />
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">ORDER FULFILLMENT & PHOTOS</span>
                  <h2 className="text-xl font-bold text-white tracking-widest">#{selectedOrder.orderNumber}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl bg-brand-900 border border-brand-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-6 py-4 scrollbar-thin scrollbar-thumb-brand-700">
              {/* Customer Information Card */}
              <div className="bg-brand-900/60 p-4 rounded-2xl border border-brand-850 space-y-2">
                <h4 className="text-brand-gold font-bold uppercase text-[11px] flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> CUSTOMER & DELIVERY INFO
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300 text-xs">
                  <p>Customer Name: <strong className="text-white font-bold">{selectedOrder.customerName}</strong></p>
                  <p>Phone Number: <strong className="text-white font-bold">{selectedOrder.customerPhone}</strong></p>
                  <p>WhatsApp: <strong className="text-white font-bold">{selectedOrder.customerWhatsapp}</strong></p>
                  <p>Governorate: <strong className="text-white font-bold">{selectedOrder.governorate}</strong></p>
                </div>
                <p className="text-gray-300 pt-1 text-xs">Address: <strong className="text-white">{selectedOrder.address}</strong></p>
                {selectedOrder.notes && (
                  <p className="text-amber-200 pt-1 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/60 text-xs">
                    📝 Customer Notes: {selectedOrder.notes}
                  </p>
                )}
              </div>

              {/* HIGH RESOLUTION LARGE PRODUCT PHOTOS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-brand-800 pb-2">
                  <h4 className="text-brand-gold font-bold uppercase text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> ORDERED PRODUCTS ({selectedOrder.items.length}) - CLICK PHOTO TO ENLARGE
                  </h4>
                  <span className="text-[10px] text-gray-400">High-Resolution Previews</span>
                </div>

                <div className="space-y-4">
                  {selectedOrder.items.map((item: any, idx: number) => {
                    const imgUrl = getItemImage(item);

                    return (
                      <div
                        key={item.id || idx}
                        className="bg-brand-900/50 p-4 rounded-2xl border border-brand-800 flex flex-col sm:flex-row items-center gap-5 hover:border-brand-gold/60 transition-colors"
                      >
                        {/* LARGE PRODUCT IMAGE PREVIEW */}
                        <div
                          onClick={() => setLightboxImage({ url: imgUrl, title: `${item.productName} (${item.color} - ${item.size})` })}
                          className="w-32 sm:w-40 h-40 sm:h-48 rounded-2xl overflow-hidden bg-brand-950 border border-brand-700 shrink-0 cursor-pointer shadow-xl relative group"
                        >
                          <img src={imgUrl} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="px-2.5 py-1 bg-brand-gold text-black text-[10px] font-bold rounded-lg flex items-center gap-1">
                              <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                            </span>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 space-y-3 text-center sm:text-left">
                          <div>
                            <span className="text-[10px] text-brand-gold font-mono uppercase block">ITEM #{idx + 1}</span>
                            <h3 className="text-lg font-bold text-white">{item.productName}</h3>
                          </div>

                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                            <span className="px-3 py-1 bg-brand-950 border border-brand-700 rounded-lg text-white font-bold">
                              Size: <span className="text-brand-gold">{item.size}</span>
                            </span>
                            <span className="px-3 py-1 bg-brand-950 border border-brand-700 rounded-lg text-white font-bold">
                              Color: <span className="text-brand-gold">{item.color}</span>
                            </span>
                            <span className="px-3 py-1 bg-brand-950 border border-brand-700 rounded-lg text-white font-bold">
                              Qty: <span className="text-brand-gold">{item.quantity} pc(s)</span>
                            </span>
                          </div>

                          <div className="pt-2 border-t border-brand-850 flex items-center justify-between">
                            <span className="text-gray-400">Unit Price: {formatPrice(item.price)}</span>
                            <span className="text-base font-bold text-brand-gold">Total: {formatPrice(item.total)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Totals Summary */}
              <div className="bg-brand-900/60 p-4 rounded-2xl border border-brand-850 space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Products Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span className="font-bold">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-amber-200">
                  <span>Delivery Fee</span>
                  <span>Agreed with customer (سيتم الاتفاق عليه)</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-brand-800">
                  <span>Order Total</span>
                  <span className="text-brand-gold">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-brand-850 shrink-0">
              <a
                href={`https://wa.me/963${selectedOrder.customerPhone.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" /> Open Customer WhatsApp
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL FOR HIGH-RES ZOOM */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-brand-700 shadow-2xl flex flex-col items-center">
            <img src={lightboxImage.url} alt="" className="max-h-[80vh] w-auto object-contain rounded-2xl" />
            <div className="p-3 bg-brand-950/90 w-full text-center text-white font-mono text-xs font-bold border-t border-brand-800">
              {lightboxImage.title} (Click anywhere to close)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
