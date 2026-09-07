import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const revalidate = 0; // Dynamic real-time dashboard

export default async function AdminDashboardPage() {
  let totalSales = 0;
  let totalOrdersCount = 0;
  let pendingOrdersCount = 0;
  let completedOrdersCount = 0;
  let recentOrders: any[] = [];
  let lowStockVariants: any[] = [];

  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    totalOrdersCount = orders.length;
    totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
    completedOrdersCount = orders.filter((o) => o.status === 'DELIVERED').length;
    recentOrders = orders.slice(0, 6);

    lowStockVariants = await prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: true },
      take: 6,
    });
  } catch (err) {
    console.error('Error fetching admin dashboard metrics', err);
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">DAMASCUS STORE METRICS</span>
        <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">DASHBOARD OVERVIEW</h1>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-brand-950 rounded-2xl border border-brand-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">TOTAL REVENUE</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-white">{formatPrice(totalSales)}</p>
          <span className="text-[10px] text-gray-500 font-mono">Accumulated orders volume</span>
        </div>

        <div className="p-6 bg-brand-950 rounded-2xl border border-brand-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">TOTAL ORDERS</span>
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
          </div>
          <p className="text-2xl font-mono font-bold text-white">{totalOrdersCount}</p>
          <span className="text-[10px] text-emerald-400 font-mono">{completedOrdersCount} Delivered</span>
        </div>

        <div className="p-6 bg-brand-950 rounded-2xl border border-brand-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">PENDING ORDERS</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-amber-400">{pendingOrdersCount}</p>
          <span className="text-[10px] text-gray-500 font-mono">Requires processing & dispatch</span>
        </div>

        <div className="p-6 bg-brand-950 rounded-2xl border border-brand-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono uppercase">LOW STOCK ALERTS</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-red-400">{lowStockVariants.length}</p>
          <span className="text-[10px] text-gray-500 font-mono">Variants &le; 5 units</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Customer Orders */}
        <div className="lg:col-span-8 bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-brand-850">
            <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">RECENT ORDERS</h3>
            <Link href="/admin/orders" className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1">
              View All Orders &rarr;
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-brand-850 text-xs font-mono">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">#{order.orderNumber}</span>
                    <span className="text-gray-400 text-[11px]">{order.customerName} • {order.governorate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-gold block">{formatPrice(order.total)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      order.status === 'PENDING' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
          <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">LOW STOCK WARNINGS</h3>
          {lowStockVariants.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">All inventory levels are healthy.</p>
          ) : (
            <div className="space-y-3 text-xs font-mono">
              {lowStockVariants.map((v) => (
                <div key={v.id} className="p-3 bg-brand-900/60 rounded-xl border border-brand-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{v.product.nameEn}</span>
                    <span className="text-gray-400 text-[11px]">{v.size} / {v.colorName}</span>
                  </div>
                  <span className="text-red-400 font-bold bg-red-950/60 px-2 py-1 rounded border border-red-800">
                    {v.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
