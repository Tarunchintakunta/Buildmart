// Centralized image assets for the app
// All product, shop, banner, and misc images

export const ProductImages: Record<string, any> = {
  cement: require('../../assets/images/products/cement.jpg'),
  'steel-bars': require('../../assets/images/products/steel-bars.jpg'),
  tiles: require('../../assets/images/products/tiles.jpg'),
  paint: require('../../assets/images/products/paint.jpg'),
  bricks: require('../../assets/images/products/bricks.jpg'),
  pipes: require('../../assets/images/products/pipes.jpg'),
  wire: require('../../assets/images/products/wire.jpg'),
  concrete: require('../../assets/images/products/concrete.jpg'),
  waterproofing: require('../../assets/images/products/waterproofing.jpg'),
};

export const ShopImages: Record<string, any> = {
  'shop-1': require('../../assets/images/shops/hardware-store-1.jpg'),
  'shop-2': require('../../assets/images/shops/hardware-store-2.jpg'),
  'shop-3': require('../../assets/images/shops/hardware-store-3.jpg'),
};

export const BannerImages = {
  construction: require('../../assets/images/banners/construction-banner.jpg'),
  building: require('../../assets/images/banners/building-banner.jpg'),
};

export const MiscImages = {
  mapPlaceholder: require('../../assets/images/misc/map-placeholder.jpg'),
  driverAvatar: require('../../assets/images/misc/driver-avatar.jpg'),
};

// Helper to get a product image by keyword, with fallback
export function getProductImage(name: string): any {
  const lower = name.toLowerCase();
  if (lower.includes('cement') || lower.includes('ppc') || lower.includes('portland')) return ProductImages.cement;
  if (lower.includes('steel') || lower.includes('tmt') || lower.includes('bar')) return ProductImages['steel-bars'];
  if (lower.includes('tile') || lower.includes('ceramic') || lower.includes('kajaria')) return ProductImages.tiles;
  if (lower.includes('paint') || lower.includes('apex') || lower.includes('emulsion')) return ProductImages.paint;
  if (lower.includes('brick') || lower.includes('clay')) return ProductImages.bricks;
  if (lower.includes('pipe') || lower.includes('cpvc') || lower.includes('pvc')) return ProductImages.pipes;
  if (lower.includes('wire') || lower.includes('electrical') || lower.includes('havells')) return ProductImages.wire;
  if (lower.includes('concrete') || lower.includes('ready mix')) return ProductImages.concrete;
  if (lower.includes('waterproof') || lower.includes('fixit') || lower.includes('pidilite')) return ProductImages.waterproofing;
  // Default fallback
  return ProductImages.cement;
}
