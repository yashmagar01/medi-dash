import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Inventory Management',
  '/billing': 'Billing / POS',
};

export function Header() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'AR Medicals';

  return (
    <header
      className="h-16 flex items-center px-6 border-b shrink-0 no-print"
      style={{
        background: 'hsl(222 47% 7%)',
        borderColor: 'hsl(222 47% 12%)',
      }}
    >
      {/* Mobile spacer for hamburger */}
      <div className="w-8 md:hidden" />
      <h1 className="text-base font-semibold text-white ml-3 md:ml-0">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'hsl(142 76% 46%)' }}
          title="System Online"
        />
        <span className="text-xs" style={{ color: 'hsl(215 20% 55%)' }}>
          System Online
        </span>
      </div>
    </header>
  );
}
