import React, { useState, useEffect } from 'react';
import { billingApi } from '@/features/billing/api/billingApi';
import siteConfig from '@/config/siteConfig';
import OrderList from '@/features/billing/components/OrderList';
import UserDashboardLayout from '@/shared/components/UserDashboardLayout';
import { useTranslation } from 'react-i18next';

const PurchaseHistoryPage = () => {
  const { t } = useTranslation();
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
    <UserDashboardLayout title={t('history.title')} subtitle={t('history.subtitle')}>
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-10 text-center text-text-muted animate-pulse">Loading logs...</p>
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
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors shadow-sm ${
                page === p ? 'bg-primary-50 text-primary-600 border border-primary-200' : 'bg-white text-text-muted border border-border hover:border-primary-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </UserDashboardLayout>
  );
};

export default PurchaseHistoryPage;
