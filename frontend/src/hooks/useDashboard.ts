import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { DashboardStats } from '@/types';
import { getDashboardStats } from '@/api/dashboard';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
}
