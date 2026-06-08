import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartTableProps {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartTable({ cart, onUpdateQty, onRemove }: CartTableProps) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'hsl(222 47% 10%)' }}
        >
          <ShoppingCart className="w-6 h-6" style={{ color: 'hsl(215 20% 40%)' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: 'hsl(215 20% 50%)' }}>Cart is empty</p>
        <p className="text-xs" style={{ color: 'hsl(215 20% 35%)' }}>Search and add medicines from the left panel</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {['Medicine', 'Price', 'Quantity', 'Subtotal', ''].map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-left"
                style={{ color: 'hsl(215 20% 50%)', borderBottom: '1px solid hsl(222 47% 13%)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr
              key={item.medicine.id}
              className="transition-colors"
              style={{ borderBottom: '1px solid hsl(222 47% 11%)' }}
            >
              <td className="px-3 py-3">
                <p className="text-sm font-medium text-white">{item.medicine.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 45%)' }}>
                  Max: {item.medicine.quantity} units
                </p>
              </td>
              <td className="px-3 py-3 text-sm" style={{ color: 'hsl(215 20% 65%)' }}>
                {formatCurrency(item.medicine.selling_price)}
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateQty(item.medicine.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
                    style={{ border: '1px solid hsl(222 47% 16%)', color: 'hsl(215 20% 55%)' }}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQty(item.medicine.id, item.quantity + 1)}
                    disabled={item.quantity >= item.medicine.quantity}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/5 disabled:opacity-30"
                    style={{ border: '1px solid hsl(222 47% 16%)', color: 'hsl(215 20% 55%)' }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </td>
              <td className="px-3 py-3">
                <span className="text-sm font-semibold" style={{ color: 'hsl(199 89% 55%)' }}>
                  {formatCurrency(item.subtotal)}
                </span>
              </td>
              <td className="px-3 py-3">
                <button
                  onClick={() => onRemove(item.medicine.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 text-red-400"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
