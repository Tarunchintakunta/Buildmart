/**
 * BuildMart Real Image URLs
 * All images sourced from Unsplash (free, no API key needed for direct access)
 * and other royalty-free CDNs.
 *
 * Usage:
 *   import { PRODUCT_IMAGES, CATEGORY_IMAGES, WORKER_IMAGES } from '../constants/images';
 *   <Image source={{ uri: PRODUCT_IMAGES.cement }} />
 */

// ─── Construction Product Images ────────────────────────────────────────────
export const PRODUCT_IMAGES = {
  // Cement
  cement: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=400&q=80',
  cementBags: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  cementPour: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=400&q=80',

  // Steel / TMT
  steelBars: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&q=80',
  steelRods: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  metalStructure: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&q=80',

  // Bricks
  bricks: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
  redBricks: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  brickWall: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400&q=80',

  // Paint
  paint: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',
  paintBuckets: 'https://images.unsplash.com/photo-1544511916-0148ccdeb877?w=400&q=80',
  paintRoller: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=400&q=80',

  // Pipes & Plumbing
  pipes: 'https://images.unsplash.com/photo-1558618047-3c8e3f8a5c7e?w=400&q=80',
  pvcPipes: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
  plumbing: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',

  // Electrical
  wires: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  electricalPanel: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80',
  cables: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&q=80',

  // Sand & Aggregate
  sand: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  gravel: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=400&q=80',
  aggregate: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',

  // Hardware & Tools
  hardware: 'https://images.unsplash.com/photo-1581147036324-c17ac41c001f?w=400&q=80',
  tools: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
  bolts: 'https://images.unsplash.com/photo-1558618047-3c8e3f8a5c7e?w=400&q=80',

  // Water Tanks
  waterTank: 'https://images.unsplash.com/photo-1544511916-0148ccdeb877?w=400&q=80',

  // Tiles & Flooring
  tiles: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=400&q=80',
  flooring: 'https://images.unsplash.com/photo-1558618047-3c8e3f8a5c7e?w=400&q=80',

  // Doors & Windows
  door: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  window: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400&q=80',
};

// ─── Category Images ─────────────────────────────────────────────────────────
export const CATEGORY_IMAGES = {
  cement: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=200&q=80',
  steel: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=200&q=80',
  bricks: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&q=80',
  paint: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&q=80',
  pipes: 'https://images.unsplash.com/photo-1558618047-3c8e3f8a5c7e?w=200&q=80',
  electrical: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&q=80',
  hardware: 'https://images.unsplash.com/photo-1581147036324-c17ac41c001f?w=200&q=80',
  sand: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=80',
  tiles: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?w=200&q=80',
  doors: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
};

// ─── Worker/Person Profile Images ────────────────────────────────────────────
export const WORKER_IMAGES = {
  worker1: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&q=80',
  worker2: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&q=80',
  worker3: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&q=80',
  worker4: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80',
  worker5: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=200&q=80',
  worker6: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
  worker7: 'https://images.unsplash.com/photo-1558100440-d0a42ae30d7c?w=200&q=80',
  worker8: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=200&q=80',
  female1: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
};

// ─── Shop / Store Images ──────────────────────────────────────────────────────
export const SHOP_IMAGES = {
  hardwareStore: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=400&q=80',
  buildingMaterials: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  paintShop: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',
  electricalShop: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80',
  plumbingShop: 'https://images.unsplash.com/photo-1558618047-3c8e3f8a5c7e?w=400&q=80',
  warehouse: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
};

// ─── Construction Site / Banner Images ───────────────────────────────────────
export const BANNER_IMAGES = {
  constructionSite: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  blueprint: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  cityBuilding: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  hyderabadSkyline: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80',
  modernBuilding: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  brickwork: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80',
};

// ─── Branded Product Images (specific popular brands) ─────────────────────────
export const BRAND_PRODUCT_IMAGES: Record<string, string> = {
  // Using general category images for brand products
  'UltraTech Cement': PRODUCT_IMAGES.cementBags,
  'ACC Gold': PRODUCT_IMAGES.cement,
  'Ambuja': PRODUCT_IMAGES.cementPour,
  'SAIL TMT': PRODUCT_IMAGES.steelBars,
  'Tata Tiscon': PRODUCT_IMAGES.steelRods,
  'Asian Paints': PRODUCT_IMAGES.paint,
  'Berger Paints': PRODUCT_IMAGES.paintBuckets,
  'Havells': PRODUCT_IMAGES.cables,
  'Finolex': PRODUCT_IMAGES.wires,
  'Supreme Pipes': PRODUCT_IMAGES.pipes,
  'Sintex': PRODUCT_IMAGES.waterTank,
};

/**
 * Get a product image URL by product name or category
 * Falls back to a category-based image, then a generic construction image
 */
export function getProductImage(productName: string, category?: string): string {
  // Check brand matches
  for (const [brand, url] of Object.entries(BRAND_PRODUCT_IMAGES)) {
    if (productName.toLowerCase().includes(brand.toLowerCase())) {
      return url;
    }
  }

  // Check category matches
  if (category) {
    const cat = category.toLowerCase();
    if (cat.includes('cement')) return PRODUCT_IMAGES.cementBags;
    if (cat.includes('steel') || cat.includes('tmt') || cat.includes('rod')) return PRODUCT_IMAGES.steelBars;
    if (cat.includes('brick')) return PRODUCT_IMAGES.bricks;
    if (cat.includes('paint')) return PRODUCT_IMAGES.paint;
    if (cat.includes('pipe') || cat.includes('plumb')) return PRODUCT_IMAGES.pipes;
    if (cat.includes('electric') || cat.includes('wire') || cat.includes('cable')) return PRODUCT_IMAGES.cables;
    if (cat.includes('sand') || cat.includes('aggregate') || cat.includes('gravel')) return PRODUCT_IMAGES.sand;
    if (cat.includes('hardware') || cat.includes('tool')) return PRODUCT_IMAGES.hardware;
    if (cat.includes('tile') || cat.includes('floor')) return PRODUCT_IMAGES.tiles;
    if (cat.includes('door') || cat.includes('window')) return PRODUCT_IMAGES.door;
    if (cat.includes('tank') || cat.includes('water')) return PRODUCT_IMAGES.waterTank;
  }

  // Check product name
  const name = productName.toLowerCase();
  if (name.includes('cement')) return PRODUCT_IMAGES.cementBags;
  if (name.includes('tmt') || name.includes('steel') || name.includes('rod') || name.includes('bar')) return PRODUCT_IMAGES.steelBars;
  if (name.includes('brick')) return PRODUCT_IMAGES.redBricks;
  if (name.includes('paint')) return PRODUCT_IMAGES.paintBuckets;
  if (name.includes('pipe') || name.includes('cpvc') || name.includes('pvc')) return PRODUCT_IMAGES.pvcPipes;
  if (name.includes('wire') || name.includes('cable') || name.includes('havells') || name.includes('finolex')) return PRODUCT_IMAGES.cables;
  if (name.includes('sand') || name.includes('m-sand')) return PRODUCT_IMAGES.sand;
  if (name.includes('gravel') || name.includes('aggregate') || name.includes('jelly')) return PRODUCT_IMAGES.gravel;
  if (name.includes('tile')) return PRODUCT_IMAGES.tiles;
  if (name.includes('tank')) return PRODUCT_IMAGES.waterTank;
  if (name.includes('door')) return PRODUCT_IMAGES.door;

  // Default: generic construction material
  return BANNER_IMAGES.constructionSite;
}

/**
 * Get a worker profile image by index (cycles through available images)
 */
export function getWorkerImage(index: number): string {
  const images = Object.values(WORKER_IMAGES);
  return images[index % images.length];
}

/**
 * Get category image URL by category name
 */
export function getCategoryImage(categoryName: string): string {
  const cat = categoryName.toLowerCase();
  if (cat.includes('cement')) return CATEGORY_IMAGES.cement;
  if (cat.includes('steel') || cat.includes('tmt')) return CATEGORY_IMAGES.steel;
  if (cat.includes('brick')) return CATEGORY_IMAGES.bricks;
  if (cat.includes('paint')) return CATEGORY_IMAGES.paint;
  if (cat.includes('pipe') || cat.includes('plumb')) return CATEGORY_IMAGES.pipes;
  if (cat.includes('electric')) return CATEGORY_IMAGES.electrical;
  if (cat.includes('hardware') || cat.includes('tool')) return CATEGORY_IMAGES.hardware;
  if (cat.includes('sand') || cat.includes('aggregate')) return CATEGORY_IMAGES.sand;
  if (cat.includes('tile') || cat.includes('floor')) return CATEGORY_IMAGES.tiles;
  if (cat.includes('door') || cat.includes('window')) return CATEGORY_IMAGES.doors;
  return BANNER_IMAGES.constructionSite;
}
