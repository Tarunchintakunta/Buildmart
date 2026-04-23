import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@buildmart_cart';

// Spec CartItem interface (camelCase) — aliased from internal shape
export interface CartItem {
  // camelCase fields (spec)
  inventoryId: string;
  productId: string;
  productName: string;
  unit: string;
  shopId: string;
  shopName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  // snake_case aliases for backward compat with existing screens
  inventory_id: string;
  product_id?: string;
}

interface CartState {
  items: CartItem[];
  shopId: string | null;
  shopName: string | null;
  // Accepts both the new CartItem shape and the legacy { product, shop } shape
  addItem: (item: CartItem | LegacyItem) => void;
  removeItem: (inventoryId: string) => void;
  updateQuantity: (inventoryId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItem: (inventoryId: string) => CartItem | undefined;
  _loadFromStorage: () => Promise<void>;
}

// Allow incoming items from screens that still use the old { product: Product, shop: Shop } shape
type LegacyItem = {
  inventory_id?: string;
  inventoryId?: string;
  product?: { id?: string; name?: string; image_url?: string; unit?: string };
  shop?: { id?: string; name?: string };
  price?: number;
  quantity?: number;
  // new fields
  productId?: string;
  product_id?: string;
  productName?: string;
  unit?: string;
  shopId?: string;
  shopName?: string;
  imageUrl?: string;
};

/**
 * Normalize an incoming item so both camelCase and snake_case id fields are set.
 * Accepts both the new CartItem shape and the legacy { product, shop } shape.
 */
const normalize = (item: LegacyItem): CartItem => {
  const id = (item.inventoryId ?? item.inventory_id) as string;
  const productId = item.productId ?? item.product_id ?? item.product?.id ?? '';
  const productName = item.productName ?? item.product?.name ?? '';
  const unit = item.unit ?? item.product?.unit ?? 'unit';
  const shopId = item.shopId ?? item.shop?.id ?? '';
  const shopName = item.shopName ?? item.shop?.name ?? '';
  const imageUrl = item.imageUrl ?? item.product?.image_url;

  return {
    inventoryId: id,
    inventory_id: id,
    productId,
    product_id: productId,
    productName,
    unit,
    shopId,
    shopName,
    price: item.price ?? 0,
    quantity: item.quantity ?? 1,
    imageUrl,
  };
};

const persistCart = (items: CartItem[], shopId: string | null, shopName: string | null) => {
  AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, shopId, shopName })).catch(() => {});
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  shopId: null,
  shopName: null,

  addItem: (rawItem: CartItem | LegacyItem) => {
    const item = normalize(rawItem as LegacyItem);
    set((state) => {
      let newItems: CartItem[];
      let newShopId: string | null;
      let newShopName: string | null;

      // If adding from a different shop, replace the cart
      if (state.shopId && state.shopId !== item.shopId) {
        newItems = [item];
        newShopId = item.shopId;
        newShopName = item.shopName;
      } else {
        const existingIndex = state.items.findIndex(
          (i) => i.inventoryId === item.inventoryId
        );
        if (existingIndex >= 0) {
          newItems = [...state.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
          };
        } else {
          newItems = [...state.items, item];
        }
        newShopId = item.shopId;
        newShopName = item.shopName;
      }

      persistCart(newItems, newShopId, newShopName);
      return { items: newItems, shopId: newShopId, shopName: newShopName };
    });
  },

  removeItem: (inventoryId: string) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.inventoryId !== inventoryId);
      const newShopId = newItems.length > 0 ? state.shopId : null;
      const newShopName = newItems.length > 0 ? state.shopName : null;
      persistCart(newItems, newShopId, newShopName);
      return { items: newItems, shopId: newShopId, shopName: newShopName };
    });
  },

  updateQuantity: (inventoryId: string, qty: number) => {
    set((state) => {
      if (qty <= 0) {
        const newItems = state.items.filter((i) => i.inventoryId !== inventoryId);
        const newShopId = newItems.length > 0 ? state.shopId : null;
        const newShopName = newItems.length > 0 ? state.shopName : null;
        persistCart(newItems, newShopId, newShopName);
        return { items: newItems, shopId: newShopId, shopName: newShopName };
      }
      const newItems = state.items.map((i) =>
        i.inventoryId === inventoryId ? { ...i, quantity: qty } : i
      );
      persistCart(newItems, state.shopId, state.shopName);
      return { items: newItems };
    });
  },

  clearCart: () => {
    persistCart([], null, null);
    set({ items: [], shopId: null, shopName: null });
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getItem: (inventoryId: string) => {
    return get().items.find((i) => i.inventoryId === inventoryId);
  },

  _loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const { items, shopId, shopName } = JSON.parse(raw) as {
          items: CartItem[];
          shopId: string | null;
          shopName: string | null;
        };
        if (Array.isArray(items)) {
          // Normalize persisted items so both id fields exist
          const normalized = items.map((i) => normalize(i));
          set({ items: normalized, shopId: shopId ?? null, shopName: shopName ?? null });
        }
      }
    } catch {
      // corrupted — ignore
    }
  },
}));
