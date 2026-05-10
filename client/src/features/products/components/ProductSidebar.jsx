import React from 'react';
import { Search, Filter } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { useTranslation } from 'react-i18next';

const ProductSidebar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const { t } = useTranslation();
  const categories = ['Tất cả', ...siteConfig.categories];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm sticky top-24">
        <div className="mb-6">
          <h3 className="text-xs font-mono font-bold text-text-muted mb-3 uppercase tracking-widest flex items-center gap-2">
            <Search size={14} /> {t('header.search')}
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder={t('product.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border focus:border-primary-500 rounded-xl text-sm text-text-main outline-none transition-all font-mono shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-mono font-bold text-text-muted mb-3 uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} /> {t('product.categories')}
          </h3>
          <ul className="space-y-1.5 font-mono text-sm">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (searchTerm) setSearchTerm('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-bold flex items-center justify-between transition-colors border ${selectedCategory === cat
                    ? 'bg-primary-50 text-primary-600 border-primary-100 shadow-sm'
                    : 'bg-transparent text-text-muted border-transparent hover:bg-surface-hover hover:text-text-main'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0"></span>}
                    {cat === 'Tất cả' ? t('product.all') : t(`categories.${cat}`)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
