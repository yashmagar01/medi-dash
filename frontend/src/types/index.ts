// All shared TypeScript types for Medi-Dash

export interface Medicine {
  id: string;
  name: string;
  batch_number: string;
  expiry_date: string; // ISO date string e.g. "2027-06-01"
  purchase_price: number;
  selling_price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  subtotal: number;
}

export interface BillItem {
  id: string;
  bill_id: string;
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Bill {
  id: string;
  bill_number: string;
  total_amount: number;
  created_at: string;
  bill_items?: BillItem[];
}

export interface DashboardStats {
  total_medicines: number;
  low_stock_count: number;
  expiring_soon: number;
  expired_count: number;
  todays_sales: number;
}

export type ExpiryStatus = 'expired' | 'expiring-soon' | 'safe';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Medicine form values (for react-hook-form)
export interface MedicineFormValues {
  name: string;
  batch_number: string;
  expiry_date: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
}
