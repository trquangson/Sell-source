import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billingApi } from '@/features/billing/api/billingApi';
import { ChevronLeft } from 'lucide-react';
import siteConfig from '@/config/siteConfig';
import OrderList from '@/features/billing/components/OrderList';

const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res = await billingApi.getPurchaseHistory('PURCHASE', p);
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
          ) : (
            <OrderList orders={orders} handleDownload={handleDownload} />
          )}
        </div>

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

export default PurchaseHistoryPage;
