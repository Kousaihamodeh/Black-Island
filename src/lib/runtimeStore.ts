import fs from 'fs';
import path from 'path';
import os from 'os';

const CLOUD_DOC_ID = 'ff808181a067127101a0806e64e147f2';
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_DOC_ID}`;

// Global Runtime Store with Cloud Persistence for Serverless Lambdas (Vercel)
const globalForCatalog = globalThis as unknown as {
  productOverrides: Map<string, any>;
  deletedProductIds: Set<string>;
  bannerOverrides: Map<string, any>;
  deletedBannerIds: Set<string>;
  lastSyncedAt: number;
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

if (!globalForCatalog.lastSyncedAt) {
  globalForCatalog.lastSyncedAt = 0;
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
    };
    fs.writeFileSync(TMP_FILE, JSON.stringify(data), 'utf-8');
  } catch (e) {
    // Ignore write errors
  }
}

let syncPromise: Promise<void> | null = null;

export async function syncFromCloud(force = false) {
  const now = Date.now();
  // Avoid refetching cloud if fetched in last 2 seconds unless forced
  if (!force && now - globalForCatalog.lastSyncedAt < 2000) {
    return;
  }

  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(CLOUD_URL, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          if (Array.isArray(json.data.overrides)) {
            for (const p of json.data.overrides) {
              if (p && p.id) globalForCatalog.productOverrides.set(p.id, p);
            }
          }
          if (Array.isArray(json.data.deleted)) {
            for (const id of json.data.deleted) globalForCatalog.deletedProductIds.add(id);
          }
          if (Array.isArray(json.data.banners)) {
            for (const b of json.data.banners) {
              if (b && b.id) globalForCatalog.bannerOverrides.set(b.id, b);
            }
          }
          if (Array.isArray(json.data.deletedBanners)) {
            for (const id of json.data.deletedBanners) globalForCatalog.deletedBannerIds.add(id);
          }
          globalForCatalog.lastSyncedAt = Date.now();
          syncToTmpDisk();
        }
      }
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
    const payload = {
      name: 'Black_Island_Master_Catalog_v1',
      data: {
        overrides: Array.from(globalForCatalog.productOverrides.values()),
        deleted: Array.from(globalForCatalog.deletedProductIds.values()),
        banners: Array.from(globalForCatalog.bannerOverrides.values()),
        deletedBanners: Array.from(globalForCatalog.deletedBannerIds.values()),
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(CLOUD_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
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

export async function setProductOverride(product: any) {
  if (!product || !product.id) return;
  syncFromTmpDisk();
  globalForCatalog.productOverrides.set(product.id, {
    ...product,
    updatedAt: new Date().toISOString(),
  });
  syncToTmpDisk();
  await syncToCloud();
}

export async function markProductDeleted(id: string) {
  syncFromTmpDisk();
  globalForCatalog.deletedProductIds.add(id);
  globalForCatalog.productOverrides.delete(id);
  syncToTmpDisk();
  await syncToCloud();
}

export function applyOverrides(products: any[]): any[] {
  if (!Array.isArray(products)) return [];
  syncFromTmpDisk();

  // Filter out deleted products
  let list = products.filter((p) => !globalForCatalog.deletedProductIds.has(p.id));

  // Apply updated overrides
  const map = new Map<string, any>(list.map((p) => [p.id, p]));
  for (const [id, overrideProduct] of globalForCatalog.productOverrides.entries()) {
    map.set(id, overrideProduct);
  }

  return Array.from(map.values());
}

// BANNERS PERSISTENCE
export async function setBannerOverride(banner: any) {
  if (!banner || !banner.id) return;
  syncFromTmpDisk();
  globalForCatalog.bannerOverrides.set(banner.id, {
    ...banner,
    updatedAt: new Date().toISOString(),
  });
  syncToTmpDisk();
  await syncToCloud();
}

export async function markBannerDeleted(id: string) {
  syncFromTmpDisk();
  globalForCatalog.deletedBannerIds.add(id);
  globalForCatalog.bannerOverrides.delete(id);
  syncToTmpDisk();
  await syncToCloud();
}

export function applyBannerOverrides(banners: any[]): any[] {
  if (!Array.isArray(banners)) return [];
  syncFromTmpDisk();

  let list = banners.filter((b) => !globalForCatalog.deletedBannerIds.has(b.id));

  const map = new Map<string, any>(list.map((b) => [b.id, b]));
  for (const [id, overrideBanner] of globalForCatalog.bannerOverrides.entries()) {
    map.set(id, overrideBanner);
  }

  return Array.from(map.values());
}
