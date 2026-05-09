import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { productsApi } from '@/features/products/api/productsApi';
import { ArrowUpDown } from 'lucide-react';
import Pagination from '@/shared/components/Pagination';
import { paginate, getTotalPages } from '@/shared/utils/paginationHelper';
import ProductCard from '@/features/products/components/ProductCard';
import ProductSidebar from '@/features/products/components/ProductSidebar';

const ProductsPage = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy query từ URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'Tất cả';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

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
        const res = await productsApi.getSources();
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const totalPages = getTotalPages(filteredSources.length);
  const pagedSources = paginate(filteredSources, currentPage);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <ProductSidebar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />

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
                    <ProductCard key={source._id} source={source} />
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

export default ProductsPage;
