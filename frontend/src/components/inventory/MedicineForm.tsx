import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Medicine } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  batch_number: z.string().min(1, 'Batch number is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  purchase_price: z.coerce.number().min(0, 'Must be ≥ 0'),
  selling_price: z.coerce.number().min(0, 'Must be ≥ 0'),
  quantity: z.coerce.number().int().min(0, 'Must be ≥ 0'),
});

type FormValues = z.infer<typeof schema>;

interface MedicineFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<boolean>;
  medicine?: Medicine | null;
  mode: 'add' | 'edit';
}

export function MedicineForm({ open, onClose, onSubmit, medicine, mode }: MedicineFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({ resolver: zodResolver(schema) as any });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && medicine) {
        reset({
          name: medicine.name,
          batch_number: medicine.batch_number,
          expiry_date: medicine.expiry_date,
          purchase_price: medicine.purchase_price,
          selling_price: medicine.selling_price,
          quantity: medicine.quantity,
        });
      } else {
        reset({ name: '', batch_number: '', expiry_date: '', purchase_price: 0, selling_price: 0, quantity: 0 });
      }
    }
  }, [open, mode, medicine, reset]);

  const onFormSubmit: SubmitHandler<FormValues> = async (values) => {
    const success = await onSubmit(values);
    if (success) onClose();
  };

  if (!open) return null;

  const inputClass =
    'w-full px-3 py-2 rounded-lg text-sm text-white outline-none transition-all focus:ring-1 focus:ring-cyan-500';
  const inputStyle = {
    background: 'hsl(222 47% 10%)',
    border: '1px solid hsl(222 47% 16%)',
  };
  const labelClass = 'block text-xs font-medium mb-1.5';
  const labelStyle = { color: 'hsl(215 20% 65%)' };
  const errorClass = 'text-xs text-red-400 mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in"
        style={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 47% 14%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'hsl(222 47% 14%)' }}>
          <div>
            <h2 className="text-base font-semibold text-white">
              {mode === 'add' ? 'Add New Medicine' : 'Edit Medicine'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(215 20% 55%)' }}>
              {mode === 'add' ? 'Fill in the details below' : 'Update medicine information'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass} style={labelStyle}>Medicine Name *</label>
              <input {...register('name')} className={inputClass} style={inputStyle} placeholder="e.g. Paracetamol 500mg" />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Batch Number *</label>
              <input {...register('batch_number')} className={inputClass} style={inputStyle} placeholder="e.g. B001" />
              {errors.batch_number && <p className={errorClass}>{errors.batch_number.message}</p>}
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Expiry Date *</label>
              <input {...register('expiry_date')} type="date" className={inputClass} style={inputStyle} />
              {errors.expiry_date && <p className={errorClass}>{errors.expiry_date.message}</p>}
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Purchase Price (₹) *</label>
              <input {...register('purchase_price')} type="number" step="0.01" className={inputClass} style={inputStyle} placeholder="0.00" />
              {errors.purchase_price && <p className={errorClass}>{errors.purchase_price.message}</p>}
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Selling Price (₹) *</label>
              <input {...register('selling_price')} type="number" step="0.01" className={inputClass} style={inputStyle} placeholder="0.00" />
              {errors.selling_price && <p className={errorClass}>{errors.selling_price.message}</p>}
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Quantity *</label>
              <input {...register('quantity')} type="number" className={inputClass} style={inputStyle} placeholder="0" />
              {errors.quantity && <p className={errorClass}>{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              style={{ border: '1px solid hsl(222 47% 16%)', color: 'hsl(215 20% 65%)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
              style={{ background: 'hsl(199 89% 48%)' }}
            >
              {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Medicine' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
