import axios from 'axios';
import { getApiUrl, getAuthHeaders } from '@/lib/utils';
import type { Medicine, MedicineFormValues } from '@/types';

const api = () => axios.create({ baseURL: getApiUrl(), headers: getAuthHeaders() });

export async function getMedicines(search?: string): Promise<Medicine[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const { data } = await api().get(`/medicines${params}`);
  return data.data || [];
}

export async function createMedicine(values: MedicineFormValues): Promise<Medicine> {
  const { data } = await api().post('/medicines', values);
  return data.data;
}

export async function updateMedicine(id: string, values: MedicineFormValues): Promise<Medicine> {
  const { data } = await api().put(`/medicines/${id}`, values);
  return data.data;
}

export async function deleteMedicine(id: string): Promise<void> {
  await api().delete(`/medicines/${id}`);
}
