import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/database';

// Simulated users for testing (matching seed data)
const MOCK_USERS: Record<string, User> = {
  // Customers
  '9876543101': {
    id: 'u1000000-0000-0000-0000-000000000001',
    phone: '9876543101',
    full_name: 'Rahul Sharma',
    email: 'rahul@email.com',
    role: 'customer',
    address: '123 MG Road, Koramangala',
    city: 'Bangalore',
    latitude: 12.9352,
    longitude: 77.6245,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543102': {
    id: 'u1000000-0000-0000-0000-000000000002',
    phone: '9876543102',
    full_name: 'Priya Patel',
    email: 'priya@email.com',
    role: 'customer',
    address: '45 Park Street',
    city: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Contractors
  '9876543201': {
    id: 'u2000000-0000-0000-0000-000000000001',
    phone: '9876543201',
    full_name: 'Rajesh Constructions',
    email: 'rajesh.const@email.com',
    role: 'contractor',
    address: '100 Industrial Area',
    city: 'Bangalore',
    latitude: 12.9141,
    longitude: 77.6411,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543202': {
    id: 'u2000000-0000-0000-0000-000000000002',
    phone: '9876543202',
    full_name: 'BuildRight Pvt Ltd',
    email: 'buildright@email.com',
    role: 'contractor',
    address: '55 Electronic City',
    city: 'Bangalore',
    latitude: 12.8399,
    longitude: 77.6770,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Workers
  '9876543301': {
    id: 'u3000000-0000-0000-0000-000000000001',
    phone: '9876543301',
    full_name: 'Ramu Yadav',
    email: 'ramu@email.com',
    role: 'worker',
    address: 'Madiwala Village',
    city: 'Bangalore',
    latitude: 12.9226,
    longitude: 77.6174,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543302': {
    id: 'u3000000-0000-0000-0000-000000000002',
    phone: '9876543302',
    full_name: 'Suresh Kumar',
    email: 'suresh@email.com',
    role: 'worker',
    address: 'BTM Layout',
    city: 'Bangalore',
    latitude: 12.9166,
    longitude: 77.6101,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543304': {
    id: 'u3000000-0000-0000-0000-000000000004',
    phone: '9876543304',
    full_name: 'Ganesh Babu',
    email: 'ganesh@email.com',
    role: 'worker',
    address: 'Jayanagar',
    city: 'Bangalore',
    latitude: 12.9299,
    longitude: 77.5838,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Shopkeepers
  '9876543401': {
    id: 'u4000000-0000-0000-0000-000000000001',
    phone: '9876543401',
    full_name: 'Anand Hardware',
    email: 'anand.hw@email.com',
    role: 'shopkeeper',
    address: '10 KR Market',
    city: 'Bangalore',
    latitude: 12.9634,
    longitude: 77.5779,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543402': {
    id: 'u4000000-0000-0000-0000-000000000002',
    phone: '9876543402',
    full_name: 'Sri Lakshmi Traders',
    email: 'lakshmi.trade@email.com',
    role: 'shopkeeper',
    address: '25 Chickpet',
    city: 'Bangalore',
    latitude: 12.9673,
    longitude: 77.5773,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Drivers
  '9876543501': {
    id: 'u5000000-0000-0000-0000-000000000001',
    phone: '9876543501',
    full_name: 'Krishna Driver',
    email: 'krishna.d@email.com',
    role: 'driver',
    address: 'Madiwala',
    city: 'Bangalore',
    latitude: 12.9226,
    longitude: 77.6174,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543503': {
    id: 'u5000000-0000-0000-0000-000000000003',
    phone: '9876543503',
    full_name: 'Naveen Transport',
    email: 'naveen.t@email.com',
    role: 'driver',
    address: 'Indiranagar',
    city: 'Bangalore',
    latitude: 12.9784,
    longitude: 77.6408,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Admins
  '9876543601': {
    id: 'u6000000-0000-0000-0000-000000000001',
    phone: '9876543601',
    full_name: 'Admin One',
    email: 'admin1@marketplace.com',
    role: 'admin',
    address: 'HQ Office',
    city: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  '9876543602': {
    id: 'u6000000-0000-0000-0000-000000000002',
    phone: '9876543602',
    full_name: 'Admin Two',
    email: 'admin2@marketplace.com',
    role: 'admin',
    address: 'HQ Office',
    city: 'Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendOTP: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@buildmart_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    // Simulated OTP sending - always succeeds for mock users
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (MOCK_USERS[phone]) {
      console.log(`OTP sent to ${phone}: 123456`); // Mock OTP
      return { success: true };
    }

    return { success: false, error: 'Phone number not registered' };
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    // For prototype, accept "123456" as valid OTP
    if (otp !== '123456') {
      return { success: false, error: 'Invalid OTP' };
    }

    const mockUser = MOCK_USERS[phone];
    if (!mockUser) {
      return { success: false, error: 'User not found' };
    }

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to save session' };
    }
  };

  const login = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    // Quick login for development - bypass OTP
    const mockUser = MOCK_USERS[phone];
    if (!mockUser) {
      return { success: false, error: 'User not found. Try: 9876543101 (customer), 9876543201 (contractor), 9876543301 (worker), 9876543401 (shopkeeper), 9876543501 (driver), 9876543601 (admin)' };
    }

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to save session' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export mock users for testing
export const getMockUsers = () => MOCK_USERS;
export const getMockUsersByRole = (role: UserRole) =>
  Object.values(MOCK_USERS).filter(u => u.role === role);
