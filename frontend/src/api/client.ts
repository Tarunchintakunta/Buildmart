import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = '@buildmart_token';

let authToken: string | null = null;
let logoutCallback: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

export const loadTokenFromStorage = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    authToken = token;
    return token;
  } catch {
    return null;
  }
};

export const saveTokenToStorage = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    authToken = token;
  } catch {}
};

export const clearTokenFromStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    authToken = null;
  } catch {}
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired — trigger logout
      if (logoutCallback) {
        logoutCallback();
      }
    }

    const message =
      (error.response?.data as { error?: string; message?: string })?.error ||
      (error.response?.data as { error?: string; message?: string })?.message ||
      error.message ||
      'Network error';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
