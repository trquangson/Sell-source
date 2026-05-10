import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient';
import { LayoutDashboard, LogOut, Search, Menu, X, ChevronDown, ChevronRight, Tag, Wallet, ArrowDownCircle, ShoppingBag, Plus, Globe } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isWalletHovered, setIsWalletHovered] = useState(false);
  const [isLangHovered, setIsLangHovered] = useState(false);
  const hoverTimeout = useRef(null);
  const walletTimeout = useRef(null);
  const langTimeout = useRef(null);
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

  const handleMouseEnter = () => { clearTimeout(hoverTimeout.current); setIsProductsHovered(true); };
  const handleMouseLeave = () => { hoverTimeout.current = setTimeout(() => setIsProductsHovered(false), 150); };

  const handleWalletEnter = () => { clearTimeout(walletTimeout.current); setIsWalletHovered(true); };
  const handleWalletLeave = () => { walletTimeout.current = setTimeout(() => setIsWalletHovered(false), 150); };

  const handleLangEnter = () => { clearTimeout(langTimeout.current); setIsLangHovered(true); };
  const handleLangLeave = () => { langTimeout.current = setTimeout(() => setIsLangHovered(false), 150); };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangHovered(false);
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50 shadow-sm glass-panel">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight flex-shrink-0 font-mono">
            &gt;_{config.name}
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link
              to="/"
              className={`text-sm font-bold transition-colors ${location.pathname === '/' ? 'text-primary-600' : 'text-text-muted hover:text-primary-600'}`}
            >
              {t('header.home')}
            </Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/products"
                className={`text-sm font-bold transition-colors flex items-center gap-1 ${location.pathname === '/products' ? 'text-primary-600' : 'text-text-muted hover:text-primary-600'}`}
              >
                {t('header.products')}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isProductsHovered ? 'rotate-180' : ''}`}
                />
              </Link>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 w-52 bg-surface rounded-xl border border-border shadow-xl py-2 transition-all duration-200 ${isProductsHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-4 py-2 border-b border-border mb-1">
                  <p className="text-xs font-mono font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <Tag size={11} /> {t('product.categories')}
                  </p>
                </div>

                <Link
                  to="/products"
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-bold text-text-main hover:bg-surface-hover hover:text-primary-600 transition-colors"
                >
                  {t('product.all')}
                  <ChevronRight size={14} className="text-text-muted" />
                </Link>

                <div className="h-px bg-border mx-3 my-1" />

                {config.categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="flex items-center px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-primary-600 transition-colors gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                    {t(`categories.${cat}`)}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className={`text-sm font-bold transition-colors ${location.pathname === '/contact' ? 'text-primary-600' : 'text-text-muted hover:text-primary-600'}`}
            >
              {t('header.contact')}
            </Link>
          </nav>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-[280px] mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder={t('header.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-border focus:border-primary-500 rounded-lg text-sm text-text-main placeholder-text-muted outline-none transition-all font-mono shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </form>
        </div>

        {/* User Actions & Mobile Toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* Language Switcher */}
          <div 
            className="hidden sm:block relative"
            onMouseEnter={handleLangEnter}
            onMouseLeave={handleLangLeave}
          >
            <button className="flex items-center gap-1.5 text-sm font-bold text-text-muted hover:text-primary-600 transition-colors py-2">
              <Globe size={16} /> {i18n.language === 'vi' ? 'VN' : 'EN'}
            </button>
            <div
              className={`absolute top-full right-0 mt-2 w-24 bg-surface rounded-xl border border-border shadow-xl py-1 transition-all duration-200 ${isLangHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
            >
              <button onClick={() => changeLanguage('vi')} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-surface-hover ${i18n.language === 'vi' ? 'text-primary-600' : 'text-text-muted'}`}>Tiếng Việt</button>
              <button onClick={() => changeLanguage('en')} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-surface-hover ${i18n.language === 'en' ? 'text-primary-600' : 'text-text-muted'}`}>English</button>
            </div>
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-muted hover:text-primary-600 transition-colors bg-surface-hover px-2.5 py-1.5 rounded-lg border border-border">
                  <LayoutDashboard size={14} /> {t('header.admin_panel')}
                </Link>
              )}

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 hover:bg-primary-200 transition-colors border border-primary-200"
                title={t('header.dashboard')}
              >
                {user.username.charAt(0).toUpperCase()}
              </Link>

              {/* Wallet Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleWalletEnter}
                onMouseLeave={handleWalletLeave}
              >
                <button className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition-colors">
                  <Wallet size={16} />
                  <span>{user.balance?.toLocaleString()}đ</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isWalletHovered ? 'rotate-180' : ''}`} />
                </button>

                {/* Wallet menu */}
                <div
                  className={`absolute top-full right-0 mt-2 w-52 bg-surface rounded-xl border border-border shadow-xl py-2 transition-all duration-200 ${isWalletHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  <div className="px-4 py-2.5 border-b border-border">
                    <p className="text-xs text-text-muted font-mono font-bold uppercase">{t('header.fund_account')}</p>
                    <p className="text-base font-extrabold text-emerald-600 font-mono mt-0.5">{user.balance?.toLocaleString()}đ</p>
                  </div>
                  <Link to="/topup" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-surface-hover transition-colors">
                    <Plus size={16} /> {t('header.fund_account')}
                  </Link>
                  <div className="h-px bg-border mx-3" />
                  <Link to="/history/purchase" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-primary-600 transition-colors">
                    <ShoppingBag size={16} /> {t('header.transaction_logs')}
                  </Link>
                </div>
              </div>

              <button onClick={handleLogout} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('header.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary-600">{t('header.login')}</Link>
              <Link to="/register" className="text-sm font-bold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors shadow-[0_0_10px_rgba(8,145,178,0.2)]">{t('header.register')}</Link>
            </div>
          )}

          <button
            className="md:hidden p-2 text-text-muted hover:text-primary-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder={t('header.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border focus:border-primary-500 rounded-lg text-sm text-text-main outline-none font-mono"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </form>

          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              className={`p-3 rounded-lg text-sm font-bold ${location.pathname === '/' ? 'bg-primary-50 text-primary-600' : 'text-text-muted hover:bg-surface-hover'}`}
            >
              {t('header.home')}
            </Link>

            <div>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-bold ${location.pathname === '/products' ? 'bg-primary-50 text-primary-600' : 'text-text-muted hover:bg-surface-hover'}`}
              >
                {t('header.products')}
                <ChevronDown size={16} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                  <Link
                    to="/products"
                    className="block py-2 px-2 text-sm font-bold text-text-main hover:text-primary-600 rounded-lg hover:bg-surface-hover"
                  >
                    {t('product.all')}
                  </Link>
                  {config.categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-text-muted hover:text-primary-600 rounded-lg hover:bg-surface-hover"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                      {t(`categories.${cat}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`p-3 rounded-lg text-sm font-bold ${location.pathname === '/contact' ? 'bg-primary-50 text-primary-600' : 'text-text-muted hover:bg-surface-hover'}`}
            >
              {t('header.contact')}
            </Link>
            
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-bold text-text-muted">{t('header.language')}</span>
              <div className="flex bg-surface-hover rounded-lg p-1">
                <button onClick={() => changeLanguage('vi')} className={`px-3 py-1 rounded text-xs font-bold ${i18n.language === 'vi' ? 'bg-white shadow-sm text-primary-600' : 'text-text-muted'}`}>VN</button>
                <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded text-xs font-bold ${i18n.language === 'en' ? 'bg-white shadow-sm text-primary-600' : 'text-text-muted'}`}>EN</button>
              </div>
            </div>
          </nav>

          <div className="pt-4 border-t border-border">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-hover rounded-xl border border-border">
                  <div>
                    <Link to="/profile" className="text-sm font-bold text-text-main hover:text-primary-600">{user.fullName}</Link>
                    <p className="text-xs text-emerald-600 font-mono font-bold mt-0.5">{user.balance?.toLocaleString()}đ</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-100 rounded-lg flex-shrink-0">
                    <LogOut size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/topup"
                    className="flex flex-col items-center gap-1 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors text-center border border-emerald-200"
                  >
                    <Plus size={16} />
                    <span className="text-xs font-bold">{t('header.fund_account')}</span>
                  </Link>
                  <Link
                    to="/history/purchase"
                    className="flex flex-col items-center gap-1 p-3 bg-white border border-border text-text-muted hover:text-primary-600 rounded-xl transition-colors text-center shadow-sm"
                  >
                    <ShoppingBag size={16} />
                    <span className="text-xs font-bold">{t('header.transaction_logs')}</span>
                  </Link>
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center justify-center gap-2 w-full p-3 bg-slate-800 text-white rounded-xl text-sm font-mono border border-border font-bold">
                    <LayoutDashboard size={16} /> {t('header.admin_panel')}
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="flex items-center justify-center py-2.5 text-sm font-bold border border-border bg-white shadow-sm rounded-lg text-text-main hover:text-primary-600">{t('header.login')}</Link>
                <Link to="/register" className="flex items-center justify-center py-2.5 text-sm font-bold bg-primary-600 text-white rounded-lg shadow-[0_0_10px_rgba(8,145,178,0.2)] hover:bg-primary-500">{t('header.register')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
