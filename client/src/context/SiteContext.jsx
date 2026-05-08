import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import siteConfig from '../config/siteConfig';

const SiteContext = createContext();

export const useSite = () => useContext(SiteContext);

export const SiteProvider = ({ children }) => {
  const [config, setConfig] = useState(siteConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosClient.get('/public/settings');
        if (res && res.success) {
          const dbSettings = res.data || {};
          const mergedConfig = JSON.parse(JSON.stringify(siteConfig));

          // Merge thông tin chung
          if (dbSettings['site.name']) mergedConfig.name = dbSettings['site.name'];
          if (dbSettings['site.description']) mergedConfig.description = dbSettings['site.description'];

          // Cập nhật Document Title và Favicon (chỉ tác dụng trên client)
          if (dbSettings['site.name']) document.title = dbSettings['site.name'];
          if (dbSettings['site.favicon']) {
            mergedConfig.favicon = dbSettings['site.favicon'];
            const link = document.querySelector("link[rel~='icon']");
            if (link) {
              link.href = dbSettings['site.favicon'];
            }
          }

          // Merge thông tin thanh toán
          if (dbSettings['payment.bankName']) mergedConfig.payment.bankName = dbSettings['payment.bankName'];
          if (dbSettings['payment.accountNumber']) mergedConfig.payment.accountNumber = dbSettings['payment.accountNumber'];
          if (dbSettings['payment.accountHolder']) mergedConfig.payment.accountHolder = dbSettings['payment.accountHolder'];
          if (dbSettings['payment.transferPrefix']) mergedConfig.payment.transferPrefix = dbSettings['payment.transferPrefix'];

          // Merge mạng xã hội / liên hệ
          if (dbSettings['site.zalo']) mergedConfig.socials.zalo = dbSettings['site.zalo'];
          if (dbSettings['site.facebook']) mergedConfig.socials.facebook = dbSettings['site.facebook'];
          if (dbSettings['site.email']) mergedConfig.socials.email = dbSettings['site.email'];
          if (dbSettings['site.phone']) mergedConfig.socials.phone = dbSettings['site.phone'];

          setConfig(mergedConfig);
        }
      } catch (error) {
        console.error('Không thể tải cấu hình từ server, dùng mặc định:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Trong lúc đang fetch settings, có thể hiển thị màn hình loading hoặc render luôn bản mặc định.
  // Ở đây chọn render luôn bản mặc định để tránh màn hình trắng, khi fetch xong state sẽ re-render.
  return (
    <SiteContext.Provider value={{ config, loading }}>
      {children}
    </SiteContext.Provider>
  );
};
