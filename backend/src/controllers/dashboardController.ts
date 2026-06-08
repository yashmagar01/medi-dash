import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// GET /dashboard
export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const ninetyDaysLater = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const [
      { count: totalMedicines },
      { count: lowStockCount },
      { count: expiringSoon },
      { count: expiredCount },
      { data: salesData },
    ] = await Promise.all([
      supabase.from('medicines').select('*', { count: 'exact', head: true }),
      supabase.from('medicines').select('*', { count: 'exact', head: true }).lte('quantity', 10),
      supabase
        .from('medicines')
        .select('*', { count: 'exact', head: true })
        .gt('expiry_date', today)
        .lte('expiry_date', ninetyDaysLater),
      supabase.from('medicines').select('*', { count: 'exact', head: true }).lt('expiry_date', today),
      supabase
        .from('bills')
        .select('total_amount')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`),
    ]);

    const todaysSales = (salesData || []).reduce(
      (sum: number, bill: { total_amount: number }) => sum + Number(bill.total_amount),
      0
    );

    res.json({
      data: {
        total_medicines: totalMedicines ?? 0,
        low_stock_count: lowStockCount ?? 0,
        expiring_soon: expiringSoon ?? 0,
        expired_count: expiredCount ?? 0,
        todays_sales: todaysSales,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
