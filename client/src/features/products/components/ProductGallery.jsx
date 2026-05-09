import React, { useState, useEffect } from 'react';
import siteConfig from '@/config/siteConfig';

const ProductGallery = ({ source }) => {
  const [activeImage, setActiveImage] = useState(source.thumbnail);
  const allImages = [source.thumbnail, ...(source.demoImages || [])].filter(Boolean);

  useEffect(() => {
    setActiveImage(source.thumbnail);
  }, [source.thumbnail]);

  return (
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
  );
};

export default ProductGallery;
