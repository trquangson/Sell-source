import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '@/features/products/api/productsApi';
import { billingApi } from '@/features/billing/api/billingApi';
import { ChevronLeft, Loader2 } from 'lucide-react';
import ProductGallery from '@/features/products/components/ProductGallery';
import PurchaseBox from '@/features/billing/components/PurchaseBox';
import ProductCard from '@/features/products/components/ProductCard';
import { useTranslation } from 'react-i18next';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [source, setSource] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await productsApi.getSource(id);
        const currentSource = res.data;
        setSource(currentSource);

        try {
          const allRes = await productsApi.getSources();
          const allSources = allRes.data || [];
          const related = allSources
            .filter(s => s.category === currentSource.category && s._id !== currentSource._id)
            .slice(0, 3);
          setRelatedProducts(related);
        } catch (e) {
          console.error('Lỗi lấy sản phẩm liên quan', e);
        }

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary-500" size={32} />
        <span className="text-text-muted text-sm animate-pulse">{t('detail.loading', 'Loading repository data...')}</span>
      </div>
    </div>
  );
  
  if (!source) return <div className="min-h-screen flex items-center justify-center bg-background text-text-muted">{t('detail.not_found', 'Không tìm thấy sản phẩm.')}</div>;

  return (
    <div className="py-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/products" className="inline-flex items-center text-sm text-text-muted hover:text-primary-600 mb-6 transition-colors font-bold">
          <ChevronLeft size={16} className="mr-1" /> {t('detail.back_btn', 'cd ..')}
        </Link>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row mb-12 relative">
          <ProductGallery source={source} />
          <PurchaseBox source={source} initialPurchased={alreadyPurchased} />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 animate-fade-in-up">
            <h3 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-3 inline-block pr-8">{t('detail.related', 'Related Repositories')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product._id} source={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
