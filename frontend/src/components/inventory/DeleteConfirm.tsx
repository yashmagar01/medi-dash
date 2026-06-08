interface DeleteConfirmProps {
  open: boolean;
  medicineName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirm({ open, medicineName, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-fade-in"
        style={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 47% 14%)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'hsl(0 84% 60% / 0.15)' }}
        >
          <span className="text-xl">🗑️</span>
        </div>
        <h3 className="text-base font-semibold text-white text-center mb-2">Delete Medicine</h3>
        <p className="text-sm text-center mb-6" style={{ color: 'hsl(215 20% 55%)' }}>
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">"{medicineName}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{ border: '1px solid hsl(222 47% 16%)', color: 'hsl(215 20% 65%)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
            style={{ background: 'hsl(0 84% 60%)' }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
