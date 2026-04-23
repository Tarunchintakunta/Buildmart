import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../api/orders.api';
import { OrderWithDetails } from '../types';

export const useOrders = (role: 'customer' | 'shopkeeper' | 'driver' = 'customer') => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const currentPage = reset ? 1 : page;
      let result;
      if (role === 'shopkeeper') {
        result = await ordersApi.getShopOrders({ page: currentPage, limit: 20 });
      } else if (role === 'driver') {
        result = await ordersApi.getMyDeliveries({ page: currentPage, limit: 20 });
      } else {
        result = await ordersApi.getMyOrders({ page: currentPage, limit: 20 });
      }
      setOrders(reset ? result.data : (prev) => [...prev, ...result.data]);
      setHasMore(currentPage < result.total_pages);
      setPage(reset ? 2 : (prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page, role]);

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const refresh = () => fetchOrders(true);
  const loadMore = () => { if (hasMore) fetchOrders(); };

  return { orders, isLoading, error, refresh, loadMore, hasMore };
};
