import { type LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  color: 'blue' | 'red' | 'amber' | 'emerald' | 'orange';
  isCurrency?: boolean;
}

const colorMap = {
  blue: {
    bg: 'hsl(217 91% 60% / 0.1)',
    border: 'hsl(217 91% 60% / 0.2)',
    icon: 'hsl(217 91% 65%)',
    value: 'hsl(217 91% 70%)',
    glow: 'hsl(217 91% 60% / 0.05)',
  },
  red: {
    bg: 'hsl(0 84% 60% / 0.1)',
    border: 'hsl(0 84% 60% / 0.2)',
    icon: 'hsl(0 84% 65%)',
    value: 'hsl(0 84% 70%)',
    glow: 'hsl(0 84% 60% / 0.05)',
  },
  amber: {
    bg: 'hsl(43 96% 56% / 0.1)',
    border: 'hsl(43 96% 56% / 0.2)',
    icon: 'hsl(43 96% 60%)',
    value: 'hsl(43 96% 65%)',
    glow: 'hsl(43 96% 56% / 0.05)',
  },
  emerald: {
    bg: 'hsl(142 76% 46% / 0.1)',
    border: 'hsl(142 76% 46% / 0.2)',
    icon: 'hsl(142 76% 55%)',
    value: 'hsl(142 76% 60%)',
    glow: 'hsl(142 76% 46% / 0.05)',
  },
  orange: {
    bg: 'hsl(25 95% 53% / 0.1)',
    border: 'hsl(25 95% 53% / 0.2)',
    icon: 'hsl(25 95% 60%)',
    value: 'hsl(25 95% 65%)',
    glow: 'hsl(25 95% 53% / 0.05)',
  },
};

export function StatCard({ title, value, subtitle, icon: Icon, color, isCurrency = false }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: `hsl(222 47% 8%)`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 30px ${c.glow}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: c.bg }}
        >
          <Icon className="w-5 h-5" style={{ color: c.icon }} />
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: c.value }}>
        {isCurrency ? formatCurrency(value) : value.toLocaleString('en-IN')}
      </p>
      <p className="text-sm font-medium text-white mb-0.5">{title}</p>
      <p className="text-xs" style={{ color: 'hsl(215 20% 45%)' }}>{subtitle}</p>
    </div>
  );
}
