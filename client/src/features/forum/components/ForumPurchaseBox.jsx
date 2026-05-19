import React, { useState, useEffect } from 'react';
import { Download, ShoppingCart, Loader2, Info, Heart } from 'lucide-react';
import axiosClient from '@/shared/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { forumApi } from '../api/forumApi';
import ConfirmModal from '@/shared/components/ConfirmModal';

const ForumPurchaseBox = ({ post, initialPurchased, onPurchaseSuccess }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [purchased, setPurchased] = useState(initialPurchased);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setPurchased(initialPurchased);
  }, [initialPurchased]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/auth/me');
        setUser(res.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handlePurchase = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (user._id === post.sellerId?._id || user.id === post.sellerId?._id) {
      setError(t('forum.cannot_buy_own'));
      setShowConfirm(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await forumApi.purchasePost(post._id);
      setPurchased(true);
      setShowConfirm(false);
      if (onPurchaseSuccess) onPurchaseSuccess();
    } catch (err) {
      setError(err.response?.data?.message || t('forum.purchase_error', 'Có lỗi xảy ra khi mua'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const response = await forumApi.getPostById(post._id); // Just a ping to check auth if needed, but we can call download endpoint directly via window.open or fetch blob
      // Best way to download via authenticated API:
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forum/posts/${post._id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // If using Bearer, or relies on cookies
        },
        credentials: 'omit' // actually if using cookies we need include
      });
      // Currently using cookies, so simple window.open is not working if API checks JWT from cookie?
      // Wait, we can just use an anchor tag or fetch blob.

      const resBlob = await forumApi.downloadPost(post._id); // I need to create a download method in forumApi that returns blob or just open window
    } catch (err) {
      setError('Lỗi khi tải file');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadHref = `${import.meta.env.VITE_API_URL}/api/forum/posts/${post._id}/download`;

  return (
    <div className="w-full flex flex-col bg-white">
      <div className="p-6 flex flex-col gap-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-3">
            <Info size={18} className="mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {purchased ? (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-sm font-bold text-center flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              {t('forum.already_owned', 'Đã sở hữu')}
            </div>
            <a
              href={handleDownloadHref}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-colors"
            >
              <Download size={20} />
              {t('forum.download_source', 'Tải File Source Code')}
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                if (!user) window.location.href = '/login';
                else setShowConfirm(true);
              }}
              disabled={loading}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
              {loading ? t('forum.processing', 'Đang xử lý...') : `${t('forum.buy_now', 'Mua ngay')} - ${formatPrice(post.price)}`}
            </button>

            {/* <button className="w-full py-3 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
               <Heart size={18} /> Thêm vào yêu thích
            </button> */}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm font-bold text-slate-800 mb-3">{t('forum.you_will_get')}</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px]">✓</div> {t('forum.full_source_code')}</li>
            <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px]">✓</div> {t('forum.documentation')}</li>
            <li className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px]">✓</div> {t('forum.support_30_days')}</li>
          </ul>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handlePurchase}
        title={t('forum.confirm_transaction', 'Xác nhận giao dịch')}
        message={t('forum.confirm_message', 'Bạn sẽ thanh toán {{price}} từ số dư tài khoản để mua "{{title}}". Hành động này không thể hoàn tác.', { price: formatPrice(post.price), title: post.title })}
        confirmText={t('forum.confirm_pay', 'Xác nhận thanh toán')}
        cancelText={t('forum.cancel', 'Hủy bỏ')}
        isLoading={loading}
        type="primary"
      />
    </div>
  );
};

export default ForumPurchaseBox;
