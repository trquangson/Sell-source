import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileCode2, Users, Settings, LogOut, ArrowLeft, Menu, X, Tag } from 'lucide-react';
import { authApi } from '@/features/auth/api/authApi';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Mã nguồn', path: '/admin/sources', icon: <FileCode2 size={20} /> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Mã giảm giá', path: '/admin/coupons', icon: <Tag size={20} /> },
    { name: 'Cài đặt', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-wide"> <span className="text-primary-500">Admin</span></h1>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${location.pathname === item.path
                ? 'bg-primary-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="flex items-center px-3 py-2.5 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-3" />
          Về trang chủ
        </Link>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center px-3 py-2.5 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-600 hover:text-primary-600" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 truncate">
              {menuItems.find(i => i.path === location.pathname)?.name || 'Admin Panel'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              A
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">Administrator</span>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
