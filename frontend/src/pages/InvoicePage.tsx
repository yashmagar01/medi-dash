import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { getBillById } from '@/api/billing';
import type { Bill } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export function InvoicePage() {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!billId) return;
    setLoading(true);
    getBillById(billId)
      .then(setBill)
      .catch((err) => setError(err.message || 'Failed to load invoice'))
      .finally(() => setLoading(false));
  }, [billId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(199 89% 48%)' }} />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400">{error || 'Invoice not found'}</p>
        <button
          onClick={() => navigate('/billing')}
          className="text-sm px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: 'hsl(199 89% 55%)', border: '1px solid hsl(222 47% 14%)' }}
        >
          ← Back to Billing
        </button>
      </div>
    );
  }

  const items = bill.bill_items || [];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Actions — hidden on print */}
      <div className="flex items-center justify-between mb-6 no-print">
        <button
          onClick={() => navigate('/billing')}
          className="flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ color: 'hsl(215 20% 55%)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Billing
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'hsl(199 89% 48%)' }}
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Card */}
      <div
        className="rounded-2xl overflow-hidden invoice-print-area"
        style={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 47% 14%)' }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center"
          style={{ background: 'linear-gradient(135deg, hsl(199 89% 48% / 0.15), hsl(217 91% 60% / 0.1))' }}
        >
          <h1 className="text-2xl font-bold text-white">AR Medicals</h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 55%)' }}>
            Medical Billing System
          </p>
          <div
            className="h-px mx-auto my-4 w-24"
            style={{ background: 'hsl(199 89% 48% / 0.4)' }}
          />
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <p style={{ color: 'hsl(215 20% 50%)' }}>Bill Number</p>
              <p className="font-semibold text-white mt-0.5">{bill.bill_number}</p>
            </div>
            <div>
              <p style={{ color: 'hsl(215 20% 50%)' }}>Date & Time</p>
              <p className="font-semibold text-white mt-0.5">{formatDateTime(bill.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 py-6">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(222 47% 14%)' }}>
                {['#', 'Medicine', 'Qty', 'Unit Price', 'Subtotal'].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-xs font-medium uppercase tracking-wider text-left"
                    style={{ color: 'hsl(215 20% 50%)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid hsl(222 47% 11%)' }}
                >
                  <td className="py-3 text-sm" style={{ color: 'hsl(215 20% 45%)' }}>
                    {i + 1}
                  </td>
                  <td className="py-3 text-sm font-medium text-white pr-4">
                    {item.medicine_name}
                  </td>
                  <td className="py-3 text-sm text-white">{item.quantity}</td>
                  <td className="py-3 text-sm" style={{ color: 'hsl(215 20% 65%)' }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 text-sm font-semibold" style={{ color: 'hsl(199 89% 55%)' }}>
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div
          className="px-8 py-5 flex items-center justify-between"
          style={{ background: 'hsl(222 47% 10%)', borderTop: '1px solid hsl(222 47% 14%)' }}
        >
          <div>
            <p className="text-sm" style={{ color: 'hsl(215 20% 50%)' }}>
              {items.length} item{items.length !== 1 ? 's' : ''} sold
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-1" style={{ color: 'hsl(215 20% 50%)' }}>Grand Total</p>
            <p className="text-3xl font-bold" style={{ color: 'hsl(142 76% 55%)' }}>
              {formatCurrency(bill.total_amount)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4 text-center"
          style={{ borderTop: '1px solid hsl(222 47% 14%)' }}
        >
          <p className="text-xs" style={{ color: 'hsl(215 20% 40%)' }}>
            Thank you for choosing AR Medicals — Your health is our priority.
          </p>
        </div>
      </div>
    </div>
  );
}
