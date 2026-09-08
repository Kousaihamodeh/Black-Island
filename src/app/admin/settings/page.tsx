'use client';

import React, { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { uploadFiles } from '@/lib/uploadHelper';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('BLACK ISLAND');
  const [location, setLocation] = useState('Damascus, Syria – Qudsaya');
  const [phone, setPhone] = useState('0938098917');
  const [whatsapp, setWhatsapp] = useState('0938098917');
  const [instagram, setInstagram] = useState('@black_islandd_fashion');
  const [feeDamascus, setFeeDamascus] = useState('15000');
  const [feeOther, setFeeOther] = useState('25000');
  const [brandIdentityImage, setBrandIdentityImage] = useState('https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBrandImg, setUploadingBrandImg] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/settings?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.settings) {
        const s = data.settings;
        if (s.storeName) setStoreName(s.storeName);
        if (s.location) setLocation(s.location);
        if (s.phone) setPhone(s.phone);
        if (s.whatsapp) setWhatsapp(s.whatsapp);
        if (s.instagram) setInstagram(s.instagram);
        if (s.feeDamascus) setFeeDamascus(s.feeDamascus);
        if (s.feeOther) setFeeOther(s.feeOther);
        if (s.brand_identity_image) setBrandIdentityImage(s.brand_identity_image);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const saveSingleSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: { [key]: value },
        }),
      });
      const data = await res.json();
      setSaving(false);
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to save.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Network error.');
    }
  };

  const handleBrandIdentityUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingBrandImg(true);
    try {
      const urls = await uploadFiles(e.target.files);
      setUploadingBrandImg(false);
      if (urls[0]) {
        setBrandIdentityImage(urls[0]);
        // INSTANT AUTO-SAVE TO CLOUD
        await saveSingleSetting('brand_identity_image', urls[0]);
      }
    } catch (e) {
      setUploadingBrandImg(false);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            storeName,
            location,
            phone,
            whatsapp,
            instagram,
            feeDamascus,
            feeOther,
            brand_identity_image: brandIdentityImage,
          },
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to save settings.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Network error while saving settings.');
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-16 font-sans">
      <div>
        <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">SYSTEM CONFIGURATION</span>
        <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">STORE SETTINGS</h1>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Settings saved & updated live across all devices!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl font-mono">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading settings...</div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-6 font-mono text-xs">
          {/* BRAND IDENTITY EDITORIAL IMAGE SECTION */}
          <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">
                  1. BRAND IDENTITY PHOTO (THE BLACK ISLAND IDENTITY)
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Change the image displayed next to "THE BLACK ISLAND IDENTITY" on the homepage.
                </p>
              </div>

              <Button
                type="button"
                variant="gold"
                size="sm"
                isLoading={saving}
                onClick={() => saveSingleSetting('brand_identity_image', brandIdentityImage)}
                className="font-bold shrink-0"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                <span>Save Identity Photo</span>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-brand-900/40 p-4 rounded-xl border border-brand-850">
              <div className="w-44 h-32 rounded-xl overflow-hidden bg-brand-950 border border-brand-700 relative shrink-0">
                <img src={brandIdentityImage} alt="Brand Identity" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-3 flex-1 w-full">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={brandIdentityImage}
                    onChange={(e) => setBrandIdentityImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl text-xs"
                  />
                  <label className="px-4 py-2.5 bg-brand-gold text-black font-extrabold rounded-xl cursor-pointer hover:bg-amber-400 text-xs flex items-center gap-1 shrink-0 shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingBrandImg ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleBrandIdentityUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[11px] text-gray-500">
                  Upload a photo from your phone/computer or paste an image URL to update the homepage story photo instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
            <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">2. CONTACT & SOCIALS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">Store Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">Instagram Handle</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Syrian Delivery Fees */}
          <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
            <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">3. SYRIAN DELIVERY FEES MATRIX</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">Damascus & Qudsaya Fee ($)</label>
                <input
                  type="number"
                  value={feeDamascus}
                  onChange={(e) => setFeeDamascus(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1.5 uppercase">Other Governorates Fee ($)</label>
                <input
                  type="number"
                  value={feeOther}
                  onChange={(e) => setFeeOther(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 text-white px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="gold" size="lg" isLoading={saving} className="w-full py-4 text-sm font-bold">
            <Save className="w-4 h-4 mr-2" /> Save All Store Settings
          </Button>
        </form>
      )}
    </div>
  );
}
