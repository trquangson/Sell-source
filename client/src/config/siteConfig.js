const siteConfig = {
  // ===== Thông tin cơ bản =====
  name: 'Code247',
  tagline: '',
  description: '',

  // ===== Domain & API =====
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // URL gốc để hiển thị ảnh/file từ server (KHÔNG có /api ở cuối)
  assetBaseUrl: import.meta.env.VITE_ASSET_URL || 'http://localhost:3000',

  // ===== Điều hướng =====
  navLinks: [
    { path: '/', i18nKey: 'footer.home' },
    { path: '/products', i18nKey: 'footer.repo' },
  ],

  // ===== Mạng xã hội =====
  socials: {
    facebook: 'https://facebook.com/sellsource',
    twitter: 'https://twitter.com/sellsource',
    github: 'https://github.com/sellsource',
    zalo: 'https://zalo.me/0987654321',
  },

  // ===== Danh mục sản phẩm =====
  categories: ['Website', 'Tool / Script', 'Game', 'Mobile', 'Khác'],

  // ===== Chính sách =====
  policyLinks: [
    { path: '/huong-dan', i18nKey: 'footer.purchase_guide' },
    { path: '/chinh-sach-bao-mat', i18nKey: 'footer.privacy_policy' },
    { path: '/dieu-khoan', i18nKey: 'footer.terms_of_service' },
  ],

  // ===== SEO mặc định =====
  seo: {
    defaultTitle: 'SellSource',
    titleTemplate: '%s | SellSource',
    defaultImage: '/og-image.png',
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
