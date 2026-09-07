'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Image as ImageIcon, Save, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('0');
  const [isHidden, setIsHidden] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNameEn('');
    setNameAr('');
    setImage('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000');
    setOrder(String(categories.length + 1));
    setIsHidden(false);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setNameEn(cat.nameEn);
    setNameAr(cat.nameAr);
    setImage(cat.image);
    setOrder(String(cat.order));
    setIsHidden(cat.isHidden || false);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('files', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setUploading(false);
      if (data.success && data.urls[0]) {
        setImage(data.urls[0]);
      }
    } catch (e) {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAr) {
      setErrorMsg('Please fill in both English and Arabic names.');
      return;
    }

    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn,
          nameAr,
          image,
          order: parseInt(order),
          isHidden,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchCategories();
      } else {
        setErrorMsg(data.error || 'Failed to save category');
      }
    } catch (e) {
      setErrorMsg('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleHideStatus = async (cat: any) => {
    try {
      await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: cat.nameEn,
          nameAr: cat.nameAr,
          image: cat.image,
          order: cat.order,
          isHidden: !cat.isHidden,
        }),
      });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">STORE TAXONOMY & IMAGES</span>
          <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">CATEGORY MANAGEMENT ({categories.length})</h1>
        </div>

        <Button variant="gold" onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Category
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`bg-brand-950 border rounded-2xl overflow-hidden p-5 space-y-4 transition-all ${
                cat.isHidden ? 'border-brand-850 opacity-60' : 'border-brand-800 hover:border-brand-gold'
              }`}
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-brand-900 border border-brand-800 group">
                <img src={cat.image} alt={cat.nameEn} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded text-[10px] font-mono text-white font-bold border border-white/10">
                    Order: #{cat.order}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white uppercase text-base">{cat.nameEn}</h3>
                  <p className="text-xs text-brand-gold font-mono">{cat.nameAr}</p>
                  <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                    {cat.products?.length || 0} products attached
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  cat.isHidden ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {cat.isHidden ? 'HIDDEN' : 'ACTIVE'}
                </span>
              </div>

              <div className="pt-3 border-t border-brand-850 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => toggleHideStatus(cat)}
                  className="text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {cat.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{cat.isHidden ? 'Unhide' : 'Hide'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button onClick={() => openEditModal(cat)} className="text-brand-gold hover:underline flex items-center gap-1">
                    <Edit className="w-3.5 h-3.5" /> Edit Image & Info
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:underline">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in">
            <h2 className="text-xl font-display font-bold text-white uppercase">
              {editingId ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">ENGLISH NAME *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Hoodies"
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ARABIC NAME *</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="هوديات وسويت شيرت"
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">CATEGORY IMAGE (URL OR LOCAL UPLOAD)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash..."
                    className="flex-1 bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl focus:border-white focus:outline-none text-[11px]"
                  />
                  <label className="px-3 py-2.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-xl cursor-pointer text-white flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {image && (
                  <div className="mt-2 aspect-[16/9] w-full rounded-xl overflow-hidden border border-brand-800">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">DISPLAY ORDER</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl focus:border-white focus:outline-none"
                  />
                </div>

                <div className="pt-6">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHidden}
                      onChange={(e) => setIsHidden(e.target.checked)}
                      className="accent-brand-gold w-4 h-4 rounded"
                    />
                    <span>HIDE CATEGORY</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="gold" className="flex-1 py-3 font-bold">
                  <Save className="w-4 h-4 mr-2" /> Save Category
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
