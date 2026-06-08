import { useNavigate } from 'react-router-dom';
import { MedicineSearch } from '@/components/billing/MedicineSearch';
import { CartTable } from '@/components/billing/CartTable';
import { CartSummary } from '@/components/billing/CartSummary';
import { useBilling } from '@/hooks/useBilling';

export function BillingPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, creating, addToCart, removeFromCart, updateQuantity, submitBill } = useBilling();

  const handleCreateBill = async () => {
    const bill = await submitBill();
    if (bill) {
      navigate(`/invoice/${bill.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Billing / POS</h2>
        <p className="text-sm mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
          Search medicines, build your cart and generate a bill
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Left — Medicine Search */}
        <div
          className="lg:w-80 shrink-0 rounded-2xl p-4 flex flex-col"
          style={{
            background: 'hsl(222 47% 8%)',
            border: '1px solid hsl(222 47% 14%)',
            minHeight: '500px',
          }}
        >
          <MedicineSearch onAddToCart={addToCart} />
        </div>

        {/* Right — Cart */}
        <div
          className="flex-1 rounded-2xl p-4 flex flex-col"
          style={{
            background: 'hsl(222 47% 8%)',
            border: '1px solid hsl(222 47% 14%)',
            minHeight: '500px',
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-3">
            Cart
            {cartCount > 0 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'hsl(199 89% 48% / 0.15)', color: 'hsl(199 89% 55%)' }}
              >
                {cartCount} item{cartCount !== 1 ? 's' : ''}
              </span>
            )}
          </h3>

          <div className="flex-1">
            <CartTable
              cart={cart}
              onUpdateQty={updateQuantity}
              onRemove={removeFromCart}
            />
          </div>

          <CartSummary
            itemCount={cartCount}
            total={cartTotal}
            creating={creating}
            onCreateBill={handleCreateBill}
          />
        </div>
      </div>
    </div>
  );
}
