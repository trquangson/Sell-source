import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '@/features/products/api/productsApi';
import { billingApi } from '@/features/billing/api/billingApi';
import { ChevronLeft, Loader2 } from 'lucide-react';
import ProductGallery from '@/features/products/components/ProductGallery';
import PurchaseBox from '@/features/billing/components/PurchaseBox';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await productsApi.getSource(id);
        setSource(res.data);

        try {
          const checkRes = await billingApi.checkPurchased(id);
          setAlreadyPurchased(checkRes.purchased || false);
        } catch { /* chưa đăng nhập */ }
      } catch (error) {
        console.error('Lỗi lấy chi tiết sản phẩm', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-500" size={32} />
    </div>
  );
  
  if (!source) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Trở về cửa hàng
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <ProductGallery source={source} />
          <PurchaseBox source={source} initialPurchased={alreadyPurchased} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
