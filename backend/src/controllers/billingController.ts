import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

interface CartItem {
  medicine_id: string;
  quantity: number;
}

// Generate bill number: BILL-YYYYMMDD-NNN
async function generateBillNumber(): Promise<string> {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const prefix = `BILL-${today}-`;

  const { data } = await supabase
    .from('bills')
    .select('bill_number')
    .ilike('bill_number', `${prefix}%`)
    .order('bill_number', { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    return `${prefix}001`;
  }

  const lastNum = parseInt(data[0].bill_number.split('-').pop() || '0', 10);
  return `${prefix}${String(lastNum + 1).padStart(3, '0')}`;
}

// POST /billing/create
export const createBill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items }: { items: CartItem[] } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty', data: null });
      return;
    }

    // Fetch all medicines needed
    const medicineIds = items.map((i) => i.medicine_id);
    const { data: medicines, error: medError } = await supabase
      .from('medicines')
      .select('id, name, selling_price, quantity')
      .in('id', medicineIds);

    if (medError) throw new Error(medError.message);
    if (!medicines || medicines.length === 0) {
      res.status(404).json({ error: 'Medicines not found', data: null });
      return;
    }

    // Validate stock availability
    for (const item of items) {
      const med = medicines.find((m) => m.id === item.medicine_id);
      if (!med) {
        res.status(404).json({ error: `Medicine ${item.medicine_id} not found`, data: null });
        return;
      }
      if (med.quantity < item.quantity) {
        res.status(400).json({
          error: `Insufficient stock for ${med.name}. Available: ${med.quantity}`,
          data: null,
        });
        return;
      }
    }

    // Calculate total
    let totalAmount = 0;
    const billItemsToInsert: {
      medicine_id: string;
      medicine_name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const med = medicines.find((m) => m.id === item.medicine_id)!;
      const subtotal = Number(med.selling_price) * item.quantity;
      totalAmount += subtotal;
      billItemsToInsert.push({
        medicine_id: item.medicine_id,
        medicine_name: med.name,
        quantity: item.quantity,
        price: Number(med.selling_price),
        subtotal,
      });
    }

    // Generate bill number
    const billNumber = await generateBillNumber();

    // Insert bill
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert([{ bill_number: billNumber, total_amount: totalAmount }])
      .select()
      .single();

    if (billError) throw new Error(billError.message);

    // Insert bill items
    const itemsWithBillId = billItemsToInsert.map((item) => ({
      ...item,
      bill_id: bill.id,
    }));

    const { error: itemsError } = await supabase.from('bill_items').insert(itemsWithBillId);

    if (itemsError) throw new Error(itemsError.message);

    // Deduct stock for each medicine
    for (const item of items) {
      const med = medicines.find((m) => m.id === item.medicine_id)!;
      const { error: stockError } = await supabase
        .from('medicines')
        .update({ quantity: med.quantity - item.quantity })
        .eq('id', item.medicine_id);

      if (stockError) throw new Error(stockError.message);
    }

    // Return full bill
    const { data: fullBill, error: fullBillError } = await supabase
      .from('bills')
      .select(`*, bill_items(*)`)
      .eq('id', bill.id)
      .single();

    if (fullBillError) throw new Error(fullBillError.message);

    res.status(201).json({ data: fullBill, error: null });
  } catch (err) {
    next(err);
  }
};

// GET /bills
export const getBills = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
};

// GET /bills/:id
export const getBillById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bills')
      .select(`*, bill_items(*)`)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) {
      res.status(404).json({ error: 'Bill not found', data: null });
      return;
    }

    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
};
