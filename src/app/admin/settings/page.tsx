'use client';

import React, { useState } from 'react';
import { Save, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/ui/Button';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('BLACK ISLAND');
  const [location, setLocation] = useState('Damascus, Syria – Qudsaya');
  const [phone, setPhone] = useState('0938098917');
  const [whatsapp, setWhatsapp] = useState('0938098917');
  const [instagram, setInstagram] = useState('@black_islandd_fashion');
  const [feeDamascus, setFeeDamascus] = useState('15000');
  const [feeOther, setFeeOther] = useState('25000');
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append('files', e.target.files[0]);

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      alert('Logo updated successfully!');
    } catch (e) {
      alert('Failed to upload logo.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      <div>
        <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">SYSTEM CONFIGURATION</span>
        <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">STORE SETTINGS</h1>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Store settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo Upload */}
        <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
          <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">1. BRAND IDENTITY & LOGO</h3>
          <div className="flex items-center gap-6">
            <img src="/logo.png" alt="BLACK ISLAND Logo" className="w-20 h-20 rounded-full border border-brand-gold shadow-xl" />
            <div>
              <label htmlFor="logo-change" className="px-4 py-2 bg-brand-900 border border-brand-700 hover:bg-white hover:text-black rounded-xl text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4" /> Change Logo Image
              </label>
              <input type="file" id="logo-change" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <p className="text-[11px] text-gray-400 mt-2 font-mono">Updates brand logo across header, hero & receipts.</p>
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
          <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">2. CONTACT & SOCIALS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Store Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">WhatsApp Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Syrian Governorates Delivery Fees */}
        <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
          <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">3. SYRIAN DELIVERY FEES MATRIX</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Damascus & Qudsaya Fee ($)</label>
              <input
                type="number"
                value={feeDamascus}
                onChange={(e) => setFeeDamascus(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Other Governorates Fee ($)</label>
              <input
                type="number"
                value={feeOther}
                onChange={(e) => setFeeOther(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <Button type="submit" variant="gold" size="lg" className="w-full py-4 text-sm font-bold">
          <Save className="w-4 h-4 mr-2" /> Save Store Settings
        </Button>
      </form>
    </div>
  );
}
