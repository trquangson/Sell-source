import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Star, Code, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ForumPostCard = ({ post }) => {
  const { t } = useTranslation();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getThumbnail = () => {
    if (post.thumbnail) return `${import.meta.env.VITE_API_URL}${post.thumbnail}`;
    if (post.demoImages && post.demoImages.length > 0) return `${import.meta.env.VITE_API_URL}${post.demoImages[0]}`;
    return 'https://placehold.co/600x400/1e293b/334155?text=No+Image';
  };

  return (
    <Link 
      to={`/forum/${post._id}`} 
      className="group flex flex-col bg-white rounded-[24px] border border-slate-200/60 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-primary-200 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-slate-900/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
        <img 
          src={getThumbnail()} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-black text-slate-800 shadow-sm">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-slate-500 line-clamp-2 mb-5 flex-grow leading-relaxed">
          {post.shortDescription || post.description.replace(/<[^>]+>/g, '').slice(0, 100)}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-100 to-primary-50 flex items-center justify-center overflow-hidden border border-primary-100">
                {post.sellerId?.avatar ? (
                    <img src={post.sellerId.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-primary-700 text-xs font-black">{post.sellerId?.username?.charAt(0).toUpperCase()}</span>
                )}
             </div>
             <span className="text-xs font-bold text-slate-700 truncate max-w-[90px]">{post.sellerId?.username}</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Giá bán</span>
            <span className="text-lg font-black text-primary-600 leading-none">{formatPrice(post.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ForumPostCard;
