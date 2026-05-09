import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '@/shared/api/axiosClient';
import { ShoppingBag, Download, ChevronLeft } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const PurchaseHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/purchases/history?type=PURCHASE&page=${p}`);
      setOrders(res.data?.transactions || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const handleDownload = (sourceId) => {
    window.open(`${siteConfig.apiBaseUrl}/purchases/download/${sourceId}`, '_blank');
  };

  return (
    <div className="min-h-screen py-6 md:py-8 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-5 md:mb-6 flex items-center gap-3">
          <Link
            to="/topup"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-slate-200 transition-colors flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Lịch sử mua hàng</h1>
            <p className="text-slate-500 text-sm mt-0.5">Tất cả sản phẩm bạn đã mua</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-10 text-center text-slate-500">Đang tải...</p>
          ) : orders.length === 0 ? (
            <div className="p-8 md:p-10 text-center">
              <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Chưa có đơn hàng nào</p>
              <Link to="/products" className="mt-4 inline-block text-sm text-primary-600 hover:underline">Khám phá sản phẩm</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map(tx => (
                <div key={tx._id} className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4">

                  {/* Thumbnail — ẩn trên màn rất nhỏ */}
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

                  {/* Info */}
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

                  {/* Price + Download */}
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5 md:mt-6 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                  page === p ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
