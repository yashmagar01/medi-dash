import { ShoppingBag, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  itemCount: number;
  total: number;
  creating: boolean;
  onCreateBill: () => void;
}

export function CartSummary({ itemCount, total, creating, onCreateBill }: CartSummaryProps) {
  return (
    <div
      className="rounded-xl p-4 mt-4"
      style={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 47% 14%)' }}
    >
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span style={{ color: 'hsl(215 20% 55%)' }}>Items in cart</span>
          <span className="text-white font-medium">{itemCount}</span>
        </div>
        <div className="h-px" style={{ background: 'hsl(222 47% 13%)' }} />
        <div className="flex justify-between">
          <span className="text-sm font-medium text-white">Grand Total</span>
          <span className="text-lg font-bold" style={{ color: 'hsl(142 76% 55%)' }}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <button
        onClick={onCreateBill}
        disabled={itemCount === 0 || creating}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(217 91% 60%))' }}
      >
        {creating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Bill...
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            Create Bill
          </>
        )}
      </button>
    </div>
  );
}
