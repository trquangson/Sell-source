import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '@/features/products/api/productsApi';
import { billingApi } from '@/features/billing/api/billingApi';
import siteConfig from '@/config/siteConfig';
import { ShoppingCart, CheckCircle2, Tag, Loader2, ShoppingBag, XCircle, Download, AlertCircle, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '@/shared/components/ConfirmModal';

const PurchaseBox = ({ source, initialPurchased }) => {
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [alreadyPurchased, setAlreadyPurchased] = useState(initialPurchased);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponResult(null);

    try {
      const res = await productsApi.validateCoupon({
        code: couponCode.trim(),
        productId: source._id,
        productPrice: source.price,
        productCategory: source.category
      });
      setCouponResult(res.data);
    } catch (error) {
      setCouponError(error.message || t('detail.coupon_error'));
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponError('');
    setCouponCode('');
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    setPurchaseError('');
    try {
      await billingApi.purchase({
        sourceId: source._id,
        couponCode: couponResult ? couponResult.code : null
      });
      setAlreadyPurchased(true);
      setPurchaseSuccess(true);
    } catch (error) {
      const msg = error.message || t('detail.purchase_error');
      if (msg.includes('Số dư') || msg.includes('không đủ')) {
        setPurchaseError(`${msg} - ${t('detail.deposit_now')}.`);
      } else if (msg.includes('đăng nhập') || msg.includes('phiên') || msg.includes('hết hạn')) {
        setPurchaseError(t('detail.login_required'));
      } else {
        setPurchaseError(msg);
      }
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(`${siteConfig.apiBaseUrl}/purchases/download/${source._id}`, '_blank');
  };

  const displayPrice = couponResult ? couponResult.finalPrice : source.price;

  return (
    <div className="w-full md:w-2/5 p-8 flex flex-col bg-white">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary-600 bg-primary-100 px-2.5 py-1 rounded border border-primary-200">
            {source.category ? t(`categories.${source.category}`) : t('common.package')}
          </span>
          {source.purchaseCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono font-medium">
              <ShoppingBag size={14} className="text-text-muted/70" />
              <span className="font-bold text-text-main">{source.purchaseCount.toLocaleString()}</span> {t('product.installs')}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-5 leading-tight">{source.title}</h1>

        <div className="bg-surface-hover border border-border px-5 py-4 rounded-xl mb-6 relative overflow-hidden shadow-inner">
          <p className="text-[10px] text-text-muted font-mono font-bold mb-1 uppercase tracking-widest">{t('detail.license_fee')}</p>
          {couponResult ? (
            <div className="flex items-baseline gap-3 relative z-10">
              <span className="text-3xl font-extrabold text-primary-600 font-mono">{couponResult.finalPrice.toLocaleString()}đ</span>
              <span className="text-lg text-text-muted line-through font-mono">{source.price.toLocaleString()}đ</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                -{couponResult.discountAmount.toLocaleString()}đ
              </span>
            </div>
          ) : (
            <span className="text-3xl font-extrabold text-text-main font-mono relative z-10">{source.price.toLocaleString()}<span className="text-lg font-semibold ml-0.5">đ</span></span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-text-muted whitespace-pre-line leading-relaxed text-sm bg-background p-4 rounded-xl border border-border font-mono text-[13px] font-medium">{source.description}</p>
        </div>

        <ul className="space-y-3 mb-6 text-xs font-medium">
          <li className="flex items-center text-text-muted"><CheckCircle2 size={16} className="text-emerald-500 mr-2 flex-shrink-0" /> {t('detail.f1')}</li>
          <li className="flex items-center text-text-muted"><CheckCircle2 size={16} className="text-emerald-500 mr-2 flex-shrink-0" /> {t('detail.f2')}</li>
          <li className="flex items-center text-text-muted"><CheckCircle2 size={16} className="text-emerald-500 mr-2 flex-shrink-0" /> {t('detail.f3')}</li>
        </ul>
      </div>

      <div className="pt-6 border-t border-border space-y-4">
        {alreadyPurchased ? (
          <div className="space-y-3">
            {purchaseSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg text-sm font-bold shadow-sm">
                <CheckCircle2 size={16} /> {t('detail.transaction_verified')}
              </div>
            )}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all"
            >
              <Download size={18} /> {t('detail.download_source')}
            </button>
            <p className="text-center text-xs text-text-muted font-bold">{t('detail.license_active')}</p>
          </div>
        ) : (
          <>
            {!couponResult ? (
              <div>
                <label className="block text-xs font-mono font-bold text-text-muted mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                  <Tag size={14} /> {t('detail.promo_code')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="Enter code..."
                    className="flex-1 px-4 py-2.5 border border-border bg-white rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-text-main transition-all shadow-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white border border-primary-100 hover:border-primary-600 rounded-xl text-sm font-bold font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {couponLoading ? <Loader2 size={16} className="animate-spin" /> : t('detail.apply_coupon')}
                  </button>
                </div>
                {couponError && (
                  <p className="mt-2 text-xs text-red-500 font-mono flex items-center gap-1.5 font-bold"><XCircle size={14} /> {couponError}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                  <span className="text-sm font-mono font-bold">{t('detail.coupon_applied', { code: couponResult.code })}</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-text-muted hover:text-red-500 transition-colors"><XCircle size={16} /></button>
              </div>
            )}

            {purchaseError && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm font-bold shadow-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p>{purchaseError}</p>
                  {purchaseError.includes('nạp') && (
                    <Link to="/topup" className="font-extrabold text-primary-600 hover:text-primary-700 underline mt-1 inline-block">{t('detail.deposit_now')}</Link>
                  )}
                  {purchaseError.includes('đăng nhập') && (
                    <Link to="/login" className="font-extrabold text-primary-600 hover:text-primary-700 underline mt-1 inline-block">{t('detail.login')}</Link>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsConfirmOpen(true)}
              disabled={purchaseLoading}
              className="btn-primary py-4 text-base w-full flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(8,145,178,0.39)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.23)] transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {purchaseLoading ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
              {purchaseLoading ? t('detail.processing', 'Processing...') : `${t('detail.buy_now')} ${displayPrice.toLocaleString()}đ`}
            </button>
            <p className="text-center text-xs text-text-muted font-mono flex items-center justify-center gap-1.5 font-bold">
              <CheckCircle2 size={12} className="text-emerald-500" /> {t('detail.secure_transaction', 'Secure transaction via Code247')}
            </p>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={t('detail.buy_confirm_title', 'Xác nhận mua hàng')}
        message={t('detail.buy_confirm_message', { price: `${displayPrice.toLocaleString()}đ` })}
        confirmText={t('detail.buy_now', 'Mua ngay')}
        cancelText={t('detail.cancel_btn', 'Hủy')}
        type="primary"
        onConfirm={() => {
          setIsConfirmOpen(false);
          handlePurchase();
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default PurchaseBox;
