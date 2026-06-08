import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, PackageX } from 'lucide-react';
import type { Medicine, MedicineFormValues } from '@/types';
import { ExpiryBadge } from './ExpiryBadge';
import { MedicineForm } from './MedicineForm';
import { DeleteConfirm } from './DeleteConfirm';
import { formatCurrency, formatDate } from '@/lib/utils';

interface MedicineTableProps {
  medicines: Medicine[];
  loading: boolean;
  onAdd: (values: MedicineFormValues) => Promise<boolean>;
  onEdit: (id: string, values: MedicineFormValues) => Promise<boolean>;
  onDelete: (id: string, name: string) => Promise<boolean>;
  onSearch: (q: string) => void;
}

export function MedicineTable({ medicines, loading, onAdd, onEdit, onDelete, onSearch }: MedicineTableProps) {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => onSearch(search), 300);
    return () => clearTimeout(t);
  }, [search, onSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await onDelete(deleteTarget.id, deleteTarget.name);
    setDeleting(false);
    if (ok) setDeleteTarget(null);
  };

  const cellClass = 'px-4 py-3 text-sm';
  const headClass = 'px-4 py-3 text-xs font-medium uppercase tracking-wider text-left';

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'hsl(215 20% 55%)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
            style={{ background: 'hsl(222 47% 10%)', border: '1px solid hsl(222 47% 16%)' }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 shrink-0"
          style={{ background: 'hsl(199 89% 48%)' }}
        >
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid hsl(222 47% 14%)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'hsl(222 47% 9%)' }}>
              <tr>
                {['Medicine Name', 'Batch No.', 'Expiry Date', 'Quantity', 'Purchase', 'Selling', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={headClass} style={{ color: 'hsl(215 20% 55%)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderTop: '1px solid hsl(222 47% 11%)' }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className={cellClass}>
                        <div className="skeleton h-4 w-24 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : medicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <PackageX className="w-10 h-10" style={{ color: 'hsl(215 20% 45%)' }} />
                      <p className="text-sm font-medium" style={{ color: 'hsl(215 20% 55%)' }}>
                        No medicines found
                      </p>
                      <p className="text-xs" style={{ color: 'hsl(215 20% 40%)' }}>
                        {search ? 'Try a different search term' : 'Add your first medicine to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                medicines.map((med) => (
                  <tr
                    key={med.id}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderTop: '1px solid hsl(222 47% 11%)' }}
                  >
                    <td className={cellClass}>
                      <span className="font-medium text-white">{med.name}</span>
                    </td>
                    <td className={cellClass}>
                      <code
                        className="px-2 py-0.5 rounded text-xs"
                        style={{ background: 'hsl(222 47% 12%)', color: 'hsl(199 89% 60%)' }}
                      >
                        {med.batch_number}
                      </code>
                    </td>
                    <td className={cellClass}>
                      <span className="text-sm" style={{ color: 'hsl(215 20% 70%)' }}>
                        {formatDate(med.expiry_date)}
                      </span>
                    </td>
                    <td className={cellClass}>
                      <span
                        className={`font-semibold text-sm ${med.quantity <= 10 ? 'text-red-400' : 'text-white'}`}
                      >
                        {med.quantity}
                        {med.quantity <= 10 && (
                          <span className="ml-1 text-xs text-red-400">⚠</span>
                        )}
                      </span>
                    </td>
                    <td className={cellClass} style={{ color: 'hsl(215 20% 65%)' }}>
                      {formatCurrency(med.purchase_price)}
                    </td>
                    <td className={cellClass}>
                      <span className="font-medium text-white">{formatCurrency(med.selling_price)}</span>
                    </td>
                    <td className={cellClass}>
                      <ExpiryBadge expiryDate={med.expiry_date} />
                    </td>
                    <td className={cellClass}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditTarget(med)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-cyan-500/10 text-cyan-400"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(med)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && medicines.length > 0 && (
          <div
            className="px-4 py-2.5 text-xs border-t"
            style={{ borderColor: 'hsl(222 47% 11%)', color: 'hsl(215 20% 45%)', background: 'hsl(222 47% 7%)' }}
          >
            Showing {medicines.length} medicine{medicines.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Modals */}
      <MedicineForm
        open={showAdd}
        mode="add"
        onClose={() => setShowAdd(false)}
        onSubmit={onAdd}
      />
      <MedicineForm
        open={!!editTarget}
        mode="edit"
        medicine={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={(vals) => onEdit(editTarget!.id, vals)}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        medicineName={deleteTarget?.name || ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
