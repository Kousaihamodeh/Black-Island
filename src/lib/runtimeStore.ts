import fs from 'fs';
import path from 'path';
import os from 'os';

let currentCloudDocId = 'ff808181a067127101a081fbdf054c68';

function getCloudUrl() {
  return `https://api.restful-api.dev/objects/${currentCloudDocId}`;
}

async function createNewCloudDoc(): Promise<string | null> {
  try {
    const payload = {
      name: 'Black_Island_Master_Catalog_v1',
      data: {
        overrides: Array.from(globalForCatalog.productOverrides.values()),
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
  // Avoid refetching cloud if fetched in last 2 seconds unless forced
  if (!force && globalForCatalog.hasSyncedOnce && now - globalForCatalog.lastSyncedAt < 2000) {
    return;
  }

  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(getCloudUrl(), {
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
          if (json.data.settings && typeof json.data.settings === 'object') {
            for (const [k, v] of Object.entries(json.data.settings)) {
              if (typeof v === 'string') globalForCatalog.storeSettings.set(k, v as string);
            }
          }
          globalForCatalog.lastSyncedAt = Date.now();
          globalForCatalog.hasSyncedOnce = true;
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
        settings: Object.fromEntries(globalForCatalog.storeSettings),
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    let res = await fetch(getCloudUrl(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('Cloud sync write non-ok status:', res.status, 'Attempting auto-heal...');
      const newId = await createNewCloudDoc();
      if (newId) {
        await fetch(getCloudUrl(), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
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
  await syncFromCloud();
  globalForCatalog.productOverrides.set(product.id, {
    ...product,
    updatedAt: new Date().toISOString(),
  });
  syncToTmpDisk();
  await syncToCloud();
}

export async function markProductDeleted(id: string) {
  await syncFromCloud();
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

// BANNERS PERSISTENCE WITH AUTOMATIC TOP-PRIORITY SORTING
export async function setBannerOverride(banner: any) {
  if (!banner || !banner.id) return;
  await syncFromCloud();
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
  if (!Array.isArray(banners)) return [];
  syncFromTmpDisk();

  let list = banners.filter((b) => !globalForCatalog.deletedBannerIds.has(b.id));

  const map = new Map<string, any>(list.map((b) => [b.id, b]));
  for (const [id, overrideBanner] of globalForCatalog.bannerOverrides.entries()) {
    map.set(id, overrideBanner);
  }

  const result = Array.from(map.values());

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
