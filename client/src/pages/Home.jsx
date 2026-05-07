import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, ArrowRight, Code, Shield, Zap } from 'lucide-react';
import siteConfig from '../config/siteConfig';

const Home = () => {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axiosClient.get('/sources');
        setSources((res.data || []).slice(0, 3));
      } catch (error) {
        console.error('Lỗi lấy danh sách', error);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="font-sans overflow-hidden">
      {/* Hero Section với Gradient Background và Animation */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 pt-24 pb-32 text-center px-4 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl mix-blend-overlay animate-fade-in"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl mix-blend-overlay animate-fade-in animation-delay-200"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium text-primary-200 animate-fade-in-up">
            Nền tảng chia sẻ mã nguồn chất lượng
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-fade-in-up animation-delay-100">
            Khởi tạo dự án nhanh hơn với <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">{siteConfig.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Hàng trăm mã nguồn đa dạng, được kiểm duyệt kỹ càng, chuẩn SEO và tối ưu hiệu suất, sẵn sàng để bạn sử dụng ngay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link to="/products" className="bg-primary-500 hover:bg-primary-600 text-white text-lg px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 hover:-translate-y-1">
              Khám Phá Ngay <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center hover:-translate-y-1">
              Đăng ký tài khoản
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors animate-fade-in-up">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 hover:rotate-0 transition-transform">
              <Code size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Code Chuẩn Clean</h3>
            <p className="text-slate-500">Mã nguồn được viết sạch sẽ, dễ dàng đọc hiểu và mở rộng cho các lập trình viên.</p>
          </div>
          <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors animate-fade-in-up animation-delay-100">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 -rotate-3 hover:rotate-0 transition-transform">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Bảo Mật Cao</h3>
            <p className="text-slate-500">Kiểm duyệt kỹ càng trước khi đăng bán, loại bỏ hoàn toàn mã độc và shell ẩn.</p>
          </div>
          <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors animate-fade-in-up animation-delay-200">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 hover:rotate-0 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Triển Khai Nhanh</h3>
            <p className="text-slate-500">Tiết kiệm hàng tuần làm việc. Mua xong tải về setup chỉ trong vài nốt nhạc.</p>
          </div>
        </div>
      </section>

      {/* Product Grid - Featured */}
      <main className="max-w-6xl mx-auto px-4 py-20 bg-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Sản phẩm mới nhất</h2>
            <p className="text-slate-500 mt-2 text-lg">Những siêu phẩm vừa hạ cánh</p>
          </div>
          <Link to="/products" className="mt-4 md:mt-0 text-primary-600 font-bold hover:text-primary-700 flex items-center gap-2 bg-primary-50 px-5 py-2.5 rounded-full hover:bg-primary-100 transition-colors">
            Xem tất cả <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sources.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
              Chưa có sản phẩm nào
            </div>
          ) : (
            sources.map((source, index) => (
              <div
                key={source._id}
                className="card overflow-hidden group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={source.thumbnail ? `${siteConfig.assetBaseUrl}${source.thumbnail}` : 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={source.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm border border-white/10">
                    {source.category || 'Khác'}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-sm font-extrabold text-primary-600 shadow-lg border border-white">
                    {source.price.toLocaleString()}đ
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {source.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {source.description}
                  </p>

                  <Link
                    to={`/product/${source._id}`}
                    className="w-full py-3 px-4 bg-slate-50 group-hover:bg-primary-600 text-slate-700 group-hover:text-white rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-md border border-slate-200 group-hover:border-primary-600"
                  >
                    <ShoppingCart size={18} />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
