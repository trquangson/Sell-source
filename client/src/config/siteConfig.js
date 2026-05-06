/**
 * Cấu hình chung của toàn bộ ứng dụng SellSource.
 * Thay đổi tại đây sẽ tự động áp dụng cho toàn bộ Frontend.
 */

const siteConfig = {
  // ===== Thông tin cơ bản =====
  name: 'Code247',
  tagline: 'Nền tảng mua bán mã nguồn uy tín',
  description:
    'Nền tảng mua bán mã nguồn chất lượng cao, an toàn và uy tín. Khám phá hàng ngàn mã nguồn hữu ích cho dự án của bạn ngay hôm nay.',

  // ===== Domain & API =====
  // Thay bằng domain thật khi deploy lên production
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // URL gốc để hiển thị ảnh/file từ server (KHÔNG có /api ở cuối)
  assetBaseUrl: import.meta.env.VITE_ASSET_URL || 'http://localhost:3000',

  // ===== Điều hướng (Navigation) =====
  navLinks: [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
  ],

  // ===== Mạng xã hội =====
  socials: {
    facebook: 'https://facebook.com/sellsource',
    twitter: 'https://twitter.com/sellsource',
    github: 'https://github.com/sellsource',
  },

  // ===== Danh mục sản phẩm =====
  // Khai báo một lần, dùng cho cả trang Products (filter) và Admin (dropdown)
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

  // ===== Nạp tiền / Thanh toán (SePay) =====
  payment: {
    bankName: 'MB Bank',
    accountNumber: '0000000000',  // Số tài khoản thực
    accountHolder: 'NGUYEN VAN A', // Tên chủ tài khoản
    // Prefix nội dung chuyển khoản, cộng với username để định danh
    // Ví dụ: "SS johndoe" → hệ thống tự nạp cho user johndoe
    transferPrefix: 'SS',
  },
};

export default siteConfig;
