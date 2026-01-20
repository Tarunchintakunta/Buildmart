import { create } from 'zustand';
import {
  User,
  Product,
  Shop,
  Order,
  Agreement,
  LaborRequest,
  Wallet,
  Transaction,
  WorkerProfile,
  Notification,
  Category,
  InventoryWithProduct,
  Verification,
  WorkerStatus,
} from '../types/database';

// =============================================
// CART STORE
// =============================================

interface CartItem {
  inventory_id: string;
  product: Product;
  shop: Shop;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  selectedShopId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (inventoryId: string) => void;
  updateQuantity: (inventoryId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  selectedShopId: null,

  addItem: (item) =>
    set((state) => {
      // If cart has items from different shop, clear first
      if (state.selectedShopId && state.selectedShopId !== item.shop.id) {
        return {
          items: [item],
          selectedShopId: item.shop.id,
        };
      }

      const existingIndex = state.items.findIndex(
        (i) => i.inventory_id === item.inventory_id
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += item.quantity;
        return { items: newItems };
      }

      return {
        items: [...state.items, item],
        selectedShopId: item.shop.id,
      };
    }),

  removeItem: (inventoryId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.inventory_id !== inventoryId);
      return {
        items: newItems,
        selectedShopId: newItems.length > 0 ? state.selectedShopId : null,
      };
    }),

  updateQuantity: (inventoryId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((i) => i.inventory_id !== inventoryId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.inventory_id === inventoryId ? { ...i, quantity } : i
        ),
      };
    }),

  clearCart: () => set({ items: [], selectedShopId: null }),

  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

// =============================================
// WALLET STORE
// =============================================

interface WalletStore {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  setWallet: (wallet: Wallet) => void;
  setTransactions: (transactions: Transaction[]) => void;
  updateBalance: (amount: number) => void;
  holdFunds: (amount: number) => void;
  releaseFunds: (amount: number) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  transactions: [],
  isLoading: false,

  setWallet: (wallet) => set({ wallet }),

  setTransactions: (transactions) => set({ transactions }),

  updateBalance: (amount) =>
    set((state) => ({
      wallet: state.wallet
        ? { ...state.wallet, balance: state.wallet.balance + amount }
        : null,
    })),

  holdFunds: (amount) =>
    set((state) => ({
      wallet: state.wallet
        ? {
            ...state.wallet,
            balance: state.wallet.balance - amount,
            held_balance: state.wallet.held_balance + amount,
          }
        : null,
    })),

  releaseFunds: (amount) =>
    set((state) => ({
      wallet: state.wallet
        ? {
            ...state.wallet,
            held_balance: state.wallet.held_balance - amount,
          }
        : null,
    })),
}));

// =============================================
// ORDERS STORE
// =============================================

interface OrdersStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  updateOrder: (orderId, updates) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, ...updates } : o
      ),
    })),

  setCurrentOrder: (order) => set({ currentOrder: order }),
}));

// =============================================
// LABOR STORE
// =============================================

interface LaborStore {
  requests: LaborRequest[];
  agreements: Agreement[];
  currentRequest: LaborRequest | null;
  currentAgreement: Agreement | null;
  isLoading: boolean;
  setRequests: (requests: LaborRequest[]) => void;
  setAgreements: (agreements: Agreement[]) => void;
  addRequest: (request: LaborRequest) => void;
  addAgreement: (agreement: Agreement) => void;
  updateRequest: (requestId: string, updates: Partial<LaborRequest>) => void;
  updateAgreement: (agreementId: string, updates: Partial<Agreement>) => void;
}

export const useLaborStore = create<LaborStore>((set) => ({
  requests: [],
  agreements: [],
  currentRequest: null,
  currentAgreement: null,
  isLoading: false,

  setRequests: (requests) => set({ requests }),
  setAgreements: (agreements) => set({ agreements }),

  addRequest: (request) =>
    set((state) => ({ requests: [request, ...state.requests] })),

  addAgreement: (agreement) =>
    set((state) => ({ agreements: [agreement, ...state.agreements] })),

  updateRequest: (requestId, updates) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, ...updates } : r
      ),
    })),

  updateAgreement: (agreementId, updates) =>
    set((state) => ({
      agreements: state.agreements.map((a) =>
        a.id === agreementId ? { ...a, ...updates } : a
      ),
    })),
}));

// =============================================
// WORKER STORE (For worker-specific state)
// =============================================

interface WorkerStore {
  profile: WorkerProfile | null;
  status: WorkerStatus;
  isLoading: boolean;
  setProfile: (profile: WorkerProfile) => void;
  toggleStatus: () => void;
  setStatus: (status: WorkerStatus) => void;
}

export const useWorkerStore = create<WorkerStore>((set) => ({
  profile: null,
  status: 'waiting',
  isLoading: false,

  setProfile: (profile) => set({ profile, status: profile.status }),

  toggleStatus: () =>
    set((state) => ({
      status: state.status === 'working' ? 'waiting' : 'working',
      profile: state.profile
        ? {
            ...state.profile,
            status: state.status === 'working' ? 'waiting' : 'working',
          }
        : null,
    })),

  setStatus: (status) =>
    set((state) => ({
      status,
      profile: state.profile ? { ...state.profile, status } : null,
    })),
}));

// =============================================
// SHOP STORE (For shopkeeper-specific state)
// =============================================

interface ShopStore {
  shop: Shop | null;
  inventory: InventoryWithProduct[];
  pendingOrders: Order[];
  isLoading: boolean;
  setShop: (shop: Shop) => void;
  setInventory: (inventory: InventoryWithProduct[]) => void;
  setPendingOrders: (orders: Order[]) => void;
  updateInventoryItem: (inventoryId: string, updates: Partial<InventoryWithProduct>) => void;
}

export const useShopStore = create<ShopStore>((set) => ({
  shop: null,
  inventory: [],
  pendingOrders: [],
  isLoading: false,

  setShop: (shop) => set({ shop }),
  setInventory: (inventory) => set({ inventory }),
  setPendingOrders: (orders) => set({ pendingOrders: orders }),

  updateInventoryItem: (inventoryId, updates) =>
    set((state) => ({
      inventory: state.inventory.map((i) =>
        i.id === inventoryId ? { ...i, ...updates } : i
      ),
    })),
}));

// =============================================
// ADMIN STORE
// =============================================

interface AdminStore {
  pendingVerifications: Verification[];
  allWorkers: (User & { worker_profile?: WorkerProfile })[];
  isLoading: boolean;
  setPendingVerifications: (verifications: Verification[]) => void;
  setAllWorkers: (workers: (User & { worker_profile?: WorkerProfile })[]) => void;
  approveVerification: (verificationId: string) => void;
  rejectVerification: (verificationId: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  pendingVerifications: [],
  allWorkers: [],
  isLoading: false,

  setPendingVerifications: (verifications) =>
    set({ pendingVerifications: verifications }),

  setAllWorkers: (workers) => set({ allWorkers: workers }),

  approveVerification: (verificationId) =>
    set((state) => ({
      pendingVerifications: state.pendingVerifications.filter(
        (v) => v.id !== verificationId
      ),
    })),

  rejectVerification: (verificationId) =>
    set((state) => ({
      pendingVerifications: state.pendingVerifications.filter(
        (v) => v.id !== verificationId
      ),
    })),
}));

// =============================================
// NOTIFICATIONS STORE
// =============================================

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
    })),

  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
}));

// =============================================
// UI STORE (Global UI state)
// =============================================

interface UIStore {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
