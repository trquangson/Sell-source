import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Loader2, Plus, ChevronDown } from 'lucide-react';
import { forumApi } from '@/features/forum/api/forumApi';
import ForumPostListRow from '@/features/forum/components/ForumPostListRow';
import Pagination from '@/shared/components/Pagination';
import { Link } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';

const ForumPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Tất cả', ...siteConfig.categories];

  useEffect(() => {
    fetchPosts();
  }, [page, category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search: searchTerm,
        category: category === 'Tất cả' ? '' : category,
      };
      const res = await forumApi.getPublicPosts(params);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Lỗi lấy danh sách bài đăng forum', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('forum.title')}</h1>
            <p className="text-slate-500 mt-1 font-medium">{t('forum.subtitle')}</p>
          </div>
          <Link
            to="/forum/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            {t('forum.create_post')}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input
              type="text"
              placeholder={t('forum.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <button type="submit" className="hidden">Search</button>
          </form>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value === 'Tất cả' ? '' : e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block px-4 py-2.5 pr-10 outline-none cursor-pointer font-medium w-full min-w-[140px]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === '' ? 'Danh mục' : cat}</option>
                ))}
              </select>
              <ChevronDown size={16} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative hidden md:block">
              <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block px-4 py-2.5 pr-10 outline-none cursor-pointer font-medium min-w-[140px]">
                <option value="newest">{t('forum.sort_newest')}</option>
                <option value="popular">{t('forum.sort_views_desc')}</option>
                <option value="price_asc">{t('forum.sort_price_asc')}</option>
              </select>
              <ChevronDown size={16} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
            <div className="divide-y divide-slate-100">
              {posts.map((post) => (
                <ForumPostListRow key={post._id} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-100 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Search className="text-slate-300 mx-auto mb-4" size={40} />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy mã nguồn</h3>
            <p className="text-slate-500 text-sm">Thử sử dụng từ khóa khác hoặc xóa bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
