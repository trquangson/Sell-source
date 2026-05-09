import React, { useState, useEffect } from 'react';
import { adminApi } from '@/features/admin/api/adminApi';
import { Plus, Edit, Trash2, X, ToggleLeft, ToggleRight, AlertCircle, Tag } from 'lucide-react';
import siteConfig from '../../config/siteConfig';
import ConfirmModal from '@/shared/components/ConfirmModal';

const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Phần trăm (%)' },
  { value: 'fixed', label: 'Số tiền cố định (đ)' },
];

const SCOPES = [
  { value: 'all', label: 'Tất cả sản phẩm' },
  { value: 'categories', label: 'Theo danh mục' },
  { value: 'products', label: 'Sản phẩm cụ thể' },
];

const defaultForm = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscount: '',
  scope: 'all',
  applicableCategories: [],
  minOrderValue: '',
  usageLimit: '',
  perUserLimit: 1,
  expiryDate: '',
  isActive: true,
};

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Danh sách sản phẩm để chọn
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ ...defaultForm, applicableProducts: [] });
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCoupons();
      setCoupons(res.data || []);
    } catch {
      setError('Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await adminApi.getSources();
      setAllProducts(res.data || []);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({ ...defaultForm, applicableProducts: [], applicableCategories: [] });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditId(coupon._id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || '',
      scope: coupon.scope,
      applicableProducts: (coupon.applicableProducts || []).map(p => p._id || p),
      applicableCategories: coupon.applicableCategories || [],
      minOrderValue: coupon.minOrderValue || '',
      usageLimit: coupon.usageLimit || '',
      perUserLimit: coupon.perUserLimit || 1,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.substring(0, 10) : '',
      isActive: coupon.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleCategory = (cat) => {
    setFormData(prev => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(cat)
        ? prev.applicableCategories.filter(c => c !== cat)
        : [...prev.applicableCategories, cat],
    }));
  };

  const toggleProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: (prev.applicableProducts || []).includes(productId)
        ? prev.applicableProducts.filter(id => id !== productId)
        : [...(prev.applicableProducts || []), productId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await adminApi.updateCoupon(editId, formData);
      } else {
        await adminApi.createCoupon(formData);
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      // axiosClient interceptor unwraps error response body
      setError(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteCoupon(deleteId);
      setDeleteId(null);
      fetchCoupons();
    } catch {
      setError('Không thể xóa mã giảm giá');
    }
  };

  const handleToggle = async (coupon) => {
    try {
      await adminApi.toggleCouponStatus(coupon._id, { ...coupon, isActive: !coupon.isActive });
      fetchCoupons();
    } catch {
      setError('Không thể cập nhật trạng thái');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '-';

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Tag size={20} className="text-primary-600" /> Quản lý Mã Giảm Giá
        </h2>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          <Plus size={18} /> Thêm mã mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="p-4 font-medium">Mã</th>
                <th className="p-4 font-medium">Loại giảm</th>
                <th className="p-4 font-medium">Phạm vi</th>
                <th className="p-4 font-medium">Đã dùng</th>
                <th className="p-4 font-medium">Hết hạn</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Đang tải...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Chưa có mã giảm giá nào</td></tr>
              ) : coupons.map(coupon => (
                <tr key={coupon._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded text-sm tracking-wider">{coupon.code}</span>
                    {coupon.minOrderValue > 0 && (
                      <p className="text-xs text-slate-400 mt-1">Tối thiểu: {coupon.minOrderValue.toLocaleString()}đ</p>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {coupon.discountType === 'percentage' ? (
                      <span className="text-purple-700 font-semibold">{coupon.discountValue}%
                        {coupon.maxDiscount && <span className="text-xs text-slate-400 ml-1">(tối đa {coupon.maxDiscount.toLocaleString()}đ)</span>}
                      </span>
                    ) : (
                      <span className="text-green-700 font-semibold">{coupon.discountValue.toLocaleString()}đ</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${coupon.scope === 'all' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      coupon.scope === 'categories' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                        'bg-teal-50 text-teal-700 border-teal-100'
                      }`}>
                      {SCOPES.find(s => s.value === coupon.scope)?.label}
                    </span>
                    {coupon.scope === 'categories' && coupon.applicableCategories?.length > 0 && (
                      <p className="text-xs text-slate-400 mt-1">{coupon.applicableCategories.join(', ')}</p>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-600">
                    {coupon.usedCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : '∞'}
                    <p className="text-xs text-slate-400">Per-user: {coupon.perUserLimit}x</p>
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-600">{formatDate(coupon.expiryDate)}</td>
                  <td className="p-4">
                    <button onClick={() => handleToggle(coupon)} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${coupon.isActive ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-slate-600'}`}>
                      {coupon.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      {coupon.isActive ? 'Đang bật' : 'Đã tắt'}
                    </button>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-1">
                    <button onClick={() => openEditModal(coupon)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={17} /></button>
                    <button onClick={() => setDeleteId(coupon._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={17} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">{editId ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã giảm giá *</label>
                  <input name="code" value={formData.code} onChange={handleChange} required disabled={!!editId}
                    placeholder="VD: SALE20" className="input-field font-mono uppercase tracking-widest" />
                  {!editId && <p className="text-xs text-slate-400 mt-1">Mã sẽ tự động chuyển thành chữ hoa</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Loại giảm *</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange} className="input-field">
                    {DISCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Giá trị * {formData.discountType === 'percentage' ? '(%)' : '(đ)'}
                  </label>
                  <input name="discountValue" type="number" min="0" value={formData.discountValue} onChange={handleChange} required
                    placeholder={formData.discountType === 'percentage' ? '0–100' : '50000'} className="input-field" />
                </div>

                {formData.discountType === 'percentage' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giảm tối đa (đ) <span className="text-slate-400 font-normal">- tùy chọn</span></label>
                    <input name="maxDiscount" type="number" min="0" value={formData.maxDiscount} onChange={handleChange} placeholder="Bỏ trống = không giới hạn" className="input-field" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phạm vi áp dụng</label>
                  <select name="scope" value={formData.scope} onChange={handleChange} className="input-field">
                    {SCOPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Đơn tối thiểu (đ)</label>
                  <input name="minOrderValue" type="number" min="0" value={formData.minOrderValue} onChange={handleChange} placeholder="0 = không yêu cầu" className="input-field" />
                </div>

                {formData.scope === 'categories' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Danh mục áp dụng</label>
                    <div className="flex flex-wrap gap-2">
                      {siteConfig.categories.map(cat => (
                        <button type="button" key={cat} onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${formData.applicableCategories.includes(cat) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formData.scope === 'products' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Sản phẩm áp dụng
                      <span className="text-slate-400 font-normal ml-1">({(formData.applicableProducts || []).length} đã chọn)</span>
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                      {allProducts.length === 0 ? (
                        <p className="p-3 text-sm text-slate-400">Không có sản phẩm nào</p>
                      ) : allProducts.map(product => {
                        const selected = (formData.applicableProducts || []).includes(product._id);
                        return (
                          <button type="button" key={product._id} onClick={() => toggleProduct(product._id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${selected ? 'bg-primary-50' : ''}`}>
                            <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'bg-primary-600 border-primary-600' : 'border-slate-300'}`}>
                              {selected && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5l-.7.7 3.7 3.7 5.7-5.7z" /></svg>}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${selected ? 'text-primary-700' : 'text-slate-800'}`}>{product.title}</p>
                              <p className="text-xs text-slate-400">{product.price?.toLocaleString()}đ</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {(formData.applicableProducts || []).length === 0 && (
                      <p className="text-xs text-amber-600 mt-1.5">Chọn ít nhất 1 sản phẩm</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tổng lượt dùng</label>
                  <input name="usageLimit" type="number" min="0" value={formData.usageLimit} onChange={handleChange} placeholder="0 = không giới hạn" className="input-field" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giới hạn per-user</label>
                  <input name="perUserLimit" type="number" min="1" value={formData.perUserLimit} onChange={handleChange} className="input-field" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày hết hạn <span className="text-slate-400 font-normal">- tùy chọn</span></label>
                  <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} className="input-field" />
                </div>

                {editId && (
                  <div className="col-span-2 flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">Kích hoạt mã giảm giá này</label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors">
                  {editId ? 'Lưu thay đổi' : 'Tạo mã'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xóa mã giảm giá?"
        message="Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Xóa"
      />
    </div>
  );
};

export default AdminCouponsPage;
