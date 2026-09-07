'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonTextEn, setButtonTextEn] = useState('SHOP NOW');
  const [buttonTextAr, setButtonTextAr] = useState('تسوق الآن');
  const [link, setLink] = useState('/shop');
  const [order, setOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.banners) {
        setBanners(data.banners);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitleEn('THE TURKISH DROP • EXCLUSIVE');
    setTitleAr('التشكيلة التركية الفاخرة');
    setSubtitleEn('Heavyweight cottons & tailored streetwear silhouettes.');
    setSubtitleAr('قطنيات ثقيلة وتصاميم ستريت وير فاخرة.');
    setImageUrl('https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600');
    setButtonTextEn('EXPLORE CATALOG');
    setButtonTextAr('استكشف التشكيلة');
    setLink('/shop');
    setOrder(String(banners.length + 1));
    setIsActive(true);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (b: any) => {
    setEditingId(b.id);
    setTitleEn(b.titleEn);
    setTitleAr(b.titleAr);
    setSubtitleEn(b.subtitleEn || '');
    setSubtitleAr(b.subtitleAr || '');
    setImageUrl(b.imageUrl);
    setButtonTextEn(b.buttonTextEn || 'SHOP NOW');
    setButtonTextAr(b.buttonTextAr || 'تسوق الآن');
    setLink(b.link || '/shop');
    setOrder(String(b.order));
    setIsActive(b.isActive);
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
        setImageUrl(data.urls[0]);
      }
    } catch (e) {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleAr || !imageUrl) {
      setErrorMsg('Titles and Banner Image are required.');
      return;
    }

    try {
      const url = editingId ? `/api/admin/banners/${editingId}` : '/api/admin/banners';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn,
          titleAr,
          subtitleEn,
          subtitleAr,
          imageUrl,
          buttonTextEn,
          buttonTextAr,
          link,
          order: parseInt(order),
          isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchBanners();
      } else {
        setErrorMsg(data.error || 'Failed to save banner');
      }
    } catch (e) {
      setErrorMsg('Error saving banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">VISUAL MARKETING</span>
          <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">HOMEPAGE BANNERS ({banners.length})</h1>
        </div>

        <Button variant="gold" onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Banner
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading banners...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-brand-950 border border-brand-800 rounded-2xl overflow-hidden p-6 space-y-4 font-mono">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-brand-900 border border-brand-800 relative">
                <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-bold border border-white/10">
                  Order: #{banner.order}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase text-base">{banner.titleEn}</h3>
                <p className="text-xs text-brand-gold">{banner.titleAr}</p>
                {banner.subtitleEn && <p className="text-xs text-gray-400 mt-1">{banner.subtitleEn}</p>}
              </div>

              <div className="pt-3 border-t border-brand-850 flex items-center justify-between text-xs">
                <button onClick={() => openEditModal(banner)} className="text-brand-gold hover:underline flex items-center gap-1">
                  <Edit className="w-3.5 h-3.5" /> Edit Banner
                </button>
                <button onClick={() => handleDelete(banner.id)} className="text-red-400 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl animate-fade-in font-mono text-xs my-8">
            <h2 className="text-xl font-display font-bold text-white uppercase">
              {editingId ? 'EDIT HOMEPAGE BANNER' : 'ADD HOMEPAGE BANNER'}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">ENGLISH TITLE *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ARABIC TITLE *</label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">BANNER IMAGE (URL OR LOCAL UPLOAD)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash..."
                    className="flex-1 bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl text-[11px]"
                  />
                  <label className="px-3.5 py-2.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-xl cursor-pointer text-white flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {imageUrl && (
                  <div className="mt-2 aspect-[16/9] w-full rounded-xl overflow-hidden border border-brand-800">
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">BUTTON TEXT (EN)</label>
                  <input
                    type="text"
                    value={buttonTextEn}
                    onChange={(e) => setButtonTextEn(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">BUTTON LINK</label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">DISPLAY ORDER</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>

                <div className="pt-6">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-brand-gold w-4 h-4 rounded"
                    />
                    <span>BANNER ACTIVE</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="gold" className="flex-1 py-3 font-bold">
                  <Save className="w-4 h-4 mr-2" /> Save Banner
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
