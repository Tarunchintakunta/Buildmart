import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { setLogoutCallback } from '../api/client';

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isInitialized,
    login,
    logout,
    initialize,
    updateUser,
  } = useAuthStore();

  // Register logout callback in api/client so 401s auto-logout
  useEffect(() => {
    setLogoutCallback(() => {
      useAuthStore.getState().logout();
    });
  }, []);

  return {
    user,
    token,
    isLoading,
    isInitialized,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    initialize,
    updateUser,
  };
};
