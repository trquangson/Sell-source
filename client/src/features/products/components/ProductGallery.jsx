import React, { useState, useEffect } from 'react';
import siteConfig from '@/config/siteConfig';

const ProductGallery = ({ source }) => {
  const [activeImage, setActiveImage] = useState(source.thumbnail);
  const allImages = [source.thumbnail, ...(source.demoImages || [])].filter(Boolean);

  useEffect(() => {
    setActiveImage(source.thumbnail);
  }, [source.thumbnail]);

  return (
    <div className="w-full md:w-3/5 p-6 border-b md:border-b-0 md:border-r border-border bg-surface-hover/50 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0"></div>
      
      <div className="aspect-[16/9] bg-surface rounded-xl overflow-hidden mb-4 border border-border shadow-inner relative group">
        <img
          src={`${siteConfig.assetBaseUrl}${activeImage}`}
          alt="Product Demo"
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary-500 shadow-[0_0_10px_rgba(8,145,178,0.1)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
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
