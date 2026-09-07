// Global Runtime Store for Resilient Overrides & Serverless Disk Safeguard (Vercel)
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

export const productOverrides = globalForCatalog.productOverrides;
export const deletedProductIds = globalForCatalog.deletedProductIds;

export function setProductOverride(product: any) {
  if (!product || !product.id) return;
  productOverrides.set(product.id, {
    ...product,
    updatedAt: new Date().toISOString(),
  });
}

export function markProductDeleted(id: string) {
  deletedProductIds.add(id);
  productOverrides.delete(id);
}

export function applyOverrides(products: any[]): any[] {
  if (!Array.isArray(products)) return [];

  // Filter out deleted products
  let list = products.filter((p) => !deletedProductIds.has(p.id));

  // Apply updated overrides
  const map = new Map<string, any>(list.map((p) => [p.id, p]));
  for (const [id, overrideProduct] of productOverrides.entries()) {
    map.set(id, overrideProduct);
  }

  return Array.from(map.values());
}
