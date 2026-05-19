import React from 'react';
import { ShoppingBag, Download, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';
import { useTranslation } from 'react-i18next';

const OrderList = ({ orders, handleDownload }) => {
  const { t } = useTranslation();

  if (orders.length === 0) {
    return (
      <div className="p-8 md:p-10 text-center font-mono">
        <Database size={40} className="mx-auto text-text-muted mb-3 opacity-50" />
        <p className="text-text-muted font-bold mb-4">{t('history.no_records', 'No records found in database')}</p>
        <Link to="/products" className="inline-block text-sm font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4">{t('history.browse_repos', 'Browse repositories')}</Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border font-mono bg-white">
      {orders.map(tx => (
        <div key={tx._id} className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-slate-50 transition-colors group">
          <div className="hidden xs:block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-surface-hover flex-shrink-0 border border-border">
            {tx.sourceId?.thumbnail ? (
              <Link to={`/product/${tx.sourceId._id}`} className="block w-full h-full">
                <img
                  src={`${siteConfig.assetBaseUrl}${tx.sourceId.thumbnail}`}
                  alt={tx.sourceId.title}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
            ) : tx.forumPostId && (tx.forumPostId.thumbnail || (tx.forumPostId.demoImages && tx.forumPostId.demoImages[0])) ? (
              <Link to={`/forum/${tx.forumPostId._id}`} className="block w-full h-full">
                <img
                  src={`${siteConfig.assetBaseUrl}${tx.forumPostId.thumbnail || tx.forumPostId.demoImages[0]}`}
                  alt={tx.forumPostId.title}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Database size={18} className="text-text-muted/50" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {tx.sourceId ? (
              <Link to={`/product/${tx.sourceId._id}`} className="text-sm font-bold text-text-main truncate hover:text-primary-600 transition-colors block">
                {tx.sourceId.title}
              </Link>
            ) : tx.forumPostId ? (
              <Link to={`/forum/${tx.forumPostId._id}`} className="text-sm font-bold text-text-main truncate hover:text-primary-600 transition-colors block">
                {tx.forumPostId.title}
              </Link>
            ) : (
              <p className="text-sm font-bold text-text-main truncate hover:text-primary-600 transition-colors">
                {tx.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{new Date(tx.createdAt).toLocaleDateString('en-US')}</span>
              {tx.discountAmount > 0 && (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  -{tx.discountAmount.toLocaleString()}đ
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {tx.originalAmount > tx.amount && (
              <p className="text-[10px] text-text-muted line-through font-bold">{tx.originalAmount.toLocaleString()}đ</p>
            )}
            <p className={`text-sm font-extrabold ${tx.type === 'SELLER_EARNING' ? 'text-emerald-600' : 'text-text-main'}`}>
               {tx.type === 'SELLER_EARNING' ? '+' : ''}{tx.amount.toLocaleString()}<span className="text-xs ml-0.5">đ</span>
            </p>
            {tx.sourceId && (
              <button
                onClick={() => handleDownload(tx.sourceId._id)}
                className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-white bg-primary-50 hover:bg-primary-600 px-2.5 py-1.5 rounded-lg border border-primary-100 hover:border-primary-600 transition-all ml-auto shadow-sm"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Clone</span>
              </button>
            )}
            {tx.forumPostId && tx.type === 'FORUM_PURCHASE' && (
              <a
                href={`${siteConfig.apiBaseUrl}/forum/posts/${tx.forumPostId._id}/download`}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 px-2.5 py-1.5 rounded-lg border border-emerald-100 hover:border-emerald-600 transition-all ml-auto shadow-sm"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Tải về</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
