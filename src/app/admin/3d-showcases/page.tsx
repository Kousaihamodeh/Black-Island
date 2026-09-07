'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Box, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Admin3DShowcasesPage() {
  const [showcases, setShowcases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [key, setKey] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scale, setScale] = useState('1.0');
  const [rotationSpeed, setRotationSpeed] = useState('0.005');
  const [autoRotate, setAutoRotate] = useState(true);
  const [mouseInteraction, setMouseInteraction] = useState(true);
  const [floatingAnim, setFloatingAnim] = useState(true);
  const [lightingPower, setLightingPower] = useState('1.5');
  const [cameraDistance, setCameraDistance] = useState('5.0');
  const [isActive, setIsActive] = useState(true);

  const [uploadingModel, setUploadingModel] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchShowcases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/showcases-3d');
      const data = await res.json();
      if (data.showcases) {
        setShowcases(data.showcases);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setKey(`showcase-${Math.floor(100 + Math.random() * 900)}`);
    setTitleEn('Custom 3D Product Showcase');
    setTitleAr('عرض 3D ثلاثي الأبعاد خاص');
    setModelUrl('');
    setImageUrl('/logo.png');
    setScale('1.0');
    setRotationSpeed('0.005');
    setAutoRotate(true);
    setMouseInteraction(true);
    setFloatingAnim(true);
    setLightingPower('1.5');
    setCameraDistance('5.0');
    setIsActive(true);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setKey(item.key);
    setTitleEn(item.titleEn);
    setTitleAr(item.titleAr);
    setModelUrl(item.modelUrl || '');
    setImageUrl(item.imageUrl || '');
    setScale(String(item.scale || 1.0));
    setRotationSpeed(String(item.rotationSpeed || 0.005));
    setAutoRotate(item.autoRotate);
    setMouseInteraction(item.mouseInteraction);
    setFloatingAnim(item.floatingAnim);
    setLightingPower(String(item.lightingPower || 1.5));
    setCameraDistance(String(item.cameraDistance || 5.0));
    setIsActive(item.isActive);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingModel(true);
    const formData = new FormData();
    formData.append('files', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setUploadingModel(false);
      if (data.success && data.urls[0]) {
        setModelUrl(data.urls[0]);
      }
    } catch (e) {
      setUploadingModel(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('files', e.target.files[0]);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setUploadingImage(false);
      if (data.success && data.urls[0]) {
        setImageUrl(data.urls[0]);
      }
    } catch (e) {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !titleEn || !titleAr) {
      setErrorMsg('Key and Titles are required.');
      return;
    }

    try {
      const url = editingId ? `/api/admin/showcases-3d/${editingId}` : '/api/admin/showcases-3d';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          titleEn,
          titleAr,
          modelUrl,
          imageUrl,
          scale,
          rotationSpeed,
          autoRotate,
          mouseInteraction,
          floatingAnim,
          lightingPower,
          cameraDistance,
          isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchShowcases();
      } else {
        setErrorMsg(data.error || 'Failed to save 3D showcase');
      }
    } catch (e) {
      setErrorMsg('Error saving 3D showcase');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this 3D showcase config?')) return;
    try {
      await fetch(`/api/admin/showcases-3d/${id}`, { method: 'DELETE' });
      fetchShowcases();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">VISUAL 3D ENGINE</span>
          <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">CONFIGURABLE 3D SHOWCASES ({showcases.length})</h1>
        </div>

        <Button variant="gold" onClick={openAddModal} className="flex items-center gap-2 font-bold">
          <Plus className="w-4 h-4" /> Add 3D Showcase Spot
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading 3D Engine configs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showcases.map((sc) => (
            <div key={sc.id} className="bg-brand-950 border border-brand-800 rounded-2xl p-6 space-y-4 font-mono relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-brand-gold font-bold uppercase bg-brand-900 border border-brand-800 px-2 py-0.5 rounded">
                    Key: {sc.key}
                  </span>
                  <h3 className="font-bold text-white text-base mt-2">{sc.titleEn}</h3>
                  <p className="text-xs text-gray-400">{sc.titleAr}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  sc.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400'
                }`}>
                  {sc.isActive ? 'ACTIVE 3D' : 'INACTIVE'}
                </span>
              </div>

              <div className="p-3 bg-brand-900/60 rounded-xl border border-brand-850 space-y-1 text-xs text-gray-300">
                <p>Mode: <strong className="text-white">{sc.modelUrl ? 'GLB / GLTF 3D File' : '2.5D Floating Image Depth Engine'}</strong></p>
                <p>Scale: {sc.scale} • Speed: {sc.rotationSpeed} • Light Power: {sc.lightingPower}</p>
                <p>Auto Rotate: {sc.autoRotate ? 'ON' : 'OFF'} • Mouse Parallax: {sc.mouseInteraction ? 'ON' : 'OFF'}</p>
              </div>

              <div className="pt-3 border-t border-brand-850 flex items-center justify-between text-xs">
                <button onClick={() => openEditModal(sc)} className="text-brand-gold hover:underline flex items-center gap-1">
                  <Edit className="w-3.5 h-3.5" /> Configure 3D Model & Parameters
                </button>
                <button onClick={() => handleDelete(sc.id)} className="text-red-400 hover:underline">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configure 3D Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl animate-fade-in font-mono text-xs my-8">
            <h2 className="text-xl font-display font-bold text-white uppercase">
              {editingId ? 'CONFIGURE 3D SHOWCASE' : 'ADD NEW 3D SHOWCASE'}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">KEY (SPOT IDENTIFIER) *</label>
                  <input
                    type="text"
                    required
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="hero, sneaker, promo..."
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl"
                  />
                </div>
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

              <div>
                <label className="block text-gray-400 mb-1">3D MODEL FILE (.GLB / .GLTF UPLOAD)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modelUrl}
                    onChange={(e) => setModelUrl(e.target.value)}
                    placeholder="/uploads/my-sneaker.glb"
                    className="flex-1 bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl text-[11px]"
                  />
                  <label className="px-3.5 py-2.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-xl cursor-pointer text-white flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingModel ? '...' : 'Upload GLB'}</span>
                    <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">2.5D DEPTH IMAGE FALLBACK (IF NO GLB MODEL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/logo.png or product image URL"
                    className="flex-1 bg-brand-900 border border-brand-700 text-white px-3.5 py-2.5 rounded-xl text-[11px]"
                  />
                  <label className="px-3.5 py-2.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-xl cursor-pointer text-white flex items-center gap-1 font-bold">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">SCALE</label>
                  <input
                    type="number"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">ROTATION SPEED</label>
                  <input
                    type="number"
                    step="0.001"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">LIGHT POWER</label>
                  <input
                    type="number"
                    step="0.5"
                    value={lightingPower}
                    onChange={(e) => setLightingPower(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="accent-brand-gold"
                  />
                  <span>AUTO ROTATE</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mouseInteraction}
                    onChange={(e) => setMouseInteraction(e.target.checked)}
                    className="accent-brand-gold"
                  />
                  <span>MOUSE PARALLAX</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-brand-gold"
                  />
                  <span>SHOWCASE ACTIVE</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="gold" className="flex-1 py-3 font-bold">
                  <Save className="w-4 h-4 mr-2" /> Save 3D Showcase Configuration
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
