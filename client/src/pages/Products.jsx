import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, Search, ChevronRight, ArrowUpDown } from 'lucide-react';
import siteConfig from '../config/siteConfig';
import Pagination from '../components/Pagination';
import { paginate, getTotalPages } from '../helpers/paginationHelper';

const Products = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy query từ URL (để hứng từ thanh Search Header)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'Tất cả';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['Tất cả', ...siteConfig.categories];

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    if (urlSearch !== null) {
      setSearchTerm(urlSearch);
      setSelectedCategory('Tất cả');
      setCurrentPage(1);
    }
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      setSearchTerm('');
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axiosClient.get('/sources');
        setSources(res.data || []);
      } catch (error) {
        console.error('Lỗi lấy danh sách', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  const filteredSources = sources.filter(source => {
    const matchSearch = source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tất cả' || source.category === selectedCategory;
    return matchSearch && matchCategory;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  // Reset về trang 1 khi filter / sort thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const totalPages = getTotalPages(filteredSources.length);
  const pagedSources = paginate(filteredSources, currentPage);

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar Left */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">

            {/* Search Bar (Mobile/Sidebar) */}
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

            {/* Categories */}
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

        {/* Product Grid Right */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {searchTerm ? `Kết quả cho "${searchTerm}"` : (selectedCategory === 'Tất cả' ? 'Tất cả sản phẩm' : selectedCategory)}
              </h2>
              <div className="text-sm text-slate-500 font-medium mt-1">
                Hiển thị <span className="text-slate-900">{filteredSources.length}</span> kết quả
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={18} className="text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="priceAsc">Giá: Thấp đến Cao</option>
                <option value="priceDesc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSources.length === 0 ? (
                  <div className="col-span-full text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
                    Không tìm thấy mã nguồn nào phù hợp.
                  </div>
                ) : (
                  pagedSources.map(source => (
                    <div key={source._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                      {/* Ảnh */}
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                        <img
                          src={source.thumbnail ? `${siteConfig.assetBaseUrl}${source.thumbnail}` : 'https://via.placeholder.com/600x400?text=No+Image'}
                          alt={source.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-white border border-white/10">
                          {source.category || 'Khác'}
                        </div>
                      </div>

                      {/* Nội dung */}
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                            {source.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {source.description}
                          </p>
                        </div>

                        {/* Giá + lượt mua */}
                        <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                          <div>
                            <p className="text-xs text-slate-400 font-medium mb-0.5">Giá bán</p>
                            <p className="text-xl font-extrabold text-primary-600 leading-none">
                              {source.price.toLocaleString()}<span className="text-sm font-semibold ml-0.5">đ</span>
                            </p>
                          </div>
                          {source.purchaseCount > 0 && (
                            <div className="text-right">
                              <p className="text-xs text-slate-400 mb-0.5">Đã bán</p>
                              <p className="text-sm font-bold text-slate-600">{source.purchaseCount.toLocaleString()}</p>
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/product/${source._id}`}
                          className="w-full py-2.5 px-4 bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white rounded-xl font-semibold transition-all text-center flex items-center justify-center gap-2 border border-primary-100 hover:border-primary-600 text-sm"
                        >
                          <ShoppingCart size={16} />
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
