import { ExpiryStatus } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function getApiUrl(): string {
  return API_URL;
}

export function getAuthHeaders(): Record<string, string> {
  let token: string | null = null;
  try {
    token = localStorage.getItem('sb-access-token');
  } catch (err) {
    console.warn('Local storage access blocked');
  }
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const ninetyDays = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  if (expiry < today) return 'expired';
  if (expiry <= ninetyDays) return 'expiring-soon';
  return 'safe';
}

export function formatCurrency(amount: number): string {
  return `₹${Number(amount).toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
