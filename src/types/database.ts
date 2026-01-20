// =============================================
// DATABASE TYPES - TypeScript Definitions
// =============================================

// Enums
export type UserRole = 'customer' | 'contractor' | 'worker' | 'shopkeeper' | 'driver' | 'admin';

export type WorkerSkill =
  | 'coolie'
  | 'mason'
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'painter'
  | 'welder'
  | 'helper';

export type WorkerStatus = 'working' | 'waiting';

export type DriverType = 'shop_driver' | 'freelance';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type AgreementStatus =
  | 'draft'
  | 'pending_signature'
  | 'active'
  | 'completed'
  | 'terminated';

export type LaborRequestStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'payment'
  | 'hold'
  | 'release'
  | 'refund';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'held';

export type ConciergeTaskStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type RateType = 'daily' | 'weekly' | 'monthly';

// Base interfaces
export interface User {
  id: string;
  phone: string;
  full_name: string;
  email?: string;
  role: UserRole;
  avatar_url?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  skills: WorkerSkill[];
  experience_years: number;
  daily_rate: number;
  hourly_rate?: number;
  status: WorkerStatus;
  bio?: string;
  rating: number;
  total_jobs: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Verification {
  id: string;
  worker_id: string;
  id_type: string;
  id_number?: string;
  id_front_url: string;
  id_back_url?: string;
  selfie_url?: string;
  status: VerificationStatus;
  reviewed_by?: string;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  is_active: boolean;
  rating: number;
  opening_time: string;
  closing_time: string;
  delivery_radius_km: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  unit: string;
  image_url?: string;
  is_heavy: boolean;
  weight_kg?: number;
  created_at: string;
}

export interface Inventory {
  id: string;
  shop_id: string;
  product_id: string;
  price: number;
  stock_quantity: number;
  min_order_quantity: number;
  max_order_quantity: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriverProfile {
  id: string;
  user_id: string;
  driver_type: DriverType;
  shop_id?: string;
  vehicle_type?: string;
  vehicle_number?: string;
  license_number?: string;
  is_available: boolean;
  current_latitude?: number;
  current_longitude?: number;
  rating: number;
  total_deliveries: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  shop_id: string;
  driver_id?: string;
  status: OrderStatus;
  delivery_address: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total_amount: number;
  delivery_notes?: string;
  estimated_delivery_minutes: number;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  inventory_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_available: boolean;
  concierge_required: boolean;
  created_at: string;
}

export interface ConciergeTask {
  id: string;
  order_id: string;
  order_item_id: string;
  driver_id?: string;
  original_shop_id: string;
  alternate_shop_id?: string;
  product_id: string;
  quantity: number;
  status: ConciergeTaskStatus;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface LaborRequest {
  id: string;
  request_number: string;
  customer_id: string;
  worker_id?: string;
  skill_required: WorkerSkill;
  description?: string;
  work_address: string;
  work_latitude?: number;
  work_longitude?: number;
  scheduled_date: string;
  scheduled_time: string;
  duration_hours: number;
  offered_rate: number;
  status: LaborRequestStatus;
  started_at?: string;
  completed_at?: string;
  customer_rating?: number;
  worker_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface Agreement {
  id: string;
  agreement_number: string;
  contractor_id: string;
  worker_id: string;
  title: string;
  scope_of_work: string;
  start_date: string;
  end_date: string;
  rate_type: RateType;
  rate_amount: number;
  working_hours_per_day: number;
  work_location?: string;
  work_latitude?: number;
  work_longitude?: number;
  termination_notice_days: number;
  termination_terms?: string;
  additional_terms?: string;
  total_value: number;
  status: AgreementStatus;
  contractor_signed_at?: string;
  worker_signed_at?: string;
  terminated_at?: string;
  termination_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  held_balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_number: string;
  wallet_id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference_type?: string;
  reference_id?: string;
  from_user_id?: string;
  to_user_id?: string;
  description?: string;
  created_at: string;
  completed_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}

// Extended types with relations
export interface WorkerWithProfile extends User {
  worker_profile?: WorkerProfile;
  verification?: Verification;
}

export interface ShopWithOwner extends Shop {
  owner?: User;
}

export interface ProductWithInventory extends Product {
  category?: Category;
  inventory?: Inventory[];
}

export interface InventoryWithProduct extends Inventory {
  product?: Product;
  shop?: Shop;
}

export interface OrderWithDetails extends Order {
  customer?: User;
  shop?: Shop;
  driver?: User;
  items?: OrderItemWithProduct[];
}

export interface OrderItemWithProduct extends OrderItem {
  product?: Product;
}

export interface AgreementWithParties extends Agreement {
  contractor?: User;
  worker?: WorkerWithProfile;
}

export interface LaborRequestWithParties extends LaborRequest {
  customer?: User;
  worker?: WorkerWithProfile;
}

export interface TransactionWithUsers extends Transaction {
  from_user?: User;
  to_user?: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  phone: string;
  otp?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
