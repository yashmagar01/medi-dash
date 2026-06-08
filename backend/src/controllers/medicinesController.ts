import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// GET /medicines?search=query
export const getMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const search = (req.query.search as string) || '';

    let query = supabase
      .from('medicines')
      .select('*')
      .order('name', { ascending: true });

    if (search.trim()) {
      query = query.ilike('name', `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
};

// POST /medicines
export const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, batch_number, expiry_date, purchase_price, selling_price, quantity } = req.body;

    if (!name || !batch_number || !expiry_date || purchase_price == null || selling_price == null || quantity == null) {
      res.status(400).json({ error: 'All fields are required', data: null });
      return;
    }

    const { data, error } = await supabase
      .from('medicines')
      .insert([{ name, batch_number, expiry_date, purchase_price, selling_price, quantity }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({ data, error: null });
  } catch (err) {
    next(err);
  }
};

// PUT /medicines/:id
export const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, batch_number, expiry_date, purchase_price, selling_price, quantity } = req.body;

    const { data, error } = await supabase
      .from('medicines')
      .update({ name, batch_number, expiry_date, purchase_price, selling_price, quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) {
      res.status(404).json({ error: 'Medicine not found', data: null });
      return;
    }

    res.json({ data, error: null });
  } catch (err) {
    next(err);
  }
};

// DELETE /medicines/:id
export const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    res.json({ data: { message: 'Medicine deleted successfully' }, error: null });
  } catch (err) {
    next(err);
  }
};
