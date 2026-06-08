import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stethoscope, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: LoginForm) => {
    setServerError(null);
    const { error } = await login(values.email, values.password);
    if (error) {
      setServerError(error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'hsl(222 47% 5%)' }}
    >
      {/* Background gradient orbs */}
      <div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(199 89% 48% / 0.05)' }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'hsl(217 91% 60% / 0.05)' }}
      />

      <div
        className="w-full max-w-md rounded-2xl p-8 relative animate-fade-in"
        style={{
          background: 'hsl(222 47% 8%)',
          border: '1px solid hsl(222 47% 14%)',
          boxShadow: '0 25px 50px hsl(222 47% 3% / 0.8)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(217 91% 60%))' }}
          >
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AR Medicals</h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(215 20% 50%)' }}>
            Medical Billing System
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 65%)' }}>
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="owner@armedicals.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              style={{ background: 'hsl(222 47% 11%)', border: '1px solid hsl(222 47% 17%)' }}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'hsl(215 20% 65%)' }}>
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                style={{ background: 'hsl(222 47% 11%)', border: '1px solid hsl(222 47% 17%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'hsl(215 20% 45%)' }}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div
              className="px-3 py-2.5 rounded-lg text-sm"
              style={{ background: 'hsl(0 84% 60% / 0.1)', border: '1px solid hsl(0 84% 60% / 0.2)', color: 'hsl(0 84% 65%)' }}
            >
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 mt-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(217 91% 60%))' }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: 'hsl(215 20% 35%)' }}>
          AR Medicals — Secure Medical Billing Platform
        </p>
      </div>
    </div>
  );
}
