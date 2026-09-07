import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  let variants: any[] = [];
  try {
    variants = await prisma.productVariant.findMany({
      include: { product: true },
      orderBy: { stock: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching inventory', err);
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">STOCK MATRIX</span>
        <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">INVENTORY CONTROL ({variants.length})</h1>
      </div>

      <div className="bg-brand-950 border border-brand-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-brand-900 border-b border-brand-800 text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">PRODUCT</th>
              <th className="p-4">SIZE</th>
              <th className="p-4">COLOR</th>
              <th className="p-4">CURRENT STOCK</th>
              <th className="p-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-850">
            {variants.map((v) => (
              <tr key={v.id} className="hover:bg-brand-900/40">
                <td className="p-4 font-bold text-white">{v.product.nameEn}</td>
                <td className="p-4 font-mono font-bold text-brand-gold">{v.size}</td>
                <td className="p-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.colorHex }} />
                  <span>{v.colorName}</span>
                </td>
                <td className="p-4 font-bold font-mono text-white">{v.stock} units</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.stock > 10 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                  }`}>
                    {v.stock > 10 ? 'HEALTHY' : 'LOW STOCK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
