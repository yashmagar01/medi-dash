import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Pill, Receipt, LogOut, Stethoscope, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Pill },
  { to: '/billing', label: 'Billing', icon: Receipt },
];

export function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'hsl(222 47% 6%)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b" style={{ borderColor: 'hsl(222 47% 11%)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'hsl(199 89% 48%)' }}>
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">AR Medicals</p>
          <p className="text-xs" style={{ color: 'hsl(215 20% 55%)' }}>Billing System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-white'
                  : 'hover:bg-white/5'
              )
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'hsl(199 89% 48% / 0.15)', color: 'hsl(199 89% 60%)' }
                : { color: 'hsl(215 20% 65%)' }
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'hsl(199 89% 48%)' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t pt-4" style={{ borderColor: 'hsl(222 47% 11%)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all hover:bg-red-500/10"
          style={{ color: 'hsl(215 20% 55%)' }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg no-print"
        style={{ background: 'hsl(222 47% 8%)', border: '1px solid hsl(222 47% 14%)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex no-print">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 h-full z-50 animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
