'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setCode(`BLACK${Math.floor(10 + Math.random() * 90)}`);
    setType('PERCENTAGE');
    setValue('10');
    setMinOrder('300000');
    setUsageLimit('100');
    setIsActive(true);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingId(c.id);
    setCode(c.code);
    setType(c.type);
    setValue(String(c.value));
    setMinOrder(c.minOrder ? String(c.minOrder) : '');
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : '');
    setIsActive(c.isActive);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) {
      setErrorMsg('Code and discount value are required.');
      return;
    }

    try {
      const url = editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          type,
          value,
          minOrder: minOrder || null,
          usageLimit: usageLimit || null,
          isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCoupons();
      } else {
        setErrorMsg(data.error || 'Failed to save coupon');
      }
    } catch (e) {
      setErrorMsg('Error saving coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">DISCOUNT CAMPAIGNS</span>
          <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">PROMO COUPONS ({coupons.length})</h1>
        </div>

        <Button variant="gold" onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Coupon
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading coupons...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4 font-mono relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-brand-gold tracking-widest">{coupon.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  coupon.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400'
                }`}>
                  {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300">
                <p>Discount: <strong className="text-white">{coupon.type === 'PERCENTAGE' ? `${coupon.value}% OFF` : formatPrice(coupon.value)}</strong></p>
                {coupon.minOrder && <p className="text-gray-400">Min Order: {formatPrice(coupon.minOrder)}</p>}
                {coupon.usageLimit && <p className="text-gray-400">Limit: {coupon.usedCount || 0} / {coupon.usageLimit} uses</p>}
              </div>

              <div className="pt-4 border-t border-brand-850 flex items-center justify-between text-xs">
                <button onClick={() => openEditModal(coupon)} className="text-brand-gold hover:underline flex items-center gap-1">
                  <Edit className="w-3.5 h-3.5" /> Edit Coupon
                </button>
                <button onClick={() => handleDelete(coupon.id)} className="text-red-400 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in font-mono text-xs">
            <h2 className="text-xl font-display font-bold text-white uppercase">
              {editingId ? 'EDIT COUPON' : 'CREATE PROMO COUPON'}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">COUPON CODE (UPPERCASE) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BLACK10"
                  className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">DISCOUNT TYPE *</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl focus:border-white focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">DISCOUNT VALUE *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="10 or 5"
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">MIN ORDER AMOUNT ($)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="500000"
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">USAGE LIMIT (OPTIONAL)</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="100"
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-brand-gold w-4 h-4 rounded"
                  />
                  <span>COUPON ACTIVE</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="gold" className="flex-1 py-3 font-bold">
                  <Save className="w-4 h-4 mr-2" /> Save Coupon
                </Button>
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
