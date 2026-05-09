import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import siteConfig from '@/config/siteConfig';

const ProductCard = ({ source }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
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

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
            {source.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {source.description}
          </p>
        </div>

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
  );
};

export default ProductCard;
