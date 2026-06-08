import { useEffect } from 'react';
import { Package, AlertTriangle, Clock, XCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { useDashboard } from '@/hooks/useDashboard';

export function DashboardPage() {
  const { stats, loading, error, fetchStats } = useDashboard();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Overview</h2>
          <p className="text-sm mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
            Real-time inventory and sales snapshot
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{ border: '1px solid hsl(222 47% 14%)', color: 'hsl(215 20% 55%)' }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: 'hsl(0 84% 60% / 0.1)', border: '1px solid hsl(0 84% 60% / 0.2)', color: 'hsl(0 84% 65%)' }}
        >
          {error}
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl skeleton" />
          ))
        ) : stats ? (
          <>
            <StatCard
              title="Total Medicines"
              value={stats.total_medicines}
              subtitle="Active inventory items"
              icon={Package}
              color="blue"
            />
            <StatCard
              title="Low Stock"
              value={stats.low_stock_count}
              subtitle="≤ 10 units remaining"
              icon={AlertTriangle}
              color="orange"
            />
            <StatCard
              title="Expiring Soon"
              value={stats.expiring_soon}
              subtitle="Within next 90 days"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Expired"
              value={stats.expired_count}
              subtitle="Must be removed"
              icon={XCircle}
              color="red"
            />
            <StatCard
              title="Today's Sales"
              value={stats.todays_sales}
              subtitle="Revenue generated today"
              icon={TrendingUp}
              color="emerald"
              isCurrency
            />
          </>
        ) : null}
      </div>

      {/* Quick tips */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {stats.expired_count > 0 && (
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'hsl(0 84% 60% / 0.08)', border: '1px solid hsl(0 84% 60% / 0.2)' }}
            >
              <XCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(0 84% 60%)' }} />
              <div>
                <p className="text-sm font-medium text-red-400">Action Required</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>
                  {stats.expired_count} medicine{stats.expired_count > 1 ? 's' : ''} have expired. Check inventory and remove them.
                </p>
              </div>
            </div>
          )}
          {stats.low_stock_count > 0 && (
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'hsl(25 95% 53% / 0.08)', border: '1px solid hsl(25 95% 53% / 0.2)' }}
            >
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(25 95% 53%)' }} />
              <div>
                <p className="text-sm font-medium text-orange-400">Low Stock Alert</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>
                  {stats.low_stock_count} medicine{stats.low_stock_count > 1 ? 's are' : ' is'} running low. Restock soon.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
