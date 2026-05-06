import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LayoutDashboard, LogOut, Search, Menu, X } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.user);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
    setIsMobileMenuOpen(false); // Đóng menu mobile khi chuyển trang
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = siteConfig.navLinks;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight flex-shrink-0">{siteConfig.name}</Link>
          
          <nav className="hidden md:flex gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-base font-semibold transition-colors ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-[280px] mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              placeholder="Tìm kiếm mã nguồn..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white border focus:border-primary-500 rounded-full text-sm outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </form>
        </div>
        
        {/* User Actions & Mobile Toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  <LayoutDashboard size={18} /> Admin Panel
                </Link>
              )}
              <div className="h-8 w-px bg-slate-200 mx-1"></div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user.fullName}</p>
                <p className="text-xs text-primary-600 font-medium">{user.balance?.toLocaleString()} VNĐ</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Đăng xuất">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">Đăng nhập</Link>
              <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors shadow-sm">Đăng ký</Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              placeholder="Tìm kiếm mã nguồn..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-transparent focus:border-primary-500 rounded-xl text-sm outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </form>

          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`p-3 rounded-lg text-sm font-medium ${location.pathname === link.path ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-primary-600 font-medium mt-1">Số dư: {user.balance?.toLocaleString()} VNĐ</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 rounded-lg">
                    <LogOut size={20} />
                  </button>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900 text-white rounded-lg text-sm font-medium">
                    <LayoutDashboard size={18} /> Đi tới Admin Panel
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="flex items-center justify-center py-2.5 text-sm font-medium border border-slate-200 rounded-lg text-slate-700">Đăng nhập</Link>
                <Link to="/register" className="flex items-center justify-center py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
