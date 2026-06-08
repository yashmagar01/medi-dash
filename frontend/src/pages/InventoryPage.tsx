import { useEffect } from 'react';
import { MedicineTable } from '@/components/inventory/MedicineTable';
import { useMedicines } from '@/hooks/useMedicines';

export function InventoryPage() {
  const { medicines, loading, fetchMedicines, addMedicine, editMedicine, removeMedicine } = useMedicines();

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Medicine Inventory</h2>
        <p className="text-sm mt-0.5" style={{ color: 'hsl(215 20% 50%)' }}>
          Manage your medicine stock, expiry dates and prices
        </p>
      </div>

      <MedicineTable
        medicines={medicines}
        loading={loading}
        onAdd={addMedicine}
        onEdit={editMedicine}
        onDelete={removeMedicine}
        onSearch={fetchMedicines}
      />
    </div>
  );
}
