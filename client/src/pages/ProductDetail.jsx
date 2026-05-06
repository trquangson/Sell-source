import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, CheckCircle2, ChevronLeft, Image as ImageIcon } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin...</div>;
  if (!source) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sản phẩm.</div>;

  const allImages = [source.thumbnail, ...(source.demoImages || [])].filter(Boolean);

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Trở về cửa hàng
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          {/* Cột Trái: Hình ảnh */}
          <div className="w-full md:w-3/5 p-6 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50">
            <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden mb-4 border border-slate-200 shadow-inner relative">
              <img 
                src={`http://localhost:3000${activeImage}`} 
                alt="Product Demo" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary-500 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={`http://localhost:3000${img}`} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cột Phải: Thông tin & Mua hàng */}
          <div className="w-full md:w-2/5 p-8 flex flex-col">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{source.title}</h1>
              
              <div className="bg-primary-50 text-primary-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between border border-primary-100">
                <span className="font-medium">Giá sản phẩm:</span>
                <span className="text-2xl font-bold">{source.price.toLocaleString()} VNĐ</span>
              </div>

              <div className="prose prose-slate prose-sm mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Mô tả sản phẩm</h3>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {source.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-500 mr-2" /> Hỗ trợ cài đặt miễn phí
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-500 mr-2" /> Cập nhật trọn đời
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-500 mr-2" /> Đầy đủ mã nguồn và database
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button className="btn-primary py-4 text-lg w-full flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all">
                <ShoppingCart size={22} /> Mua ngay mã nguồn này
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
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
