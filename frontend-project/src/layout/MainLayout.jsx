import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  let user = {};
  try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch { user = {}; }

  return (
    <div className="flex min-h-screen bg-brand-light">
      <div className="hidden lg:block">
        <Sidebar onLogout={handleLogout} />
      </div>

      {mobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />
          <div className="absolute left-0 top-0 bottom-0 shadow-xl">
            <Sidebar onLogout={() => { handleLogout(); setMobileMenu(false); }} onClose={() => setMobileMenu(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white/95 backdrop-blur-sm border-b border-brand-border px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between lg:justify-end sticky top-0 z-30">
          <button className="lg:hidden text-brand-muted hover:text-brand-text cursor-pointer" onClick={() => setMobileMenu(true)} aria-label="Open navigation menu">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-5">
            <span className="text-sm text-brand-muted font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-brand-muted font-medium hidden sm:block">{user.name || 'User'}</span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="max-w-[1200px] mx-auto" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
