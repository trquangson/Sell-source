import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const ProductSidebar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const categories = ['Tất cả', ...siteConfig.categories];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Tìm kiếm</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-500 rounded-xl text-sm outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Danh mục</h3>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (searchTerm) setSearchTerm('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${selectedCategory === cat
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  {cat}
                  {selectedCategory === cat && <ChevronRight size={16} className="text-primary-500" />}
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
