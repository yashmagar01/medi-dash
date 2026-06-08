import { getExpiryStatus, formatDate } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface ExpiryBadgeProps {
  expiryDate: string;
  showDate?: boolean;
}

export function ExpiryBadge({ expiryDate, showDate = false }: ExpiryBadgeProps) {
  const status = getExpiryStatus(expiryDate);

  const styles = {
    expired: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
      label: 'Expired',
    },
    'expiring-soon': {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      label: 'Expiring Soon',
    },
    safe: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      label: 'Safe',
    },
  }[status];

  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border w-fit',
          styles.bg,
          styles.text,
          styles.border
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-red-400': status === 'expired',
          'bg-amber-400': status === 'expiring-soon',
          'bg-emerald-400': status === 'safe',
        })} />
        {styles.label}
      </span>
      {showDate && (
        <span className="text-xs" style={{ color: 'hsl(215 20% 55%)' }}>
          {formatDate(expiryDate)}
        </span>
      )}
    </div>
  );
}
