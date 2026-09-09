import fs from 'fs';
import path from 'path';
import os from 'os';

const DEFAULT_CLOUD_DOC_IDS = [
  'ff808181a067127101a081fbdf054c68',
  'ff808181a067127101a082548e004d1f',
];

let currentCloudDocId = DEFAULT_CLOUD_DOC_IDS[0];

function getCloudUrl(docId = currentCloudDocId) {
  return `https://api.restful-api.dev/objects/${docId}`;
}

function cleanProductForCloud(p: any) {
  if (!p) return p;
  const images = Array.isArray(p.images) ? p.images : [];
  const cleanedImages = images.map((img: any) => {
    const url = typeof img === 'string' ? img : (img?.url || '');
    if (typeof url === 'string' && url.startsWith('data:')) {
      return typeof img === 'string'
        ? '/black_island_storefront.jpg'
        : { ...img, url: '/black_island_storefront.jpg' };
    }
    return img;
  });

  const variants = Array.isArray(p.variants) ? p.variants : [];
  const cleanedVariants = variants.map((v: any) => {
    let colorImage = v?.colorImage || '';
    if (typeof colorImage === 'string' && colorImage.startsWith('data:')) {
      colorImage = '/black_island_storefront.jpg';
    }
    let colorImages = v?.colorImages || '';
    if (typeof colorImages === 'string' && colorImages.startsWith('data:')) {
      colorImages = '/black_island_storefront.jpg';
    }
    return { ...v, colorImage, colorImages };
  });

  return { ...p, images: cleanedImages, variants: cleanedVariants };
}

async function createNewCloudDoc(): Promise<string | null> {
  try {
    const cleanOverrides = Array.from(globalForCatalog.productOverrides.values()).map(cleanProductForCloud);
    const payload = {
      name: 'Black_Island_Master_Catalog_v1',
      data: {
        overrides: cleanOverrides,
        deleted: Array.from(globalForCatalog.deletedProductIds.values()),
        banners: Array.from(globalForCatalog.bannerOverrides.values()),
        deletedBanners: Array.from(globalForCatalog.deletedBannerIds.values()),
        settings: Object.fromEntries(globalForCatalog.storeSettings),
      },
    };
    const res = await fetch('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        currentCloudDocId = data.id;
        if (!DEFAULT_CLOUD_DOC_IDS.includes(data.id)) {
          DEFAULT_CLOUD_DOC_IDS.unshift(data.id);
        }
        console.log('Created fresh auto-healed cloud doc ID:', currentCloudDocId);
        return data.id;
      }
    }
  } catch (e) {
    console.warn('Failed to create new cloud doc:', e);
  }
  return null;
}

// Global Runtime Store with Cloud Persistence for Serverless Lambdas (Vercel)
const globalForCatalog = globalThis as unknown as {
  productOverrides: Map<string, any>;
  deletedProductIds: Set<string>;
  bannerOverrides: Map<string, any>;
  deletedBannerIds: Set<string>;
  storeSettings: Map<string, string>;
  lastSyncedAt: number;
  hasSyncedOnce: boolean;
};

if (!globalForCatalog.productOverrides) {
  globalForCatalog.productOverrides = new Map<string, any>();
}

if (!globalForCatalog.deletedProductIds) {
  globalForCatalog.deletedProductIds = new Set<string>();
}

if (!globalForCatalog.bannerOverrides) {
  globalForCatalog.bannerOverrides = new Map<string, any>();
}

if (!globalForCatalog.deletedBannerIds) {
  globalForCatalog.deletedBannerIds = new Set<string>();
}

if (!globalForCatalog.storeSettings) {
  globalForCatalog.storeSettings = new Map<string, string>();
}

if (!globalForCatalog.lastSyncedAt) {
  globalForCatalog.lastSyncedAt = 0;
}

if (globalForCatalog.hasSyncedOnce === undefined) {
  globalForCatalog.hasSyncedOnce = false;
}

const TMP_FILE = path.join(os.tmpdir(), 'black_island_overrides.json');

function syncFromTmpDisk() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (data && Array.isArray(data.overrides)) {
        for (const p of data.overrides) {
          if (p && p.id) globalForCatalog.productOverrides.set(p.id, p);
        }
      }
      if (data && Array.isArray(data.deleted)) {
        for (const id of data.deleted) globalForCatalog.deletedProductIds.add(id);
      }
      if (data && Array.isArray(data.banners)) {
        for (const b of data.banners) {
          if (b && b.id) globalForCatalog.bannerOverrides.set(b.id, b);
        }
      }
      if (data && Array.isArray(data.deletedBanners)) {
        for (const id of data.deletedBanners) globalForCatalog.deletedBannerIds.add(id);
      }
      if (data && data.settings && typeof data.settings === 'object') {
        for (const [k, v] of Object.entries(data.settings)) {
          if (typeof v === 'string') globalForCatalog.storeSettings.set(k, v);
        }
      }
    }
  } catch (e) {
    // Ignore read errors
  }
}

function syncToTmpDisk() {
  try {
    const data = {
      overrides: Array.from(globalForCatalog.productOverrides.values()),
      deleted: Array.from(globalForCatalog.deletedProductIds.values()),
      banners: Array.from(globalForCatalog.bannerOverrides.values()),
      deletedBanners: Array.from(globalForCatalog.deletedBannerIds.values()),
      settings: Object.fromEntries(globalForCatalog.storeSettings),
    };
    fs.writeFileSync(TMP_FILE, JSON.stringify(data), 'utf-8');
  } catch (e) {
    // Ignore write errors
  }
}

let syncPromise: Promise<void> | null = null;

export async function syncFromCloud(force = false) {
  const now = Date.now();
  if (!force && globalForCatalog.hasSyncedOnce && now - globalForCatalog.lastSyncedAt < 2000) {
    return;
  }

  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      const fetchDoc = async (docId: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        try {
          const res = await fetch(getCloudUrl(docId), {
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' },
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {
          clearTimeout(timeoutId);
        }
        return null;
      };

      const results = await Promise.allSettled(DEFAULT_CLOUD_DOC_IDS.map(fetchDoc));
      for (const res of results) {
        if (res.status === 'fulfilled' && res.value && res.value.data) {
          const data = res.value.data;
          if (Array.isArray(data.overrides)) {
            for (const p of data.overrides) {
              if (p && p.id) {
                const existing = globalForCatalog.productOverrides.get(p.id);
                if (!existing) {
                  globalForCatalog.productOverrides.set(p.id, p);
                } else {
                  const existingTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
                  const newTime = new Date(p.updatedAt || p.createdAt || 0).getTime();
                  if (newTime >= existingTime) {
                    globalForCatalog.productOverrides.set(p.id, p);
                  }
                }
              }
            }
          }
          if (Array.isArray(data.deleted)) {
            for (const id of data.deleted) globalForCatalog.deletedProductIds.add(id);
          }
          if (Array.isArray(data.banners)) {
            for (const b of data.banners) {
              if (b && b.id) globalForCatalog.bannerOverrides.set(b.id, b);
            }
          }
          if (Array.isArray(data.deletedBanners)) {
            for (const id of data.deletedBanners) globalForCatalog.deletedBannerIds.add(id);
          }
          if (data.settings && typeof data.settings === 'object') {
            for (const [k, v] of Object.entries(data.settings)) {
              if (typeof v === 'string') globalForCatalog.storeSettings.set(k, v as string);
            }
          }
        }
      }

      globalForCatalog.lastSyncedAt = Date.now();
      globalForCatalog.hasSyncedOnce = true;
      syncToTmpDisk();
    } catch (e) {
      console.warn('Cloud sync read warning, using local cache:', e);
    } finally {
      syncPromise = null;
    }
  })();

  return syncPromise;
}

export async function syncToCloud() {
  try {
    const cleanOverrides = Array.from(globalForCatalog.productOverrides.values()).map(cleanProductForCloud);
    const payload = {
      name: 'Black_Island_Master_Catalog_v1',
      data: {
        overrides: cleanOverrides,
        deleted: Array.from(globalForCatalog.deletedProductIds.values()),
        banners: Array.from(globalForCatalog.bannerOverrides.values()),
        deletedBanners: Array.from(globalForCatalog.deletedBannerIds.values()),
        settings: Object.fromEntries(globalForCatalog.storeSettings),
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const bodyStr = JSON.stringify(payload);

    let res = await fetch(getCloudUrl(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyStr,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const newId = await createNewCloudDoc();
      if (newId) {
        await fetch(getCloudUrl(), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: bodyStr,
        }).catch(() => {});
      }
    } else {
      globalForCatalog.lastSyncedAt = Date.now();
    }
  } catch (e) {
    console.warn('Cloud sync write warning:', e);
  }
}

// Initial local disk sync
syncFromTmpDisk();

export const productOverrides = globalForCatalog.productOverrides;
export const deletedProductIds = globalForCatalog.deletedProductIds;
export const bannerOverrides = globalForCatalog.bannerOverrides;
export const deletedBannerIds = globalForCatalog.deletedBannerIds;
export const storeSettings = globalForCatalog.storeSettings;

export async function setProductOverride(product: any) {
  if (!product || !product.id) return;
  const updated = {
    ...product,
    updatedAt: new Date().toISOString(),
  };
  globalForCatalog.deletedProductIds.delete(product.id);
  globalForCatalog.productOverrides.set(product.id, updated);
  syncToTmpDisk();
  syncToCloud().catch(() => {});
}

export async function markProductDeleted(id: string) {
  await syncFromCloud();
  globalForCatalog.deletedProductIds.add(id);
  globalForCatalog.productOverrides.delete(id);
  syncToTmpDisk();
  await syncToCloud();
}

export function applyOverrides(products: any[]): any[] {
  if (!Array.isArray(products)) products = [];
  syncFromTmpDisk();

  const map = new Map<string, any>(products.map((p) => [p.id, p]));
  for (const [id, overrideProduct] of globalForCatalog.productOverrides.entries()) {
    if (overrideProduct && overrideProduct.id) {
      map.set(id, overrideProduct);
    }
  }

  return Array.from(map.values()).filter(
    (p) => p && p.id && !globalForCatalog.deletedProductIds.has(p.id)
  );
}

// BANNERS PERSISTENCE WITH AUTOMATIC TOP-PRIORITY SORTING
export async function setBannerOverride(banner: any) {
  if (!banner || !banner.id) return;
  await syncFromCloud();
  globalForCatalog.deletedBannerIds.delete(banner.id);
  globalForCatalog.bannerOverrides.set(banner.id, {
    ...banner,
    updatedAt: new Date().toISOString(),
  });
  syncToTmpDisk();
  await syncToCloud();
}

export async function markBannerDeleted(id: string) {
  await syncFromCloud();
  globalForCatalog.deletedBannerIds.add(id);
  globalForCatalog.bannerOverrides.delete(id);
  syncToTmpDisk();
  await syncToCloud();
}

export function applyBannerOverrides(banners: any[]): any[] {
  if (!Array.isArray(banners)) banners = [];
  syncFromTmpDisk();

  const map = new Map<string, any>(banners.map((b) => [b.id, b]));
  for (const [id, overrideBanner] of globalForCatalog.bannerOverrides.entries()) {
    if (overrideBanner && overrideBanner.id) {
      map.set(id, overrideBanner);
    }
  }

  let result = Array.from(map.values()).filter(
    (b) => b && b.id && !globalForCatalog.deletedBannerIds.has(b.id)
  );

  // Priority sort: Custom / user-edited active banners appear FIRST before default fallback
  result.sort((a, b) => {
    const aIsDefault = a.id === 'banner-default-1';
    const bIsDefault = b.id === 'banner-default-1';
    if (aIsDefault !== bIsDefault) return aIsDefault ? 1 : -1;
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });

  return result;
}

// STORE SETTINGS PERSISTENCE
export async function setStoreSetting(key: string, value: string) {
  if (!key) return;
  await syncFromCloud();
  globalForCatalog.storeSettings.set(key, value);
  syncToTmpDisk();
  await syncToCloud();
}

export function getStoreSetting(key: string, fallback: string = ''): string {
  syncFromTmpDisk();
  return globalForCatalog.storeSettings.get(key) || fallback;
}

export function getAllStoreSettings(): Record<string, string> {
  syncFromTmpDisk();
  return Object.fromEntries(globalForCatalog.storeSettings);
}
