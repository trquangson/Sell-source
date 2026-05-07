import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, CheckCircle2, ChevronLeft, Tag, Loader2, ShoppingBag, XCircle } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const ProductDetail = () => {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState(null); // null | { discountAmount, finalPrice, ... }
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const fetchSourceDetail = async () => {
      try {
        const res = await axiosClient.get(`/sources/${id}`);
        setSource(res.data);
        setActiveImage(res.data.thumbnail);
      } catch (error) {
        console.error('Lỗi lấy chi tiết sản phẩm', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSourceDetail();
  }, [id]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponResult(null);

    try {
      const res = await axiosClient.post('/coupons/validate', {
        code: couponCode.trim(),
        productId: source._id,
        productPrice: source.price,
        productCategory: source.category
      });
      // axiosClient interceptor unwraps response.data, nên res = { success, data: {...} }
      setCouponResult(res.data);
    } catch (error) {
      // axiosClient interceptor reject với response body, nên error = { success, message }
      setCouponError(error.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponResult(null);
    setCouponError('');
    setCouponCode('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );
  if (!source) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sản phẩm.</div>;

  const allImages = [source.thumbnail, ...(source.demoImages || [])].filter(Boolean);
  const displayPrice = couponResult ? couponResult.finalPrice : source.price;

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Trở về cửa hàng
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Cột Trái: Hình ảnh */}
          <div className="w-full md:w-3/5 p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50">
            <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden mb-4 border border-slate-200 shadow-inner">
              <img
                src={`${siteConfig.assetBaseUrl}${activeImage}`}
                alt="Product Demo"
                className="w-full h-full object-cover"
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary-500 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={`${siteConfig.assetBaseUrl}${img}`} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cột Phải: Thông tin & Mua hàng */}
          <div className="w-full md:w-2/5 p-8 flex flex-col">
            <div className="flex-1">
              {/* Danh mục + lượt mua */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  {source.category || 'Khác'}
                </span>
                {source.purchaseCount > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <ShoppingBag size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">{source.purchaseCount.toLocaleString()}</span> lượt mua
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-5 leading-tight">{source.title}</h1>

              {/* Hiển thị giá */}
              <div className="bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl mb-6">
                <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">Giá sản phẩm</p>
                {couponResult ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-primary-600">
                      {couponResult.finalPrice.toLocaleString()}đ
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      {source.price.toLocaleString()}đ
                    </span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      -{couponResult.discountAmount.toLocaleString()}đ
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-900">
                    {source.price.toLocaleString()}đ
                  </span>
                )}
              </div>

              <div className="prose prose-slate prose-sm mb-6">
                <h3 className="text-base font-bold text-slate-800 mb-2">Mô tả sản phẩm</h3>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed text-sm">
                  {source.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6">
                <li className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 size={17} className="text-green-500 mr-2 flex-shrink-0" /> Hỗ trợ cài đặt miễn phí
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 size={17} className="text-green-500 mr-2 flex-shrink-0" /> Cập nhật trọn đời
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 size={17} className="text-green-500 mr-2 flex-shrink-0" /> Đầy đủ mã nguồn và database
                </li>
              </ul>
            </div>

            {/* Khu vực mua hàng */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              {/* Ô nhập mã giảm giá */}
              {!couponResult ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Tag size={15} /> Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Nhập mã của bạn..."
                      className="flex-1 px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {couponLoading ? <Loader2 size={16} className="animate-spin" /> : 'Áp dụng'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                      <XCircle size={15} /> {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-semibold">Mã <span className="font-mono">{couponResult.code}</span> đã được áp dụng</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-red-500 transition-colors">
                    <XCircle size={18} />
                  </button>
                </div>
              )}

              <button className="btn-primary py-4 text-lg w-full flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all">
                <ShoppingCart size={22} />
                Mua ngay - {displayPrice.toLocaleString()}đ
              </button>
              <p className="text-center text-xs text-slate-400">
                Giao dịch an toàn và bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
