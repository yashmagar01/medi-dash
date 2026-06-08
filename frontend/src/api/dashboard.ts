import axios from 'axios';
import { getApiUrl, getAuthHeaders } from '@/lib/utils';
import type { DashboardStats } from '@/types';

const api = () => axios.create({ baseURL: getApiUrl(), headers: getAuthHeaders() });

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api().get('/dashboard');
  return data.data;
}
