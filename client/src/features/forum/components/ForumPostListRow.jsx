import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import siteConfig from '@/config/siteConfig';

const ForumPostListRow = ({ post }) => {
  const { t } = useTranslation();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getThumbnail = () => {
    if (post.thumbnail) return `${siteConfig.assetBaseUrl}${post.thumbnail}`;
    if (post.demoImages && post.demoImages.length > 0) return `${siteConfig.assetBaseUrl}${post.demoImages[0]}`;
    return 'https://placehold.co/150x150/f8fafc/94a3b8?text=No+Image';
  };

  return (
    <Link
      to={`/forum/${post._id}`}
      className="group flex flex-col sm:flex-row items-start gap-4 p-5 hover:bg-blue-50/30 transition-colors"
    >
      <div className="w-full sm:w-[120px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={getThumbnail()}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://placehold.co/150x150/f8fafc/94a3b8?text=No+Image'; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
        <div>
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded">
                {t('forum.status_active')}
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600 sm:hidden block">{post.price > 0 ? formatPrice(post.price) : t('forum.free')}</span>
          </div>

          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1 mb-1.5 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-1 mb-3">
            {post.shortDescription || post.description.replace(/<[^>]+>/g, '').slice(0, 100)}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              {t(`categories.${post.category}`, post.category)}
            </span>
            {post.tags && post.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 text-slate-500 border border-slate-200 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-1 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {post.sellerId?.avatar ? (
                <img src={post.sellerId.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-600 text-[10px] font-bold">{post.sellerId?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="text-slate-700 font-bold">{post.sellerId?.fullName || post.sellerId?.username}</span>
          </div>
          <div className="flex items-center gap-1.5"><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
          <div className="flex items-center gap-4 ml-auto">
             <span className="flex items-center gap-1.5"><Eye size={14} /> {post.views || 0}</span>
             {/* <span className="flex items-center gap-1.5"><Heart size={14} /> {Math.floor(Math.random() * 50) + 5}</span> */}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end pl-4">
        <span className="text-xl font-black text-blue-600 leading-none">{post.price > 0 ? formatPrice(post.price) : t('forum.free')}</span>
      </div>
    </Link>
  );
};

export default ForumPostListRow;
