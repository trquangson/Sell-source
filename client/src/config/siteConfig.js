const siteConfig = {
  // ===== Thông tin cơ bản =====
  name: 'Code247',
  tagline: 'Nền tảng mua bán mã nguồn uy tín',
  description:
    'Nền tảng mua bán mã nguồn chất lượng cao, an toàn và uy tín. Khám phá hàng ngàn mã nguồn hữu ích cho dự án của bạn ngay hôm nay.',

  // ===== Domain & API =====
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // URL gốc để hiển thị ảnh/file từ server (KHÔNG có /api ở cuối)
  assetBaseUrl: import.meta.env.VITE_ASSET_URL || 'http://localhost:3000',

  // ===== Điều hướng =====
  navLinks: [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
  ],

  // ===== Mạng xã hội =====
  socials: {
    facebook: 'https://facebook.com/sellsource',
    twitter: 'https://twitter.com/sellsource',
    github: 'https://github.com/sellsource',
    zalo: 'https://zalo.me/0987654321',
  },

  // ===== Danh mục sản phẩm =====
  categories: ['Website', 'Tool / Script', 'Game', 'Khác'],

  // ===== Chính sách =====
  policyLinks: [
    { name: 'Hướng dẫn mua hàng', path: '/huong-dan' },
    { name: 'Chính sách bảo mật', path: '/chinh-sach-bao-mat' },
    { name: 'Điều khoản dịch vụ', path: '/dieu-khoan' },
  ],

  // ===== SEO mặc định =====
  seo: {
    defaultTitle: 'SellSource – Mua bán mã nguồn chất lượng',
    titleTemplate: '%s | SellSource',
    defaultImage: '/og-image.png', // Đặt ảnh trong /public
  },

  // ===== Nạp tiền =====
  payment: {
    bankName: 'TPBank',
    accountNumber: '10002022890',
    accountHolder: 'TRAN VAN SON',
    transferPrefix: 'naptien',
  },
};

export default siteConfig;
