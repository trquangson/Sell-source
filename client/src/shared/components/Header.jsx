import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient';
import { LayoutDashboard, LogOut, Search, Menu, X, ChevronDown, ChevronRight, Tag, Wallet, ArrowDownCircle, ShoppingBag, Plus, User as UserIcon } from 'lucide-react';
import { useSite } from '@/context/SiteContext';

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const hoverTimeout = useRef(null);
  const walletTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { config } = useSite();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
    setIsMobileMenuOpen(false);
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

  // Dùng timeout để tránh dropdown đóng ngay khi di chuột giữa trigger và dropdown
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setIsProductsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setIsProductsHovered(false), 150);
  };

  const handleWalletEnter = () => {
    clearTimeout(walletTimeout.current);
    setIsWalletHovered(true);
  };

  const handleWalletLeave = () => {
    walletTimeout.current = setTimeout(() => setIsWalletHovered(false), 150);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight flex-shrink-0">{config.name}</Link>

          <nav className="hidden md:flex gap-8">
            {/* Link Trang chủ thường */}
            <Link
              to="/"
              className={`text-base font-semibold transition-colors ${location.pathname === '/' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
            >
              Trang chủ
            </Link>

            {/* Link Sản phẩm với Mega Dropdown danh mục */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/products"
                className={`text-base font-semibold transition-colors flex items-center gap-1 ${location.pathname === '/products' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
              >
                Sản phẩm
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isProductsHovered ? 'rotate-180' : ''}`}
                />
              </Link>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 transition-all duration-200 ${isProductsHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Header dropdown */}
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Tag size={11} /> Danh mục
                  </p>
                </div>

                {/* Tất cả sản phẩm */}
                <Link
                  to="/products"
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  Tất cả sản phẩm
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                <div className="h-px bg-slate-100 mx-3 my-1" />

                {/* Từng danh mục */}
                {config.categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Link Liên hệ */}
            <Link
              to="/contact"
              className={`text-base font-semibold transition-colors ${location.pathname === '/contact' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
            >
              Liên hệ
            </Link>
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
            <div className="hidden md:flex items-center gap-3">
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  <LayoutDashboard size={18} /> Admin
                </Link>
              )}

              {/* Profile Avatar */}
              <Link 
                to="/profile" 
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-colors shadow-sm border border-slate-200"
                title="Hồ sơ cá nhân"
              >
                {user.username.charAt(0).toUpperCase()}
              </Link>

              {/* Wallet Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleWalletEnter}
                onMouseLeave={handleWalletLeave}
              >
                <button className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 border border-primary-100 text-primary-700 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors">
                  <Wallet size={16} />
                  <span>{user.balance?.toLocaleString()}đ</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isWalletHovered ? 'rotate-180' : ''}`} />
                </button>

                {/* Wallet menu */}
                <div
                  className={`absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 transition-all duration-200 ${isWalletHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                  onMouseEnter={handleWalletEnter}
                  onMouseLeave={handleWalletLeave}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Số dư tài khoản</p>
                    <p className="text-base font-extrabold text-primary-600">{user.balance?.toLocaleString()}đ</p>
                  </div>
                  <Link to="/topup" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors">
                    <Plus size={16} className="text-primary-500" /> Nạp tiền
                  </Link>
                  <div className="h-px bg-slate-100 mx-3" />
                  <Link to="/topup" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <ArrowDownCircle size={16} className="text-slate-400" /> Lịch sử nạp tiền
                  </Link>
                  <Link to="/history/purchase" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <ShoppingBag size={16} className="text-slate-400" /> Lịch sử mua hàng
                  </Link>
                </div>
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

          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              className={`p-3 rounded-lg text-sm font-medium ${location.pathname === '/' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Trang chủ
            </Link>

            {/* Sản phẩm + toggle danh mục trên mobile */}
            <div>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium ${location.pathname === '/products' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Sản phẩm
                <ChevronDown size={16} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-primary-100 pl-3">
                  <Link
                    to="/products"
                    className="block py-2 px-2 text-sm font-semibold text-slate-700 hover:text-primary-600 rounded-lg hover:bg-slate-50"
                  >
                    Tất cả sản phẩm
                  </Link>
                  {config.categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      className="flex items-center gap-2 py-2 px-2 text-sm text-slate-600 hover:text-primary-600 rounded-lg hover:bg-slate-50"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`p-3 rounded-lg text-sm font-medium ${location.pathname === '/contact' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Liên hệ
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                {/* User info + balance */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <Link to="/profile" className="text-sm font-bold text-slate-900 hover:text-primary-600 hover:underline">{user.fullName}</Link>
                    <p className="text-xs text-primary-600 font-semibold mt-0.5">Số dư: {user.balance?.toLocaleString()}đ</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-red-500 bg-red-50 rounded-lg flex-shrink-0">
                    <LogOut size={20} />
                  </button>
                </div>

                {/* Wallet actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to="/topup"
                    className="flex flex-col items-center gap-1 p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl transition-colors text-center"
                  >
                    <Plus size={18} />
                    <span className="text-xs font-semibold">Nạp tiền</span>
                  </Link>
                  <Link
                    to="/topup"
                    className="flex flex-col items-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-center"
                  >
                    <ArrowDownCircle size={18} />
                    <span className="text-xs font-medium">Lịch sử nạp</span>
                  </Link>
                  <Link
                    to="/history/purchase"
                    className="flex flex-col items-center gap-1 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors text-center"
                  >
                    <ShoppingBag size={18} />
                    <span className="text-xs font-medium">Đã mua</span>
                  </Link>
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center justify-center gap-2 w-full p-3 bg-slate-900 text-white rounded-xl text-sm font-medium">
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
