import { useState, useEffect, useCallback } from 'react';
import { workersApi } from '../api/workers.api';
import { WorkerWithProfile } from '../types';

export const useWorkers = (params?: { skill?: string; search?: string }) => {
  const [workers, setWorkers] = useState<WorkerWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await workersApi.getWorkers({ ...params, limit: 50 });
      setWorkers(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load workers');
    } finally {
      setIsLoading(false);
    }
  }, [params?.skill, params?.search]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  return { workers, isLoading, error, refresh: fetchWorkers };
};
