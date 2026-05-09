import React from 'react';
import { ShoppingBag, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteConfig from '@/config/siteConfig';

const OrderList = ({ orders, handleDownload }) => {
  if (orders.length === 0) {
    return (
      <div className="p-8 md:p-10 text-center">
        <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">Chưa có đơn hàng nào</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-primary-600 hover:underline">Khám phá sản phẩm</Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {orders.map(tx => (
        <div key={tx._id} className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4">
          <div className="hidden xs:block w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            {tx.sourceId?.thumbnail ? (
              <img
                src={`${siteConfig.assetBaseUrl}${tx.sourceId.thumbnail}`}
                alt={tx.sourceId.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={18} className="text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {tx.sourceId?.title || tx.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
              <span className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
              {tx.discountAmount > 0 && (
                <span className="text-xs text-green-600 font-medium">Giảm {tx.discountAmount.toLocaleString()}đ</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            {tx.originalAmount > tx.amount && (
              <p className="text-xs text-slate-400 line-through">{tx.originalAmount.toLocaleString()}đ</p>
            )}
            <p className="text-sm font-bold text-slate-900">{tx.amount.toLocaleString()}đ</p>
            {tx.sourceId && (
              <button
                onClick={() => handleDownload(tx.sourceId._id)}
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2 md:px-2.5 py-1 rounded-lg transition-colors ml-auto"
              >
                <Download size={12} />
                <span className="hidden sm:inline">Tải xuống</span>
                <span className="sm:hidden">Tải</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
