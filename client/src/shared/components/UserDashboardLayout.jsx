import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User, Wallet, ShoppingBag, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const UserDashboardLayout = ({ children, title, subtitle }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/profile', label: t('user_nav.profile'), icon: User },
    { path: '/topup', label: t('user_nav.fund'), icon: Wallet },
    { path: '/history/purchase', label: t('user_nav.history'), icon: ShoppingBag },
    { path: '/forum/my-posts', label: 'Bài đăng diễn đàn', icon: Terminal },
  ];

  return (
    <div className="min-h-screen py-8 md:py-12 bg-background relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none z-0 opacity-50"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header / Title */}
        <div className="mb-6 md:mb-8 border-b border-border pb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-main tracking-tight flex items-center gap-3">
            <Terminal size={28} className="text-primary-600" />
            {title}
          </h1>
          {subtitle && <p className="text-sm md:text-base text-text-muted mt-2 font-medium">{subtitle}</p>}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* Sidebar for Desktop / Tabs for Mobile */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden md:sticky md:top-24 text-sm">
              <nav className="flex md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/profile' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-5 py-4 font-bold transition-colors whitespace-nowrap md:whitespace-normal border-b-2 md:border-b-0 md:border-l-4
                        ${isActive 
                          ? 'text-primary-600 bg-primary-50 border-primary-600 md:border-b-transparent shadow-[inset_4px_0_0_0_rgba(8,145,178,1)]' 
                          : 'text-text-muted hover:bg-surface-hover border-transparent hover:text-text-main'
                        }
                      `}
                    >
                      <item.icon size={16} className={isActive ? 'text-primary-600' : 'text-text-muted'} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
