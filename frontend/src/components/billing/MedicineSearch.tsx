import { useState, useCallback } from 'react';
import { Search, Plus, ShoppingCart } from 'lucide-react';
import type { Medicine } from '@/types';
import { getMedicines } from '@/api/medicines';
import { getExpiryStatus, formatCurrency } from '@/lib/utils';
import { ExpiryBadge } from '@/components/inventory/ExpiryBadge';

interface MedicineSearchProps {
  onAddToCart: (medicine: Medicine) => void;
}

export function MedicineSearch({ onAddToCart }: MedicineSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getMedicines(q);
      setResults(data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const isDisabled = (med: Medicine) => {
    return med.quantity === 0 || getExpiryStatus(med.expiry_date) === 'expired';
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Search className="w-4 h-4" style={{ color: 'hsl(199 89% 48%)' }} />
          Search Medicine
        </h3>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'hsl(215 20% 45%)' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Type medicine name..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            style={{ background: 'hsl(222 47% 10%)', border: '1px solid hsl(222 47% 16%)' }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl skeleton" />
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10">
            <Search className="w-8 h-8" style={{ color: 'hsl(215 20% 35%)' }} />
            <p className="text-sm" style={{ color: 'hsl(215 20% 45%)' }}>No medicines found</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="flex flex-col items-center gap-2 py-10">
            <ShoppingCart className="w-8 h-8" style={{ color: 'hsl(215 20% 35%)' }} />
            <p className="text-sm" style={{ color: 'hsl(215 20% 45%)' }}>Search to find medicines</p>
          </div>
        )}

        {!loading && results.map((med) => {
          const disabled = isDisabled(med);
          return (
            <div
              key={med.id}
              className={`rounded-xl p-4 transition-all ${disabled ? 'opacity-40' : 'hover:border-cyan-500/40 cursor-pointer'}`}
              style={{
                background: 'hsl(222 47% 9%)',
                border: '1px solid hsl(222 47% 14%)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{med.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: 'hsl(215 20% 50%)' }}>
                      Qty: <span className={med.quantity <= 10 ? 'text-red-400 font-medium' : 'text-white'}>{med.quantity}</span>
                    </span>
                    <span className="text-xs" style={{ color: 'hsl(215 20% 30%)' }}>•</span>
                    <span className="text-xs font-medium" style={{ color: 'hsl(199 89% 55%)' }}>
                      {formatCurrency(med.selling_price)}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ExpiryBadge expiryDate={med.expiry_date} />
                  </div>
                </div>
                <button
                  onClick={() => !disabled && onAddToCart(med)}
                  disabled={disabled}
                  className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-all disabled:cursor-not-allowed"
                  style={disabled
                    ? { background: 'hsl(222 47% 12%)', color: 'hsl(215 20% 35%)' }
                    : { background: 'hsl(199 89% 48% / 0.15)', color: 'hsl(199 89% 55%)' }
                  }
                  title={disabled ? 'Out of stock or expired' : 'Add to cart'}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
