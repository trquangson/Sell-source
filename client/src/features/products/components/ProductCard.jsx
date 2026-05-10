import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ source }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden group hover:shadow-lg hover:border-primary-400 transition-all duration-300 flex flex-col h-full relative">
      <div className="aspect-[16/9] bg-surface-hover overflow-hidden relative border-b border-border">
        <img
          src={source.thumbnail ? `${siteConfig.assetBaseUrl}${source.thumbnail}` : 'https://via.placeholder.com/600x400?text=No+Image'}
          alt={source.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-primary-600 border border-primary-200 uppercase tracking-wider shadow-sm">
          {source.category ? t(`categories.${source.category}`) : t('common.package')}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4 relative z-20">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-main mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
            {source.title}
          </h3>
          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed font-medium">
            {source.description}
          </p>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-border mt-auto">
          <div>
            <p className="text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest mb-1">{t('detail.license_fee')}</p>
            <p className="text-xl font-extrabold text-primary-600 font-mono leading-none">
              {source.price.toLocaleString()}<span className="text-sm font-semibold ml-0.5">đ</span>
            </p>
          </div>
          {source.purchaseCount > 0 && (
            <div className="text-right">
              <p className="text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest mb-1">{t('product.installs')}</p>
              <p className="text-sm font-bold text-text-main font-mono">{source.purchaseCount.toLocaleString()}</p>
            </div>
          )}
        </div>

        <Link
          to={`/product/${source._id}`}
          className="w-full py-2.5 px-4 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 border border-primary-100 hover:border-primary-600 text-sm mt-2"
        >
          <ShoppingCart size={16} />
          {t('product.view_details')}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
