import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { forumApi } from '@/features/forum/api/forumApi';
import { ChevronLeft, Loader2, FileText, UserCircle, Tag, Clock } from 'lucide-react';
import ProductGallery from '@/features/products/components/ProductGallery';
import ForumPurchaseBox from '@/features/forum/components/ForumPurchaseBox';
import ForumReviewList from '@/features/forum/components/ForumReviewList';
import { useTranslation } from 'react-i18next';
import axiosClient from '@/shared/api/axiosClient';

const ForumDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await forumApi.getPostById(id);
        setPost(res.data);

        try {
          const meRes = await axiosClient.get('/auth/me');
          setUser(meRes.user);
          
          if (meRes.user) {
            const checkRes = await forumApi.checkPurchased(id);
            setAlreadyPurchased(checkRes.purchased || false);
          }
        } catch { /* chưa đăng nhập */ }

        // Increment view only once per session
        if (!sessionStorage.getItem(`viewed_${id}`)) {
          forumApi.incrementView(id).catch(() => {});
          sessionStorage.setItem(`viewed_${id}`, 'true');
          // Optimistically increment locally
          setPost(prev => ({ ...prev, views: (prev.views || 0) + 1 }));
        }

      } catch (error) {
        console.error('Lỗi lấy chi tiết bài đăng', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary-500" size={32} />
        <span className="text-text-muted text-sm animate-pulse">{t('detail.loading', 'Loading data...')}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {post.title}
              </h1>
              <span className="hidden md:inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full">{t('forum.status_active')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200">
                  {post.sellerId?.avatar ? (
                    <img src={post.sellerId.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">{post.sellerId?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-slate-800 font-bold">{post.sellerId?.fullName || post.sellerId?.username}</span>
              </div>
              <div className="flex items-center gap-1"><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
              <div className="flex items-center gap-1"><UserCircle size={14} /> {post.views || 0} {t('forum.views')}</div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{t(`categories.${post.category}`, post.category)}</span>
              {post.tags && post.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-4xl font-black text-blue-600 tracking-tight">{post.price > 0 ? new Intl.NumberFormat('vi-VN').format(post.price) + 'đ' : t('forum.free')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main content (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <ProductGallery source={post} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button 
                  onClick={() => setActiveTab('description')}
                  className={`px-6 py-4 font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                >{t('forum.tab_description')}</button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`px-6 py-4 font-bold border-b-2 transition-colors ${activeTab === 'reviews' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                >{t('forum.tab_reviews')}</button>
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'description' ? (
                  <>
                    <h2 className="text-xl font-bold mb-4 text-slate-900">{t('forum.tab_description')}</h2>
                    <div
                      className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600"
                      dangerouslySetInnerHTML={{ __html: post.description?.replace(/\n/g, '<br/>') }}
                    />
                  </>
                ) : (
                  <ForumReviewList postId={post._id} user={user} alreadyPurchased={alreadyPurchased} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">

            {/* Box Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">{t('forum.info')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">{t('forum.category')}</span>
                  <span className="font-medium text-slate-800">{t(`categories.${post.category}`, post.category)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">{t('forum.last_updated')}</span>
                  <span className="font-medium text-slate-800">{new Date(post.updatedAt || post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">{t('forum.downloads')}</span>
                  <span className="font-medium text-slate-800">{t('forum.downloads_count', { count: post.purchaseCount })}</span>
                </div>
              </div>
            </div>

            {/* Box Seller */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">{t('forum.seller')}</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                  {post.sellerId?.avatar ? (
                    <img src={post.sellerId.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center font-bold text-slate-600">{post.sellerId?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{post.sellerId?.fullName || post.sellerId?.username}</h4>
                  <p className="text-xs text-slate-500">⭐ {post.sellerId?.averageRating?.toFixed(1) || '0.0'} ({t('forum.reviews_count', { count: post.sellerId?.ratingCount || 0 })})</p>
                </div>
              </div>
              <Link to={`/user/${post.sellerId?._id}`} className="block text-center w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-sm transition-colors">
                {t('forum.view_profile')}
              </Link>
            </div>

            {/* Purchase Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <ForumPurchaseBox post={post} initialPurchased={alreadyPurchased} onPurchaseSuccess={() => setAlreadyPurchased(true)} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetailPage;
