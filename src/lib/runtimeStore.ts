import fs from 'fs';
import path from 'path';
import os from 'os';

// Global Runtime Store with Persistent /tmp Backup for Serverless Lambdas (Vercel)
const globalForCatalog = globalThis as unknown as {
  productOverrides: Map<string, any>;
  deletedProductIds: Set<string>;
};

if (!globalForCatalog.productOverrides) {
  globalForCatalog.productOverrides = new Map<string, any>();
}

if (!globalForCatalog.deletedProductIds) {
  globalForCatalog.deletedProductIds = new Set<string>();
}

const TMP_FILE = path.join(os.tmpdir(), 'black_island_overrides.json');

function syncFromTmpDisk() {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (data && Array.isArray(data.overrides)) {
        for (const p of data.overrides) {
          if (p && p.id) {
            globalForCatalog.productOverrides.set(p.id, p);
          }
        }
      }
      if (data && Array.isArray(data.deleted)) {
        for (const id of data.deleted) {
          globalForCatalog.deletedProductIds.add(id);
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
    };
    fs.writeFileSync(TMP_FILE, JSON.stringify(data), 'utf-8');
  } catch (e) {
    // Ignore write errors
  }
}

// Initial sync
syncFromTmpDisk();

export const productOverrides = globalForCatalog.productOverrides;
export const deletedProductIds = globalForCatalog.deletedProductIds;

export function setProductOverride(product: any) {
  if (!product || !product.id) return;
  syncFromTmpDisk();
  globalForCatalog.productOverrides.set(product.id, {
    ...product,
    updatedAt: new Date().toISOString(),
  });
  syncToTmpDisk();
}

export function markProductDeleted(id: string) {
  syncFromTmpDisk();
  globalForCatalog.deletedProductIds.add(id);
  globalForCatalog.productOverrides.delete(id);
  syncToTmpDisk();
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
