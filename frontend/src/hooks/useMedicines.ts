import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Medicine, MedicineFormValues } from '@/types';
import * as api from '@/api/medicines';

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicines = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMedicines(search);
      setMedicines(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch medicines';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMedicine = useCallback(async (values: MedicineFormValues): Promise<boolean> => {
    try {
      const created = await api.createMedicine(values);
      setMedicines((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success(`${created.name} added successfully`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add medicine';
      toast.error(msg);
      return false;
    }
  }, []);

  const editMedicine = useCallback(async (id: string, values: MedicineFormValues): Promise<boolean> => {
    try {
      const updated = await api.updateMedicine(id, values);
      setMedicines((prev) => prev.map((m) => (m.id === id ? updated : m)));
      toast.success(`${updated.name} updated successfully`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update medicine';
      toast.error(msg);
      return false;
    }
  }, []);

  const removeMedicine = useCallback(async (id: string, name: string): Promise<boolean> => {
    try {
      await api.deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
      toast.success(`${name} deleted successfully`);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete medicine';
      toast.error(msg);
      return false;
    }
  }, []);

  return {
    medicines,
    loading,
    error,
    fetchMedicines,
    addMedicine,
    editMedicine,
    removeMedicine,
  };
}
