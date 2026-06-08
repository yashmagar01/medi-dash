import axios from 'axios';
import { getApiUrl, getAuthHeaders } from '@/lib/utils';
import type { Bill, CartItem } from '@/types';

const api = () => axios.create({ baseURL: getApiUrl(), headers: getAuthHeaders() });

export async function createBill(cartItems: CartItem[]): Promise<Bill> {
  const items = cartItems.map((ci) => ({
    medicine_id: ci.medicine.id,
    quantity: ci.quantity,
  }));
  const { data } = await api().post('/billing/create', { items });
  return data.data;
}

export async function getBills(): Promise<Bill[]> {
  const { data } = await api().get('/bills');
  return data.data || [];
}

export async function getBillById(id: string): Promise<Bill> {
  const { data } = await api().get(`/bills/${id}`);
  return data.data;
}
