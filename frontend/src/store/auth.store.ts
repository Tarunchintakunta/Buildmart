import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';
import {
  setAuthToken,
  saveTokenToStorage,
  clearTokenFromStorage,
  loadTokenFromStorage,
} from '../api/client';

const AUTH_USER_KEY = '@buildmart_user';

export interface AuthUser {
  id: string;
  phone: string;
  full_name: string;
  email?: string;
  role: UserRole;
  avatar_url?: string;
  city: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const [token, userJson] = await Promise.all([
        loadTokenFromStorage(),
        AsyncStorage.getItem(AUTH_USER_KEY),
      ]);

      if (token && userJson) {
        const user: AuthUser = JSON.parse(userJson);
        if (user?.role && user?.phone) {
          setAuthToken(token);
          // Verify token is still valid via /auth/me
          try {
            const { authApi } = await import('../api/auth.api');
            const freshUser = await authApi.me();
            const mergedUser: AuthUser = {
              id: freshUser.id,
              phone: freshUser.phone,
              full_name: freshUser.full_name,
              email: freshUser.email,
              role: freshUser.role,
              avatar_url: freshUser.avatar_url,
              city: freshUser.city ?? user.city ?? 'Hyderabad',
            };
            await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(mergedUser));
            set({ user: mergedUser, token, isLoading: false, isInitialized: true });
            return;
          } catch {
            // Token invalid or network error — use cached user but still mark initialized
            set({ user, token, isLoading: false, isInitialized: true });
            return;
          }
        }
      }
    } catch {
      // Corrupted storage — clear it
      await clearTokenFromStorage();
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    }
    set({ user: null, token: null, isLoading: false, isInitialized: true });
  },

  login: async (phone: string) => {
    set({ isLoading: true });
    try {
      const { authApi } = await import('../api/auth.api');
      const { user: rawUser, token } = await authApi.login(phone);

      const user: AuthUser = {
        id: rawUser.id,
        phone: rawUser.phone,
        full_name: rawUser.full_name,
        email: rawUser.email,
        role: rawUser.role,
        avatar_url: rawUser.avatar_url,
        city: rawUser.city ?? 'Hyderabad',
      };

      await saveTokenToStorage(token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      setAuthToken(token);

      set({ user, token, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      const { authApi } = await import('../api/auth.api');
      await authApi.logout();
    } catch {
      // ignore backend errors on logout
    }
    await clearTokenFromStorage();
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    setAuthToken(null);
    set({ user: null, token: null });
  },

  updateUser: (updates: Partial<AuthUser>) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...updates };
      set({ user: updated });
      AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated)).catch(() => {});
    }
  },
}));
