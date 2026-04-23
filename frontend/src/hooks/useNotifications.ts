import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../api/notifications.api';
import { useAppStore } from '../store/app.store';
import { Notification } from '../types';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setUnreadNotifications = useAppStore((s) => s.setUnreadNotifications);

  const computeUnreadCount = (list: Notification[]) =>
    list.filter((n) => !n.is_read).length;

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.list();
      const data = response.data;
      // Handle both paginated and array responses
      const list: Notification[] = Array.isArray(data)
        ? data
        : 'data' in data
        ? (data as { data: Notification[] }).data
        : [];

      setNotifications(list);
      const count = computeUnreadCount(list);
      setUnreadNotifications(count);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notifications';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setUnreadNotifications]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await notificationsApi.markRead(id);
        setNotifications((prev) => {
          const updated = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
          setUnreadNotifications(computeUnreadCount(updated));
          return updated;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mark as read';
        setError(message);
        throw err;
      }
    },
    [setUnreadNotifications]
  );

  const markAllRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadNotifications(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(message);
      throw err;
    }
  }, [setUnreadNotifications]);

  const unreadCount = computeUnreadCount(notifications);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markRead,
    markAllRead,
  };
};
