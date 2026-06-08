import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Medicine, CartItem, Bill } from '@/types';
import { createBill as apiCreateBill } from '@/api/billing';

export function useBilling() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [creating, setCreating] = useState(false);

  const addToCart = useCallback((medicine: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        // Increase quantity if not at stock limit
        if (existing.quantity >= medicine.quantity) {
          toast.warning(`Only ${medicine.quantity} units available`);
          return prev;
        }
        return prev.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * medicine.selling_price }
            : item
        );
      }
      if (medicine.quantity === 0) {
        toast.error('Out of stock');
        return prev;
      }
      return [...prev, { medicine, quantity: 1, subtotal: medicine.selling_price }];
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  }, []);

  const updateQuantity = useCallback((medicineId: string, newQty: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.medicine.id !== medicineId) return item;
          const qty = Math.max(1, Math.min(newQty, item.medicine.quantity));
          return { ...item, quantity: qty, subtotal: qty * item.medicine.selling_price };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const submitBill = useCallback(async (): Promise<Bill | null> => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return null;
    }
    setCreating(true);
    try {
      const bill = await apiCreateBill(cart);
      setCart([]);
      toast.success(`Bill ${bill.bill_number} created successfully!`);
      return bill;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create bill';
      toast.error(msg);
      return null;
    } finally {
      setCreating(false);
    }
  }, [cart]);

  return {
    cart,
    cartTotal,
    cartCount,
    creating,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    submitBill,
  };
}
