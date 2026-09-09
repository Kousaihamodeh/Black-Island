'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, Trash2, ArrowLeft, CheckCircle, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { uploadFiles } from '@/lib/uploadHelper';

interface ColorVariantCard {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: Array<{ size: string; stock: number }>;
}

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [sku, setSku] = useState(`BI-DROP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categorySlug, setCategorySlug] = useState('hoodies');
  const [featured, setFeatured] = useState(true);
  const [isNew, setIsNew] = useState(true);

  // 1. Standalone Optional Main Cover Image
  const [mainCoverImage, setMainCoverImage] = useState<string | null>(null);
  const [uploadingMain, setUploadingMain] = useState(false);

  // 2. Color Variant Cards (Multi-photo items per color!)
  const standardSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const [colorCards, setColorCards] = useState<ColorVariantCard[]>([]);
  const [uploadingColorCardId, setUploadingColorCardId] = useState<string | null>(null);
  const [uploadingNewColorGroup, setUploadingNewColorGroup] = useState(false);
  const [customSizeInputs, setCustomSizeInputs] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories[0]) {
            setCategorySlug(data.categories[0].slug);
          }
        }
      });
  }, []);

  // Upload Standalone Main Cover Image
  const handleMainCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const inputElement = e.target;
    setUploadingMain(true);
    try {
      const urls = await uploadFiles(files);
      setUploadingMain(false);
      if (urls[0]) {
        setMainCoverImage(urls[0]);
      }
    } catch (err) {
      setUploadingMain(false);
    } finally {
      inputElement.value = '';
    }
  };

  // Add a Blank Color Group
  const handleAddBlankColorGroup = () => {
    const newCard: ColorVariantCard = {
      id: `color-card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      colorName: `Color Option ${colorCards.length + 1}`,
      colorHex: '#000000',
      images: [],
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 20 },
      ],
    };
    setColorCards((prev) => [...prev, newCard]);
  };

  // Add a New Color Group with Uploaded Photos/Sweaters
  const handleCreateColorGroup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const inputElement = e.target;
    setUploadingNewColorGroup(true);
    try {
      const urls = await uploadFiles(files);
      setUploadingNewColorGroup(false);
      if (urls.length > 0) {
        const newCard: ColorVariantCard = {
          id: `color-card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          colorName: `Color Option ${colorCards.length + 1}`,
          colorHex: '#000000',
          images: urls,
          sizes: [
            { size: 'S', stock: 10 },
            { size: 'M', stock: 15 },
            { size: 'L', stock: 20 },
          ],
        };
        setColorCards((prev) => [...prev, newCard]);
      }
    } catch (err) {
      setUploadingNewColorGroup(false);
    } finally {
      inputElement.value = '';
    }
  };

  // Add More Photos to an Existing Color Variant Card
  const handleAddPhotosToColorCard = async (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const inputElement = e.target;
    setUploadingColorCardId(cardId);
    try {
      const urls = await uploadFiles(files);
      setUploadingColorCardId(null);
      if (urls.length > 0) {
        setColorCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, images: [...c.images, ...urls] } : c))
        );
      }
    } catch (err) {
      setUploadingColorCardId(null);
    } finally {
      inputElement.value = '';
    }
  };

  const removePhotoFromColorCard = (cardId: string, photoIndex: number) => {
    setColorCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedImages = c.images.filter((_, idx) => idx !== photoIndex);
        return { ...c, images: updatedImages };
      })
    );
  };

  const removeColorCard = (cardId: string) => {
    setColorCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const updateCardField = (cardId: string, field: keyof ColorVariantCard, value: any) => {
    setColorCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, [field]: value } : c))
    );
  };

  const toggleSizeForCard = (cardId: string, size: string) => {
    setColorCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const exists = c.sizes.some((s) => s.size === size);
        const updatedSizes = exists
          ? c.sizes.filter((s) => s.size !== size)
          : [...c.sizes, { size, stock: 15 }];
        return { ...c, sizes: updatedSizes };
      })
    );
  };

  const updateStockForCardSize = (cardId: string, size: string, stock: number) => {
    setColorCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedSizes = c.sizes.map((s) =>
          s.size === size ? { ...s, stock: Math.max(0, stock) } : s
        );
        return { ...c, sizes: updatedSizes };
      })
    );
  };

  const addCustomSizeToCard = (cardId: string) => {
    const val = (customSizeInputs[cardId] || '').trim().toUpperCase();
    if (!val) return;
    setColorCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        if (c.sizes.some((s) => s.size === val)) return c;
        return { ...c, sizes: [...c.sizes, { size: val, stock: 15 }] };
      })
    );
    setCustomSizeInputs((prev) => ({ ...prev, [cardId]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalNameAr = nameAr.trim() || nameEn.trim();
    const finalNameEn = nameEn.trim() || nameAr.trim();
    const finalCategorySlug = categorySlug || 'hoodies';

    if (!finalNameAr || !price || !sku) {
      setErrorMsg('Please fill in at least Title (Arabic or English), Price, and SKU Code.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!mainCoverImage && colorCards.length === 0) {
      setErrorMsg('Please upload a Main Cover Image or at least 1 Color Variant Option.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Assembly of all product images
    const allImages: string[] = [];
    if (mainCoverImage) allImages.push(mainCoverImage);
    colorCards.forEach((c) => {
      c.images.forEach((imgUrl) => {
        if (imgUrl && !allImages.includes(imgUrl)) allImages.push(imgUrl);
      });
    });

    if (allImages.length === 0) {
      allImages.push('/black_island_storefront.jpg');
    }

    const computedVariants: any[] = [];
    colorCards.forEach((c) => {
      const hasSpecificImages = c.images && c.images.length > 0;
      const primaryImage = hasSpecificImages ? c.images[0] : (mainCoverImage || allImages[0]);
      const colorImagesStr = hasSpecificImages ? c.images.join(',') : '';

      c.sizes.forEach((s) => {
        computedVariants.push({
          size: s.size,
          colorName: c.colorName.trim() || 'Standard',
          colorHex: c.colorHex || '#000000',
          colorImage: primaryImage,
          colorImages: colorImagesStr,
          stock: s.stock,
        });
      });
    });

    if (computedVariants.length === 0) {
      computedVariants.push({
        size: 'One Size',
        colorName: 'Standard',
        colorHex: '#000000',
        colorImage: allImages[0],
        colorImages: '',
        stock: 50,
      });
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: finalNameEn,
          nameAr: finalNameAr,
          descEn,
          descAr,
          price: parseFloat(price),
          salePrice: salePrice ? parseFloat(salePrice) : null,
          sku,
          categorySlug: finalCategorySlug,
          featured,
          isNew,
          isSale: !!salePrice,
          images: allImages,
          variants: computedVariants,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.product) {
        try {
          const stored = JSON.parse(localStorage.getItem('bi_product_overrides') || '{}');
          stored[data.product.id] = data.product;
          localStorage.setItem('bi_product_overrides', JSON.stringify(stored));

          const createdArr = JSON.parse(localStorage.getItem('bi_created_products') || '[]');
          const createdMap = new Map((createdArr || []).filter((p: any) => p && p.id).map((p: any) => [p.id, p]));
          createdMap.set(data.product.id, data.product);
          localStorage.setItem('bi_created_products', JSON.stringify(Array.from(createdMap.values())));
        } catch (e) {}

        // Hard redirect to bust Next.js client router cache and display fresh catalog immediately
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/products';
        } else {
          router.push('/admin/products');
        }
      } else {
        setErrorMsg(data.error || 'Failed to create product.');
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error while saving product.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
          </button>
          <h1 className="text-3xl font-display font-bold uppercase text-white">CREATE NEW PRODUCT</h1>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-200 font-mono">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. BASIC DETAILS */}
        <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-6">
          <h3 className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">1. PRODUCT BASIC DETAILS</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">English Title (Optional if Arabic is provided)</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. BLACK ISLAND Signature Heavy Sweater Collection"
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Arabic Title *</label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="كنزة بلاك آيلاند قطن ثقيل ألوان متعددة"
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Regular Price ($) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45"
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Sale Price ($, Optional)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="35"
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Category *</label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs px-4 py-3 rounded-xl focus:border-white focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-brand-950">
                    {cat.nameEn} ({cat.nameAr})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6 pt-6 font-mono text-xs text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="accent-brand-gold w-4 h-4 rounded"
                />
                <span>FEATURED DROP</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="accent-brand-gold w-4 h-4 rounded"
                />
                <span>NEW ARRIVAL</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">English Description</label>
              <textarea
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Product details in English..."
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs p-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase">Arabic Description</label>
              <textarea
                rows={3}
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="تفاصيل المنتج باللغة العربية..."
                className="w-full bg-brand-900 border border-brand-700 text-white text-xs p-3 rounded-xl focus:border-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. STANDALONE OPTIONAL MAIN COVER IMAGE SECTION */}
        <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-4">
          <div>
            <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">
              2. STANDALONE MAIN COVER IMAGE (OPTIONAL)
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Upload a standalone product cover photo here. Saved purely as the product's main cover photo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-brand-900/40 p-4 rounded-xl border border-brand-850">
            {mainCoverImage ? (
              <div className="w-28 h-36 rounded-xl overflow-hidden bg-brand-950 border border-brand-700 relative group shrink-0">
                <img src={mainCoverImage} alt="Main Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMainCoverImage(null)}
                  className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-28 h-36 rounded-xl border-2 border-dashed border-brand-700 flex flex-col items-center justify-center text-gray-500 text-xs shrink-0">
                <ImageIcon className="w-6 h-6 mb-1 text-gray-600" />
                <span>No Cover</span>
              </div>
            )}

            <div className="space-y-2 font-mono text-xs text-gray-300">
              <label className="px-4 py-2.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-xl cursor-pointer text-white flex items-center gap-2 font-bold w-fit">
                <Upload className="w-4 h-4 text-brand-gold" />
                <span>{uploadingMain ? 'Uploading...' : 'Upload Standalone Cover Photo'}</span>
                <input type="file" accept="image/*" onChange={handleMainCoverUpload} className="hidden" />
              </label>
              <span className="text-[11px] text-gray-500 block">Optional.</span>
            </div>
          </div>
        </div>

        {/* 3. COLOR VARIANTS WITH INDEPENDENT ATTRIBUTES & PHOTOS */}
        <div className="bg-brand-950 p-6 rounded-2xl border border-brand-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-850 pb-4">
            <div>
              <span className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">
                3. COLOR VARIANTS (100% INDEPENDENT OPTIONS)
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Each color option maintains independent names, swatches, photos, and stock matrix.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddBlankColorGroup}
                className="px-3.5 py-2.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-xl text-xs font-mono font-bold text-white flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-brand-gold" />
                <span>+ Add Blank Color</span>
              </button>

              <label className="px-4 py-2.5 bg-brand-gold text-black font-extrabold rounded-xl cursor-pointer hover:bg-amber-400 text-xs font-mono flex items-center justify-center gap-2 shadow-lg">
                <Upload className="w-4 h-4" />
                <span>{uploadingNewColorGroup ? 'Uploading...' : '+ Add Color via Upload'}</span>
                <input type="file" multiple accept="image/*" onChange={handleCreateColorGroup} className="hidden" />
              </label>
            </div>
          </div>

          {/* Render List of Multi-Photo Color Variant Cards */}
          {colorCards.length === 0 ? (
            <div className="p-8 text-center bg-brand-900/30 rounded-xl border border-brand-850 text-xs font-mono text-gray-500 space-y-2">
              <p>No color variant options created yet.</p>
              <p className="text-[11px] text-gray-600">Click "+ Add Blank Color" or "+ Add Color via Upload" above!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {colorCards.map((card, cardIdx) => (
                <div
                  key={card.id}
                  className="bg-brand-900/40 p-6 rounded-2xl border border-brand-800 space-y-6 font-mono text-xs animate-fade-in relative"
                >
                  <div className="flex items-center justify-between border-b border-brand-850 pb-3">
                    <h4 className="font-bold text-white uppercase text-sm">
                      COLOR OPTION #{cardIdx + 1}: <span className="text-brand-gold">{card.colorName}</span> ({card.images.length} Photos)
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeColorCard(card.id)}
                      className="text-gray-400 hover:text-red-400 text-xs flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Color Group
                    </button>
                  </div>

                  {/* Multi-Photo Gallery for this specific Color Option */}
                  <div className="space-y-2 bg-brand-950 p-4 rounded-xl border border-brand-850">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-gray-400 uppercase font-bold">
                        PHOTOS FOR {card.colorName.toUpperCase()} ONLY ({card.images.length})
                      </label>
                      <label className="px-3 py-1 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-lg cursor-pointer text-white text-[11px] font-bold flex items-center gap-1">
                        <Upload className="w-3 h-3 text-brand-gold" />
                        <span>{uploadingColorCardId === card.id ? '...' : '+ Upload Photos to this Color'}</span>
                        <input type="file" multiple accept="image/*" onChange={(e) => handleAddPhotosToColorCard(card.id, e)} className="hidden" />
                      </label>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pt-2 pb-1">
                      {card.images.length === 0 ? (
                        <span className="text-[11px] text-gray-500 py-2">
                          No specific photos uploaded for this color option yet.
                        </span>
                      ) : (
                        card.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="w-20 h-24 rounded-xl overflow-hidden bg-brand-900 border border-brand-700 relative group shrink-0">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            {imgIdx === 0 && (
                              <span className="absolute top-1 left-1 bg-black/80 text-brand-gold text-[8px] px-1 rounded font-bold">
                                SWATCH PHOTO
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removePhotoFromColorCard(card.id, imgIdx)}
                              className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Color Name & Swatch Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-brand-950 p-3 rounded-xl border border-brand-850">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-gray-400 mb-1 uppercase">COLOR NAME *</label>
                      <input
                        type="text"
                        required
                        value={card.colorName}
                        onChange={(e) => updateCardField(card.id, 'colorName', e.target.value)}
                        placeholder="e.g. Obsidian Black"
                        className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1 uppercase">COLOR SWATCH HEX</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={card.colorHex}
                          onChange={(e) => updateCardField(card.id, 'colorHex', e.target.value)}
                          className="w-9 h-9 bg-brand-900 border border-brand-700 rounded-lg cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={card.colorHex}
                          onChange={(e) => updateCardField(card.id, 'colorHex', e.target.value)}
                          className="w-full bg-brand-900 border border-brand-700 text-white px-2 py-2 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Independent Sizes Selection */}
                  <div className="space-y-2 bg-brand-950 p-3 rounded-xl border border-brand-850">
                    <label className="block text-[10px] text-gray-400 uppercase">AVAILABLE SIZES FOR {card.colorName.toUpperCase()}</label>
                    <div className="flex flex-wrap gap-2">
                      {standardSizes.map((sz) => {
                        const isSelected = card.sizes.some((s) => s.size === sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleSizeForCard(card.id, sz)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                              isSelected
                                ? 'bg-brand-gold text-black border-brand-gold font-bold shadow-md'
                                : 'bg-brand-900 text-gray-400 border-brand-700 hover:border-gray-500'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={customSizeInputs[card.id] || ''}
                        onChange={(e) =>
                          setCustomSizeInputs({ ...customSizeInputs, [card.id]: e.target.value })
                        }
                        placeholder="Add Custom Size (e.g. 3XL)"
                        className="bg-brand-900 border border-brand-700 text-white text-xs px-3 py-1.5 rounded-lg flex-1"
                      />
                      <Button type="button" variant="secondary" size="sm" onClick={() => addCustomSizeToCard(card.id)}>
                        + Add Custom Size
                      </Button>
                    </div>
                  </div>

                  {/* Individual Stock Quantities */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-400 uppercase">STOCK QUANTITY PER SIZE ({card.colorName}):</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {card.sizes.map((s) => (
                        <div key={s.size} className="p-2.5 bg-brand-950 rounded-xl border border-brand-850 flex items-center justify-between">
                          <span className="font-bold text-brand-gold">{s.size}</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={s.stock}
                              onChange={(e) =>
                                updateStockForCardSize(card.id, s.size, parseInt(e.target.value || '0'))
                              }
                              className="w-16 bg-brand-900 border border-brand-700 text-white font-bold px-2 py-1 rounded text-center"
                            />
                            <span className="text-[10px] text-gray-500">pcs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" variant="gold" size="lg" isLoading={loading} className="w-full py-4 text-base font-bold">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>PUBLISH PRODUCT TO STORE</span>
        </Button>
      </form>
    </div>
  );
}
