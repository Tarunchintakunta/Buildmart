// =============================================
// MOCK DATA SERVICE
// Simulates API responses for the prototype
// =============================================

import {
  User,
  WorkerProfile,
  Shop,
  Product,
  Inventory,
  Order,
  Agreement,
  LaborRequest,
  Wallet,
  Transaction,
  Notification,
  Category,
  Verification,
} from '../types/database';

// Generate unique IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);
export const generateOrderNumber = () => `ORD-${Date.now().toString().slice(-8)}`;
export const generateAgreementNumber = () => `AGR-${Date.now().toString().slice(-8)}`;
export const generateTransactionNumber = () => `TXN-${Date.now().toString().slice(-8)}`;

// Categories
export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Cement & Concrete', description: 'Cement bags and concrete products', icon: 'cement', created_at: new Date().toISOString() },
  { id: 'c2', name: 'Doors & Windows', description: 'Wooden, metal, and UPVC doors/windows', icon: 'door', created_at: new Date().toISOString() },
  { id: 'c3', name: 'Pipes & Fittings', description: 'PVC, CPVC, and metal pipes', icon: 'pipe', created_at: new Date().toISOString() },
  { id: 'c4', name: 'Electrical', description: 'Wires, switches, and components', icon: 'electrical', created_at: new Date().toISOString() },
  { id: 'c5', name: 'Hardware', description: 'Nails, screws, tools', icon: 'hardware', created_at: new Date().toISOString() },
  { id: 'c6', name: 'Sand & Aggregates', description: 'Construction sand and gravel', icon: 'sand', created_at: new Date().toISOString() },
  { id: 'c7', name: 'Steel & Metal', description: 'TMT bars and steel products', icon: 'steel', created_at: new Date().toISOString() },
  { id: 'c8', name: 'Paint & Finishing', description: 'Paints and finishing materials', icon: 'paint', created_at: new Date().toISOString() },
];

// Worker Skills with labels
export const WORKER_SKILLS = [
  { id: 'coolie', label: 'Coolie', icon: 'fitness' },
  { id: 'mason', label: 'Mason', icon: 'construct' },
  { id: 'electrician', label: 'Electrician', icon: 'flash' },
  { id: 'plumber', label: 'Plumber', icon: 'water' },
  { id: 'carpenter', label: 'Carpenter', icon: 'hammer' },
  { id: 'painter', label: 'Painter', icon: 'color-palette' },
  { id: 'welder', label: 'Welder', icon: 'flame' },
  { id: 'helper', label: 'Helper', icon: 'people' },
];

// Simulated delay for API calls
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// =============================================
// WALLET OPERATIONS
// =============================================

export const walletOperations = {
  async getBalance(userId: string): Promise<Wallet> {
    await delay(500);
    // Return mock wallet based on user type
    return {
      id: `wallet-${userId}`,
      user_id: userId,
      balance: 25000,
      held_balance: 0,
      total_earned: 0,
      total_spent: 5000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async holdFunds(walletId: string, amount: number, referenceType: string, referenceId: string): Promise<Transaction> {
    await delay(800);
    return {
      id: generateId(),
      transaction_number: generateTransactionNumber(),
      wallet_id: walletId,
      type: 'hold',
      amount,
      status: 'held',
      reference_type: referenceType,
      reference_id: referenceId,
      description: `Funds held for ${referenceType}`,
      created_at: new Date().toISOString(),
    };
  },

  async releaseFunds(transactionId: string): Promise<Transaction> {
    await delay(800);
    return {
      id: transactionId,
      transaction_number: generateTransactionNumber(),
      wallet_id: 'wallet-1',
      type: 'release',
      amount: 0,
      status: 'completed',
      description: 'Funds released',
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };
  },

  async transferFunds(fromWalletId: string, toWalletId: string, amount: number, description: string): Promise<Transaction> {
    await delay(1000);
    return {
      id: generateId(),
      transaction_number: generateTransactionNumber(),
      wallet_id: fromWalletId,
      type: 'payment',
      amount,
      status: 'completed',
      description,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };
  },
};

// =============================================
// ORDER OPERATIONS
// =============================================

export const orderOperations = {
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    await delay(1500);
    return {
      id: generateId(),
      order_number: generateOrderNumber(),
      customer_id: orderData.customer_id!,
      shop_id: orderData.shop_id!,
      status: 'pending',
      delivery_address: orderData.delivery_address!,
      delivery_latitude: orderData.delivery_latitude,
      delivery_longitude: orderData.delivery_longitude,
      subtotal: orderData.subtotal!,
      delivery_fee: orderData.delivery_fee!,
      tax: orderData.tax!,
      total_amount: orderData.total_amount!,
      delivery_notes: orderData.delivery_notes,
      estimated_delivery_minutes: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await delay(800);
    return {
      id: orderId,
      order_number: 'ORD-123',
      customer_id: '',
      shop_id: '',
      status,
      delivery_address: '',
      subtotal: 0,
      delivery_fee: 0,
      tax: 0,
      total_amount: 0,
      estimated_delivery_minutes: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async assignDriver(orderId: string, driverId: string): Promise<Order> {
    await delay(500);
    return {
      id: orderId,
      order_number: 'ORD-123',
      customer_id: '',
      shop_id: '',
      driver_id: driverId,
      status: 'processing',
      delivery_address: '',
      subtotal: 0,
      delivery_fee: 0,
      tax: 0,
      total_amount: 0,
      estimated_delivery_minutes: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};

// =============================================
// AGREEMENT OPERATIONS
// =============================================

export const agreementOperations = {
  async createAgreement(agreementData: Partial<Agreement>): Promise<Agreement> {
    await delay(1500);
    return {
      id: generateId(),
      agreement_number: generateAgreementNumber(),
      contractor_id: agreementData.contractor_id!,
      worker_id: agreementData.worker_id!,
      title: agreementData.title!,
      scope_of_work: agreementData.scope_of_work!,
      start_date: agreementData.start_date!,
      end_date: agreementData.end_date!,
      rate_type: agreementData.rate_type!,
      rate_amount: agreementData.rate_amount!,
      working_hours_per_day: agreementData.working_hours_per_day || 8,
      work_location: agreementData.work_location,
      termination_notice_days: agreementData.termination_notice_days || 7,
      termination_terms: agreementData.termination_terms,
      additional_terms: agreementData.additional_terms,
      total_value: agreementData.total_value!,
      status: 'pending_signature',
      contractor_signed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async signAgreement(agreementId: string, signedBy: 'contractor' | 'worker'): Promise<Agreement> {
    await delay(1000);
    return {
      id: agreementId,
      agreement_number: 'AGR-123',
      contractor_id: '',
      worker_id: '',
      title: '',
      scope_of_work: '',
      start_date: '',
      end_date: '',
      rate_type: 'daily',
      rate_amount: 0,
      working_hours_per_day: 8,
      termination_notice_days: 7,
      total_value: 0,
      status: signedBy === 'worker' ? 'active' : 'pending_signature',
      worker_signed_at: signedBy === 'worker' ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async terminateAgreement(agreementId: string, reason: string): Promise<Agreement> {
    await delay(1000);
    return {
      id: agreementId,
      agreement_number: 'AGR-123',
      contractor_id: '',
      worker_id: '',
      title: '',
      scope_of_work: '',
      start_date: '',
      end_date: '',
      rate_type: 'daily',
      rate_amount: 0,
      working_hours_per_day: 8,
      termination_notice_days: 7,
      total_value: 0,
      status: 'terminated',
      terminated_at: new Date().toISOString(),
      termination_reason: reason,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};

// =============================================
// LABOR REQUEST OPERATIONS
// =============================================

export const laborOperations = {
  async createRequest(requestData: Partial<LaborRequest>): Promise<LaborRequest> {
    await delay(1000);
    return {
      id: generateId(),
      request_number: `LBR-${Date.now().toString().slice(-8)}`,
      customer_id: requestData.customer_id!,
      worker_id: requestData.worker_id,
      skill_required: requestData.skill_required!,
      description: requestData.description,
      work_address: requestData.work_address!,
      scheduled_date: requestData.scheduled_date!,
      scheduled_time: requestData.scheduled_time!,
      duration_hours: requestData.duration_hours || 2,
      offered_rate: requestData.offered_rate!,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async acceptRequest(requestId: string, workerId: string): Promise<LaborRequest> {
    await delay(800);
    return {
      id: requestId,
      request_number: 'LBR-123',
      customer_id: '',
      worker_id: workerId,
      skill_required: 'coolie',
      work_address: '',
      scheduled_date: '',
      scheduled_time: '',
      duration_hours: 2,
      offered_rate: 0,
      status: 'accepted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async completeRequest(requestId: string): Promise<LaborRequest> {
    await delay(800);
    return {
      id: requestId,
      request_number: 'LBR-123',
      customer_id: '',
      skill_required: 'coolie',
      work_address: '',
      scheduled_date: '',
      scheduled_time: '',
      duration_hours: 2,
      offered_rate: 0,
      status: 'completed',
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};

// =============================================
// VERIFICATION OPERATIONS
// =============================================

export const verificationOperations = {
  async submitVerification(workerId: string, verificationData: Partial<Verification>): Promise<Verification> {
    await delay(1500);
    return {
      id: generateId(),
      worker_id: workerId,
      id_type: verificationData.id_type!,
      id_number: verificationData.id_number,
      id_front_url: verificationData.id_front_url!,
      id_back_url: verificationData.id_back_url,
      selfie_url: verificationData.selfie_url,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };
  },

  async approveVerification(verificationId: string, adminId: string, notes?: string): Promise<Verification> {
    await delay(1000);
    return {
      id: verificationId,
      worker_id: '',
      id_type: '',
      id_front_url: '',
      status: 'approved',
      reviewed_by: adminId,
      review_notes: notes,
      submitted_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString(),
    };
  },

  async rejectVerification(verificationId: string, adminId: string, reason: string): Promise<Verification> {
    await delay(1000);
    return {
      id: verificationId,
      worker_id: '',
      id_type: '',
      id_front_url: '',
      status: 'rejected',
      reviewed_by: adminId,
      review_notes: reason,
      submitted_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString(),
    };
  },
};

// =============================================
// INVENTORY OPERATIONS (Concierge Logic)
// =============================================

export const inventoryOperations = {
  async checkAvailability(shopId: string, productId: string, quantity: number): Promise<{ available: boolean; stock: number }> {
    await delay(300);
    // Mock availability check
    const stock = Math.floor(Math.random() * 100);
    return {
      available: stock >= quantity,
      stock,
    };
  },

  async findAlternateShop(productId: string, quantity: number, excludeShopId: string): Promise<{ shopId: string; shopName: string; price: number } | null> {
    await delay(500);
    // Mock finding alternate shop
    return {
      shopId: 'alternate-shop-1',
      shopName: 'Sri Lakshmi Traders',
      price: 375,
    };
  },

  async createConciergeTask(orderId: string, orderItemId: string, productId: string, quantity: number, originalShopId: string, alternateShopId: string) {
    await delay(800);
    return {
      id: generateId(),
      order_id: orderId,
      order_item_id: orderItemId,
      product_id: productId,
      quantity,
      original_shop_id: originalShopId,
      alternate_shop_id: alternateShopId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
  },
};

// =============================================
// NOTIFICATION OPERATIONS
// =============================================

export const notificationOperations = {
  async sendNotification(userId: string, title: string, message: string, type: string, referenceId?: string): Promise<Notification> {
    await delay(300);
    return {
      id: generateId(),
      user_id: userId,
      title,
      message,
      type,
      reference_type: type,
      reference_id: referenceId,
      is_read: false,
      created_at: new Date().toISOString(),
    };
  },

  async markAsRead(notificationId: string): Promise<void> {
    await delay(200);
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay(300);
  },
};
