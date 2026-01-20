// =============================================
// UTILITY HELPER FUNCTIONS
// =============================================

import { UserRole, OrderStatus, AgreementStatus, WorkerStatus } from '../types/database';

// =============================================
// FORMATTING UTILITIES
// =============================================

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "5 mins ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
};

// =============================================
// STATUS HELPERS
// =============================================

/**
 * Get order status display info
 */
export const getOrderStatusInfo = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: string }> = {
    pending: { label: 'Pending', color: '#EAB308', bgColor: 'rgba(234, 179, 8, 0.2)', icon: 'time' },
    accepted: { label: 'Accepted', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.2)', icon: 'checkmark' },
    processing: { label: 'Processing', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.2)', icon: 'cube' },
    out_for_delivery: { label: 'Out for Delivery', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.2)', icon: 'car' },
    delivered: { label: 'Delivered', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.2)', icon: 'checkmark-circle' },
    cancelled: { label: 'Cancelled', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.2)', icon: 'close-circle' },
  };
  return statusMap[status];
};

/**
 * Get agreement status display info
 */
export const getAgreementStatusInfo = (status: AgreementStatus) => {
  const statusMap: Record<AgreementStatus, { label: string; color: string; bgColor: string }> = {
    draft: { label: 'Draft', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.2)' },
    pending_signature: { label: 'Pending Signature', color: '#EAB308', bgColor: 'rgba(234, 179, 8, 0.2)' },
    active: { label: 'Active', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.2)' },
    completed: { label: 'Completed', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.2)' },
    terminated: { label: 'Terminated', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.2)' },
  };
  return statusMap[status];
};

/**
 * Get worker status display info
 */
export const getWorkerStatusInfo = (status: WorkerStatus) => {
  const statusMap: Record<WorkerStatus, { label: string; color: string; bgColor: string }> = {
    waiting: { label: 'Available', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.2)' },
    working: { label: 'Working', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.2)' },
  };
  return statusMap[status];
};

/**
 * Get user role display info
 */
export const getUserRoleInfo = (role: UserRole) => {
  const roleMap: Record<UserRole, { label: string; color: string; icon: string }> = {
    customer: { label: 'Customer', color: '#3B82F6', icon: 'person' },
    contractor: { label: 'Contractor', color: '#8B5CF6', icon: 'business' },
    worker: { label: 'Worker', color: '#22C55E', icon: 'hammer' },
    shopkeeper: { label: 'Shop Owner', color: '#F97316', icon: 'storefront' },
    driver: { label: 'Driver', color: '#06B6D4', icon: 'car' },
    admin: { label: 'Admin', color: '#EF4444', icon: 'shield-checkmark' },
  };
  return roleMap[role];
};

// =============================================
// CALCULATION HELPERS
// =============================================

/**
 * Calculate GST (18%)
 */
export const calculateGST = (amount: number): number => {
  return Math.round(amount * 0.18);
};

/**
 * Calculate delivery fee based on order value
 */
export const calculateDeliveryFee = (subtotal: number): number => {
  if (subtotal >= 5000) return 0; // Free delivery above 5000
  if (subtotal >= 2000) return 100;
  return 150;
};

/**
 * Calculate total order amount
 */
export const calculateOrderTotal = (subtotal: number): { subtotal: number; deliveryFee: number; tax: number; total: number } => {
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateGST(subtotal);
  const total = subtotal + deliveryFee + tax;
  return { subtotal, deliveryFee, tax, total };
};

/**
 * Calculate agreement total value
 */
export const calculateAgreementValue = (
  startDate: string,
  endDate: string,
  rateType: 'daily' | 'weekly' | 'monthly',
  rateAmount: number
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  switch (rateType) {
    case 'daily':
      return days * rateAmount;
    case 'weekly':
      return Math.ceil(days / 7) * rateAmount;
    case 'monthly':
      return Math.ceil(days / 30) * rateAmount;
    default:
      return 0;
  }
};

// =============================================
// VALIDATION HELPERS
// =============================================

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};

// =============================================
// DISTANCE HELPERS
// =============================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
};

const toRad = (deg: number): number => deg * (Math.PI / 180);

/**
 * Format distance for display
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km} km`;
};

// =============================================
// MISC HELPERS
// =============================================

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Generate random color for avatars
 */
export const getRandomColor = (seed: string): string => {
  const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];
  const index = seed.charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
