'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Copy,
  Edit,
  Trash2,
  Check,
  X,
  Layers,
  Sparkles,
  Percent,
  CheckSquare,
  Square,
  Package,
  Eye,
  ArrowUpDown,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { uploadFiles } from '@/lib/uploadHelper';

interface ColorVariantCard {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: Array<{ size: string; stock: number }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [saleFilter, setSaleFilter] = useState('all');

  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkPercent, setBulkPercent] = useState('');
  const [bulkCatSlug, setBulkCatSlug] = useState('');

  // Inline Quick Edit Price State
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [inputPrice, setInputPrice] = useState('');
  const [inputSalePrice, setInputSalePrice] = useState('');

  // Stock Matrix Inspector Modal
  const [inspectingProduct, setInspectingProduct] = useState<any | null>(null);

  // Full Edit Modal State
  const [editModalProduct, setEditModalProduct] = useState<any | null>(null);
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameAr, setEditNameAr] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editDescAr, setEditDescAr] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSalePrice, setEditSalePrice] = useState('');
  const [editCategorySlug, setEditCategorySlug] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editIsNew, setEditIsNew] = useState(false);
  const [editIsSale, setEditIsSale] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState('');

  // Standalone Cover Image & Color Variant Cards in Edit Drawer
  const standardSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const [editMainCoverImage, setEditMainCoverImage] = useState<string | null>(null);
  const [editColorCards, setEditColorCards] = useState<ColorVariantCard[]>([]);

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingNewColorGroup, setUploadingNewColorGroup] = useState(false);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);

  // High-Resolution Image Lightbox Modal State
  const [previewImageModal, setPreviewImageModal] = useState<{ url: string; title?: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewImageModal(null);
      }
    };
    if (previewImageModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImageModal]);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/products?limit=300&allStatus=true&t=${Date.now()}`, { cache: 'no-store' }),
        fetch('/api/admin/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      let fetchedProds = pData.products || [];

      // Read deleted product IDs from localStorage
      let deletedIdsSet = new Set<string>();
      try {
        const deletedArr = JSON.parse(localStorage.getItem('bi_deleted_product_ids') || '[]');
        deletedIdsSet = new Set(deletedArr);
      } catch (e) {}

      try {
        const stored = JSON.parse(localStorage.getItem('bi_product_overrides') || '{}');
        const storedList = Object.values(stored);
        if (storedList.length > 0) {
          const map = new Map(fetchedProds.map((p: any) => [p.id, p]));
          storedList.forEach((sp: any) => {
            if (sp && sp.id && !deletedIdsSet.has(sp.id)) {
              map.set(sp.id, sp);
            }
          });
          fetchedProds = Array.from(map.values());
        }
      } catch (e) {}

      // Filter out deleted IDs
      fetchedProds = fetchedProds.filter((p: any) => !deletedIdsSet.has(p.id));

      setProducts(fetchedProds);
      if (cData.categories) setCategories(cData.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.categorySlug !== categoryFilter) return false;
      if (saleFilter === 'sale' && !p.isSale) return false;
      if (saleFilter === 'regular' && p.isSale) return false;

      const totalStock = p.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
      if (stockFilter === 'instock' && totalStock <= 0) return false;
      if (stockFilter === 'out' && totalStock > 0) return false;
      if (stockFilter === 'low' && (totalStock <= 0 || totalStock > 10)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEn = p.nameEn.toLowerCase().includes(q);
        const matchAr = p.nameAr.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchEn && !matchAr && !matchSku) return false;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter, stockFilter, saleFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const saveQuickPrice = async (productId: string) => {
    try {
      const res = await fetch('/api/admin/products/quick-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          price: inputPrice,
          salePrice: inputSalePrice || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingPriceId(null);
        fetchCatalogData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateVariantStockInline = async (variantId: string, newStock: number) => {
    try {
      await fetch('/api/admin/products/quick-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: inspectingProduct.id,
          variantId,
          variantStock: newStock,
        }),
      });

      setInspectingProduct((prev: any) => ({
        ...prev,
        variants: prev.variants.map((v: any) =>
          v.id === variantId ? { ...v, stock: newStock } : v
        ),
      }));

      fetchCatalogData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to create a duplicate copy of this product?')) return;
    try {
      const res = await fetch('/api/admin/products/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        fetchCatalogData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeLocalProductIds = (ids: string[]) => {
    try {
      const stored = JSON.parse(localStorage.getItem('bi_product_overrides') || '{}');
      ids.forEach((id) => delete stored[id]);
      localStorage.setItem('bi_product_overrides', JSON.stringify(stored));

      const deletedArr = JSON.parse(localStorage.getItem('bi_deleted_product_ids') || '[]');
      const set = new Set([...deletedArr, ...ids]);
      localStorage.setItem('bi_deleted_product_ids', JSON.stringify(Array.from(set)));
    } catch (e) {}
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    removeLocalProductIds([id]);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', productIds: [id] }),
      });
      fetchCatalogData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkAction = async (action: string, payload?: any) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !confirm(`Delete ${selectedIds.length} selected products?`)) return;

    if (action === 'delete') {
      removeLocalProductIds(selectedIds);
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    }

    try {
      await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productIds: selectedIds, payload }),
      });
      setSelectedIds([]);
      fetchCatalogData();
    } catch (e) {
      console.error(e);
    }
  };

  // Open Full Edit Modal on the EXACT Product Record (Using its unique Database ID)
  const openFullEditModal = (p: any) => {
    setEditModalProduct(p);
    setEditNameEn(p.nameEn);
    setEditNameAr(p.nameAr);
    setEditDescEn(p.descEn || '');
    setEditDescAr(p.descAr || '');
    setEditPrice(String(p.price));
    setEditSalePrice(p.salePrice ? String(p.salePrice) : '');
    setEditCategorySlug(p.categorySlug);
    setEditSku(p.sku);
    setEditFeatured(p.featured || false);
    setEditIsNew(p.isNew || false);
    setEditIsSale(p.isSale || false);
    setEditErrorMsg('');

    // Main Cover Image
    const mainImg = p.images?.find((i: any) => i.isMain)?.url || p.images?.[0]?.url || null;
    setEditMainCoverImage(mainImg);

    // All Product Gallery Images
    const allProductImgUrls: string[] = (p.images || []).map((img: any) => img.url).filter(Boolean);

    // Group variants into independent Color Cards
    const cardsMap = new Map<string, ColorVariantCard>();

    p.variants?.forEach((v: any, vIdx: number) => {
      let specificImages: string[] = [];
      if (Array.isArray(v.colorImages)) {
        specificImages = v.colorImages.filter(Boolean);
      } else if (typeof v.colorImages === 'string' && v.colorImages.trim().length > 0) {
        specificImages = v.colorImages.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (v.colorImage) {
        specificImages = [v.colorImage];
      }

      const colorNameClean = (v.colorName || '').trim() || `Color Option ${cardsMap.size + 1}`;
      const colorHexClean = v.colorHex || '#000000';
      const key = colorNameClean.toLowerCase();

      if (!cardsMap.has(key)) {
        cardsMap.set(key, {
          id: `color-card-${Date.now()}-${vIdx}-${Math.random().toString(36).substring(2, 7)}`,
          colorName: colorNameClean,
          colorHex: colorHexClean,
          images: [...specificImages],
          sizes: [{ size: v.size, stock: v.stock }],
        });
      } else {
        const card = cardsMap.get(key)!;
        specificImages.forEach((url) => {
          if (!card.images.includes(url)) {
            card.images.push(url);
          }
        });
        if (!card.sizes.some((s) => s.size === v.size)) {
          card.sizes.push({ size: v.size, stock: v.stock });
        }
      }
    });

    const cardsArray = Array.from(cardsMap.values());

    if (allProductImgUrls.length > 0) {
      if (cardsArray.length <= 1 && cardsArray[0] && cardsArray[0].images.length === 0) {
        cardsArray[0].images = [...allProductImgUrls];
      } else {
        cardsArray.forEach((card) => {
          if (card.images.length === 0) {
            card.images = [...allProductImgUrls];
          }
        });
      }
    }

    setEditColorCards(cardsArray);
  };

  const handleEditMainCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const inputElement = e.target;
    setUploadingMain(true);
    try {
      const urls = await uploadFiles(files);
      setUploadingMain(false);
      if (urls[0]) {
        setEditMainCoverImage(urls[0]);
      }
    } catch (e) {
      setUploadingMain(false);
    } finally {
      inputElement.value = '';
    }
  };

  const handleAddBlankEditColorGroup = () => {
    const newCard: ColorVariantCard = {
      id: `color-card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      colorName: `Color Option ${editColorCards.length + 1}`,
      colorHex: '#000000',
      images: [],
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 20 },
      ],
    };
    setEditColorCards((prev) => [...prev, newCard]);
  };

  const handleCreateEditColorGroup = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          colorName: `Color Option ${editColorCards.length + 1}`,
          colorHex: '#000000',
          images: urls,
          sizes: [
            { size: 'S', stock: 10 },
            { size: 'M', stock: 15 },
            { size: 'L', stock: 20 },
          ],
        };
        setEditColorCards((prev) => [...prev, newCard]);
      }
    } catch (e) {
      setUploadingNewColorGroup(false);
    } finally {
      inputElement.value = '';
    }
  };

  const handleAddPhotosToEditCard = async (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const inputElement = e.target;
    setUploadingCardId(cardId);
    try {
      const urls = await uploadFiles(files);
      setUploadingCardId(null);
      if (urls.length > 0) {
        setEditColorCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, images: [...c.images, ...urls] } : c))
        );
      }
    } catch (e) {
      setUploadingCardId(null);
    } finally {
      inputElement.value = '';
    }
  };

  const removePhotoFromEditCard = (cardId: string, photoIndex: number) => {
    setEditColorCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedImages = c.images.filter((_, idx) => idx !== photoIndex);
        return { ...c, images: updatedImages };
      })
    );
  };

  const removeEditColorCard = (cardId: string) => {
    setEditColorCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const updateEditCardField = (cardId: string, field: keyof ColorVariantCard, value: any) => {
    setEditColorCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, [field]: value } : c))
    );
  };

  const toggleEditSizeForCard = (cardId: string, size: string) => {
    setEditColorCards((prev) =>
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

  const updateEditStockForCardSize = (cardId: string, size: string, stock: number) => {
    setEditColorCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedSizes = c.sizes.map((s) =>
          s.size === size ? { ...s, stock: Math.max(0, stock) } : s
        );
        return { ...c, sizes: updatedSizes };
      })
    );
  };

  // DIRECT UPDATE HANDLER (Directly updates the existing record using its unique ID via PUT /api/products/[id])
  const saveFullProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalProduct || !editModalProduct.id) {
      setEditErrorMsg('Invalid product ID for update.');
      return;
    }

    setSavingEdit(true);
    setEditErrorMsg('');

    const allImages: string[] = [];
    if (editMainCoverImage) allImages.push(editMainCoverImage);
    editColorCards.forEach((c) => {
      c.images.forEach((imgUrl) => {
        if (!allImages.includes(imgUrl)) allImages.push(imgUrl);
      });
    });

    const computedVariants: any[] = [];
    editColorCards.forEach((c) => {
      const hasSpecificImages = c.images && c.images.length > 0;
      const primaryImage = hasSpecificImages ? c.images[0] : (editMainCoverImage || null);
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

    if (computedVariants.length === 0 && editMainCoverImage) {
      computedVariants.push({
        size: 'One Size',
        colorName: 'Standard',
        colorHex: '#000000',
        colorImage: editMainCoverImage,
        colorImages: '',
        stock: 50,
      });
    }

    try {
      // Direct HTTP PUT request to update existing record by ID
      const res = await fetch(`/api/products/${editModalProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameEn: editNameEn,
          nameAr: editNameAr,
          descEn: editDescEn,
          descAr: editDescAr,
          price: parseFloat(editPrice),
          salePrice: editSalePrice ? parseFloat(editSalePrice) : null,
          sku: editSku,
          categorySlug: editCategorySlug,
          featured: editFeatured,
          isNew: editIsNew,
          isSale: editIsSale || !!editSalePrice,
          images: allImages,
          variants: computedVariants,
        }),
      });

      const data = await res.json();
      setSavingEdit(false);

      if (data.success) {
        try {
          const stored = JSON.parse(localStorage.getItem('bi_product_overrides') || '{}');
          stored[editModalProduct.id] = {
            ...editModalProduct,
            nameEn: editNameEn,
            nameAr: editNameAr,
            descEn: editDescEn,
            descAr: editDescAr,
            price: parseFloat(editPrice),
            salePrice: editSalePrice ? parseFloat(editSalePrice) : null,
            sku: editSku,
            categorySlug: editCategorySlug,
            featured: editFeatured,
            isNew: editIsNew,
            isSale: editIsSale || !!editSalePrice,
            images: allImages.map((url, idx) => ({ url, isMain: idx === 0 })),
            variants: computedVariants,
          };
          localStorage.setItem('bi_product_overrides', JSON.stringify(stored));
        } catch (e) {}

        setEditModalProduct(null);
        fetchCatalogData(); // Refresh catalog cleanly
      } else {
        setEditErrorMsg(data.error || 'Failed to update product record.');
      }
    } catch (e) {
      setSavingEdit(false);
      setEditErrorMsg('Network error while updating product record.');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">PRODUCT MANAGEMENT & INVENTORY</span>
          <h1 className="text-3xl font-display font-bold uppercase text-white mt-1">CATALOG MANAGER ({products.length})</h1>
        </div>

        <Link href="/admin/products/new">
          <Button variant="gold" className="flex items-center gap-2 font-bold py-3">
            <Plus className="w-4 h-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="bg-brand-950 p-6 rounded-2xl border border-brand-850 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by title, Arabic name, or SKU..."
              className="w-full bg-brand-900 border border-brand-700 text-white pl-10 pr-4 py-3 rounded-xl focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-3 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.nameEn} ({c.nameAr})</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full bg-brand-900 border border-brand-700 text-white px-3.5 py-3 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Stock Status</option>
              <option value="instock">In Stock</option>
              <option value="low">Low Stock (&le; 10)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="pt-4 border-t border-brand-850 flex flex-wrap items-center justify-between gap-3 bg-brand-900/60 p-4 rounded-xl border border-brand-800 animate-fade-in font-mono text-xs">
            <span className="text-brand-gold font-bold">{selectedIds.length} Products Selected</span>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-brand-950 px-2 py-1 rounded-lg border border-brand-700">
                <input
                  type="number"
                  placeholder="% ±"
                  value={bulkPercent}
                  onChange={(e) => setBulkPercent(e.target.value)}
                  className="w-16 bg-transparent text-white text-xs px-1 focus:outline-none"
                />
                <button
                  onClick={() => handleBulkAction('adjustPrice', { percent: bulkPercent })}
                  className="px-2 py-1 bg-brand-gold text-black font-bold rounded hover:bg-amber-400"
                >
                  Adjust Price
                </button>
              </div>

              <select
                value={bulkCatSlug}
                onChange={(e) => {
                  setBulkCatSlug(e.target.value);
                  if (e.target.value) handleBulkAction('changeCategory', { categorySlug: e.target.value });
                }}
                className="bg-brand-950 border border-brand-700 text-white px-2.5 py-1.5 rounded-lg text-xs"
              >
                <option value="">Move to Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.nameEn}</option>
                ))}
              </select>

              <button
                onClick={() => handleBulkAction('markSale', { isSale: true })}
                className="px-2.5 py-1.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-lg text-white"
              >
                Mark Sale
              </button>

              <button
                onClick={() => handleBulkAction('markNew', { isNew: true })}
                className="px-2.5 py-1.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-lg text-white"
              >
                Mark New
              </button>

              <button
                onClick={() => handleBulkAction('delete')}
                className="px-2.5 py-1.5 bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 rounded-lg font-bold"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-gray-500">Loading catalog items...</div>
      ) : (
        <div className="bg-brand-950 border border-brand-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-brand-900 border-b border-brand-800 text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-brand-gold w-4 h-4 rounded cursor-pointer"
                    />
                  </th>
                  <th className="p-4">COVER PHOTO</th>
                  <th className="p-4">PRODUCT</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">QUICK PRICE</th>
                  <th className="p-4">VARIANTS MATRIX</th>
                  <th className="p-4">STATUS BADGES</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-850">
                {filteredProducts.map((prod) => {
                  const mainImage =
                    prod.images?.find((img: any) => img.isMain)?.url ||
                    prod.images?.[0]?.url ||
                    '/logo.png';

                  const totalStock = prod.variants?.reduce((a: number, b: any) => a + (b.stock || 0), 0) || 0;
                  const isEditingPrice = editingPriceId === prod.id;

                  return (
                    <tr key={prod.id} className="hover:bg-brand-900/40 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(prod.id)}
                          onChange={() => toggleSelectOne(prod.id)}
                          className="accent-brand-gold w-4 h-4 rounded cursor-pointer"
                        />
                      </td>

                      <td className="p-4">
                        <div
                          onClick={() => setPreviewImageModal({ url: mainImage, title: `${prod.nameEn} (${prod.nameAr})` })}
                          className="w-12 h-14 rounded-lg overflow-hidden bg-brand-900 border border-brand-800 shrink-0 cursor-zoom-in relative group hover:border-brand-gold transition-all"
                          title="Click to zoom image"
                        >
                          <img src={mainImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-brand-gold" />
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-white block text-xs">{prod.nameEn}</span>
                        <span className="text-brand-gold block text-[11px]">{prod.nameAr}</span>
                        <span className="text-gray-500 text-[10px] block mt-0.5">SKU: {prod.sku}</span>
                      </td>

                      <td className="p-4 text-gray-300 uppercase">
                        {categories.find((c) => c.slug === prod.categorySlug)?.nameEn || prod.categorySlug}
                      </td>

                      <td className="p-4">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={inputPrice}
                              onChange={(e) => setInputPrice(e.target.value)}
                              placeholder="Price"
                              className="w-20 bg-brand-900 border border-brand-700 text-white px-2 py-1 rounded text-xs"
                            />
                            <input
                              type="number"
                              value={inputSalePrice}
                              onChange={(e) => setInputSalePrice(e.target.value)}
                              placeholder="Sale"
                              className="w-20 bg-brand-900 border border-brand-700 text-white px-2 py-1 rounded text-xs"
                            />
                            <button onClick={() => saveQuickPrice(prod.id)} className="p-1 bg-emerald-600 text-white rounded">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingPriceId(null)} className="p-1 bg-brand-850 text-gray-400 rounded">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingPriceId(prod.id);
                              setInputPrice(String(prod.price));
                              setInputSalePrice(prod.salePrice ? String(prod.salePrice) : '');
                            }}
                            className="cursor-pointer hover:bg-brand-900 p-2 rounded-lg border border-transparent hover:border-brand-700"
                          >
                            <span className="font-bold text-white block">{formatPrice(prod.price)}</span>
                            {prod.salePrice && <span className="text-emerald-400 text-[10px] block">Sale: {formatPrice(prod.salePrice)}</span>}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setInspectingProduct(prod)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
                            totalStock > 10
                              ? 'bg-brand-900 text-white border-brand-700 hover:border-brand-gold'
                              : totalStock > 0
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-red-950 text-red-400 border-red-800'
                          }`}
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>{totalStock} Total Stock</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.isNew && <span className="px-1.5 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded text-[9px] font-bold">NEW</span>}
                          {prod.isSale && <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[9px] font-bold">SALE</span>}
                          {prod.featured && <span className="px-1.5 py-0.5 bg-brand-gold/20 text-brand-gold border border-brand-gold/40 rounded text-[9px] font-bold">FEATURED</span>}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* EDIT PRODUCT DIRECTLY */}
                          <button
                            onClick={() => openFullEditModal(prod)}
                            title="Edit Product Details"
                            className="px-3 py-1.5 bg-brand-gold hover:bg-amber-400 text-black rounded-lg text-xs flex items-center gap-1 font-bold shadow-md transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* DUPLICATE PRODUCT COPY */}
                          <button
                            onClick={() => handleDuplicateProduct(prod.id)}
                            title="Duplicate Product Copy"
                            className="p-1.5 bg-brand-900 border border-brand-700 hover:bg-white hover:text-black text-gray-300 rounded-lg text-xs"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* DELETE PRODUCT */}
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            title="Delete Product"
                            className="p-1.5 bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 rounded-lg text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Matrix Inspector Modal */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-fade-in font-mono text-xs relative">
            <button onClick={() => setInspectingProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] text-brand-gold font-bold uppercase block">STOCK MATRIX BREAKDOWN</span>
              <h3 className="text-lg font-bold text-white">{inspectingProduct.nameEn}</h3>
              <p className="text-xs text-gray-400">{inspectingProduct.nameAr}</p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {inspectingProduct.variants?.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-brand-900/60 rounded-xl border border-brand-850">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.colorHex }} />
                    <span className="font-bold text-white">{v.colorName}</span>
                    <span className="text-gray-400">({v.size})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={v.stock}
                      onBlur={(e) => updateVariantStockInline(v.id, parseInt(e.target.value || '0'))}
                      className="w-16 bg-brand-950 border border-brand-700 text-white text-center font-bold px-2 py-1 rounded-lg"
                    />
                    <span className="text-gray-400">pcs</span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full py-3" onClick={() => setInspectingProduct(null)}>
              Close Matrix
            </Button>
          </div>
        </div>
      )}

      {/* FULLY SCROLLABLE PRODUCT EDIT MODAL DIRECTLY UPDATING RECORD BY ID */}
      {editModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-brand-950 border border-brand-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in font-mono text-xs my-auto relative">
            {/* Header with Title & Close Button */}
            <div className="flex items-center justify-between border-b border-brand-850 pb-4 shrink-0">
              <div>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">DIRECT RECORD UPDATE</span>
                <h2 className="text-xl font-display font-bold text-white uppercase">
                  EDIT PRODUCT: {editModalProduct.nameEn}
                </h2>
                <span className="text-[10px] text-gray-500 font-mono">ID: {editModalProduct.id}</span>
              </div>
              <button
                onClick={() => setEditModalProduct(null)}
                className="p-2 text-gray-400 hover:text-white rounded-xl bg-brand-900 border border-brand-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editErrorMsg && (
              <div className="p-3 my-2 bg-red-950 border border-red-800 text-red-200 text-xs font-mono rounded-xl">
                {editErrorMsg}
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={saveFullProductEdit} className="flex-1 overflow-y-auto pr-2 space-y-6 py-4 scrollbar-thin scrollbar-thumb-brand-700">
              {/* Titles Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">ENGLISH NAME *</label>
                  <input
                    type="text"
                    required
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">ARABIC NAME *</label>
                  <input
                    type="text"
                    required
                    value={editNameAr}
                    onChange={(e) => setEditNameAr(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Category & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-900/40 p-4 rounded-xl border border-brand-850">
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">CATEGORY *</label>
                  <select
                    value={editCategorySlug}
                    onChange={(e) => setEditCategorySlug(e.target.value)}
                    className="w-full bg-brand-950 border border-brand-700 text-white px-3 py-2.5 rounded-xl cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.nameEn} ({c.nameAr})</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4 sm:pt-6">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                      className="accent-brand-gold w-4 h-4 rounded"
                    />
                    <span>FEATURED</span>
                  </label>

                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsNew}
                      onChange={(e) => setEditIsNew(e.target.checked)}
                      className="accent-brand-gold w-4 h-4 rounded"
                    />
                    <span>NEW ARRIVAL</span>
                  </label>

                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsSale}
                      onChange={(e) => setEditIsSale(e.target.checked)}
                      className="accent-brand-gold w-4 h-4 rounded"
                    />
                    <span>SALE</span>
                  </label>
                </div>
              </div>

              {/* Price & SKU Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">REGULAR PRICE ($) *</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">SALE PRICE ($, OPTIONAL)</label>
                  <input
                    type="number"
                    value={editSalePrice}
                    onChange={(e) => setEditSalePrice(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">SKU CODE *</label>
                  <input
                    type="text"
                    required
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-bold font-mono uppercase"
                  />
                </div>
              </div>

              {/* Descriptions Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">ENGLISH DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    placeholder="Product details in English..."
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-sans text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">ARABIC DESCRIPTION</label>
                  <textarea
                    rows={3}
                    value={editDescAr}
                    onChange={(e) => setEditDescAr(e.target.value)}
                    placeholder="تفاصيل المنتج باللغة العربية..."
                    className="w-full bg-brand-900 border border-brand-700 text-white px-3 py-2.5 rounded-xl font-sans text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Standalone Main Cover Image Section */}
              <div className="space-y-2 bg-brand-900/40 p-4 rounded-xl border border-brand-850">
                <span className="font-bold text-brand-gold uppercase block">STANDALONE MAIN COVER IMAGE (OPTIONAL)</span>
                <div className="flex items-center gap-4">
                  {editMainCoverImage ? (
                    <div
                      onClick={() => setPreviewImageModal({ url: editMainCoverImage, title: editNameEn || 'Main Cover Image' })}
                      className="w-16 h-20 rounded-lg overflow-hidden border border-brand-700 shrink-0 relative cursor-zoom-in group hover:border-brand-gold transition-all"
                      title="Click to zoom cover photo"
                    >
                      <img src={editMainCoverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-brand-gold" />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditMainCoverImage(null);
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 text-red-400 hover:text-white rounded-full text-[9px]"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-500">No cover uploaded.</span>
                  )}
                  <label className="px-3 py-1.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-lg cursor-pointer text-white text-xs font-bold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingMain ? '...' : 'Upload Standalone Cover'}</span>
                    <input type="file" accept="image/*" onChange={handleEditMainCoverUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Multi-Photo Color Variant Cards Section */}
              <div className="space-y-4 bg-brand-900/40 p-4 rounded-xl border border-brand-850">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-800 pb-3">
                  <div>
                    <span className="font-bold text-brand-gold uppercase block">
                      COLOR VARIANT OPTIONS ({editColorCards.length})
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Each color option maintains 100% independent names, swatches, photos, and stock matrix.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddBlankEditColorGroup}
                      className="px-3 py-1.5 bg-brand-850 border border-brand-700 hover:bg-white hover:text-black rounded-lg text-xs font-bold text-white flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Blank Color</span>
                    </button>

                    <label className="px-3 py-1.5 bg-brand-gold text-black rounded-lg cursor-pointer text-xs font-bold flex items-center gap-1 hover:bg-amber-400">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingNewColorGroup ? '...' : '+ Add Color via Upload'}</span>
                      <input type="file" multiple accept="image/*" onChange={handleCreateEditColorGroup} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-4 pr-1">
                  {editColorCards.length === 0 ? (
                    <div className="p-6 text-center bg-brand-950 rounded-xl border border-brand-800 text-gray-500 text-xs">
                      No color options added yet. Click "+ Add Blank Color" or "+ Add Color via Upload" above!
                    </div>
                  ) : (
                    editColorCards.map((card, cardIdx) => (
                      <div key={card.id} className="p-4 bg-brand-950 rounded-xl border border-brand-800 space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-brand-850 pb-2">
                          <span className="font-bold text-white">
                            COLOR #{cardIdx + 1}: <span className="text-brand-gold">{card.colorName}</span> ({card.images.length} Photos)
                          </span>
                          <button
                            type="button"
                            onClick={() => removeEditColorCard(card.id)}
                            className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove Color
                          </button>
                        </div>

                        {/* Isolated Multi-Photo Thumbnails for THIS Color Card ONLY */}
                        <div className="space-y-1 bg-brand-900/40 p-2.5 rounded-lg border border-brand-850">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
                            <span>PHOTOS FOR {card.colorName.toUpperCase()} ONLY ({card.images.length})</span>
                            <label className="px-2 py-0.5 bg-brand-800 hover:bg-white hover:text-black text-white rounded cursor-pointer flex items-center gap-1 font-normal">
                              <Upload className="w-3 h-3 text-brand-gold" />
                              <span>{uploadingCardId === card.id ? '...' : '+ Upload Photos'}</span>
                              <input type="file" multiple accept="image/*" onChange={(e) => handleAddPhotosToEditCard(card.id, e)} className="hidden" />
                            </label>
                          </div>

                          <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
                            {card.images.length === 0 ? (
                              <span className="text-[10px] text-gray-500 py-2">
                                No specific photos uploaded for this color option yet.
                              </span>
                            ) : (
                              card.images.map((imgUrl, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  onClick={() => setPreviewImageModal({ url: imgUrl, title: `${editNameEn} - ${card.colorName} (Photo #${imgIdx + 1})` })}
                                  className="w-14 h-16 rounded border border-brand-700 overflow-hidden relative shrink-0 cursor-zoom-in group hover:border-brand-gold transition-all"
                                  title="Click to zoom color photo"
                                >
                                  <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-3.5 h-3.5 text-brand-gold" />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removePhotoFromEditCard(card.id, imgIdx);
                                    }}
                                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 text-red-400 hover:text-white rounded-full text-[9px]"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Independent Color Name & Swatch */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-400 font-bold uppercase">COLOR NAME *</label>
                            <input
                              type="text"
                              value={card.colorName}
                              onChange={(e) => updateEditCardField(card.id, 'colorName', e.target.value)}
                              placeholder="e.g. Obsidian Black"
                              className="w-full bg-brand-900 border border-brand-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 font-bold uppercase">COLOR SWATCH HEX</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={card.colorHex}
                                onChange={(e) => updateEditCardField(card.id, 'colorHex', e.target.value)}
                                className="w-8 h-8 bg-brand-900 border border-brand-700 rounded-lg cursor-pointer p-0.5"
                              />
                              <input
                                type="text"
                                value={card.colorHex}
                                onChange={(e) => updateEditCardField(card.id, 'colorHex', e.target.value)}
                                className="w-full bg-brand-900 border border-brand-700 text-white px-2 py-1.5 rounded-lg text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Independent Sizes for THIS Color */}
                        <div className="space-y-1">
                          <label className="block text-[10px] text-gray-400 uppercase font-bold">SIZES FOR {card.colorName.toUpperCase()}:</label>
                          <div className="flex flex-wrap gap-1">
                            {standardSizes.map((sz) => {
                              const isSelected = card.sizes.some((s) => s.size === sz);
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => toggleEditSizeForCard(card.id, sz)}
                                  className={`px-2 py-0.5 rounded text-[10px] border ${
                                    isSelected
                                      ? 'bg-brand-gold text-black border-brand-gold font-bold'
                                      : 'bg-brand-900 text-gray-400 border-brand-700 hover:border-gray-500'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Stock Inputs per Size */}
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-brand-850">
                          {card.sizes.map((s) => (
                            <div key={s.size} className="p-1.5 bg-brand-900 rounded border border-brand-800 text-center">
                              <span className="text-[10px] font-bold text-brand-gold block">{s.size}</span>
                              <input
                                type="number"
                                value={s.stock}
                                onChange={(e) => updateEditStockForCardSize(card.id, s.size, parseInt(e.target.value || '0'))}
                                className="w-full bg-brand-950 border border-brand-700 text-white text-center text-xs py-0.5 rounded font-bold"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-4 border-t border-brand-850 flex gap-3 shrink-0">
                <Button type="submit" variant="gold" isLoading={savingEdit} className="flex-1 py-3 font-bold">
                  Save All Product Changes
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditModalProduct(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* High-Resolution Interactive Image Lightbox Modal */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in select-none"
          onClick={() => setPreviewImageModal(null)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between pb-3 mb-2 border-b border-brand-800 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-gray-300">
              <ImageIcon className="w-4 h-4 text-brand-gold" />
              <span className="font-bold uppercase tracking-wider text-white">
                {previewImageModal.title || 'Image Preview'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={previewImageModal.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-brand-900 border border-brand-700 hover:bg-white hover:text-black text-gray-300 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5"
              >
                Open Full Size
              </a>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="p-1.5 text-gray-400 hover:text-white bg-brand-900 hover:bg-brand-800 rounded-lg border border-brand-700 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="relative max-w-4xl max-h-[82vh] flex items-center justify-center p-2 rounded-2xl bg-brand-950/80 border border-brand-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImageModal.url}
              alt={previewImageModal.title || 'Product Image Preview'}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-inner transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>

          <span className="text-[11px] font-mono text-gray-500 mt-3">
            Click outside or press Esc to close
          </span>
        </div>
      )}
    </div>
  );
}
