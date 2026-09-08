import { syncFromCloud, applyOverrides } from '../src/lib/runtimeStore';
import { INITIAL_PRODUCTS } from '../src/lib/initialCatalog';

async function testStandaloneCatalog() {
  console.log('1. Syncing from cloud...');
  await syncFromCloud(true);

  console.log('2. Applying overrides on INITIAL_PRODUCTS...');
  const products = applyOverrides(INITIAL_PRODUCTS);
  console.log('Total products count:', products.length);

  console.log('\nCategory breakdown:');
  const catCounts: Record<string, number> = {};
  products.forEach((p: any) => {
    const cat = p.categorySlug || 'unknown';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  console.log(JSON.stringify(catCounts, null, 2));

  console.log('\nChecking for any newly added products (non-initial):');
  const initialIds = new Set(INITIAL_PRODUCTS.map((p) => p.id));
  const newProducts = products.filter((p) => !initialIds.has(p.id));
  console.log('New products count:', newProducts.length);
  newProducts.forEach((p) => {
    console.log(`  - [${p.id}] ${p.nameAr} (${p.nameEn}) - Cat: ${p.categorySlug}`);
  });
}

testStandaloneCatalog().catch(console.error);
