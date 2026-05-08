# Marketplace Bán Mã Nguồn Tự Động (Sell-Source)

Hệ thống website thương mại điện tử chuyên nghiệp dành cho việc mua bán mã nguồn (Source Code), tài liệu số. Tích hợp hệ thống nạp tiền tự động qua ngân hàng và quản trị viên toàn diện.

---

## 🚀 Tính Năng Nổi Bật

### 👤 Dành cho Người Dùng
- **Xác thực tài khoản**: Đăng ký, đăng nhập, bảo mật với JWT và HttpOnly Cookie.
- **Nạp tiền tự động**: Tích hợp cổng thanh toán tự động qua SePay (Quét mã VietQR).
- **Mua hàng & Tải file**: Mua mã nguồn bằng số dư tài khoản, tự động cấp quyền tải file an toàn.
- **Hồ sơ cá nhân**: Quản lý thông tin, đổi mật khẩu, xem lịch sử giao dịch.

### 👑 Dành cho Admin
- **Dashboard**: Thống kê doanh thu (biểu đồ trực quan), số lượng sản phẩm, người dùng.
- **Quản lý sản phẩm**: Thêm, sửa, xoá mã nguồn, upload file nén an toàn.
- **Cấu hình hệ thống**: Thay đổi thông tin website, tài khoản ngân hàng trực tiếp trên giao diện Admin.

---

## 🛠 Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Giao diện tối giản, Clean UI)
- Lucide React (Icons)
- Axios (Xử lý API)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- JWT (JSON Web Token)
- Bcrypt (Mã hoá mật khẩu)

---

## 📦 Hướng Dẫn Cài Đặt
Sửa .env
(Đối với việc run bằng apache-xampp thì config vhosts và ssl, httpd include rewrite)
Dự án gồm 2 phần độc lập: `client` (Frontend) và `server` (Backend).
### 0. Cài đặt node và git
1. Cài đặt nodejs ver > 20.19.0
2. Cài git
3. Clone source code về máy

### 1. Cài đặt Backend (`/server`)

1. Di chuyển vào thư mục server:
   ```bash
   cd server
   ```
2. Cài đặt dependencies:
   ```bash
   npm install(npm ci)
   ```
3. Tạo file `.env` trong thư mục `server/` từ .env.example

4. Chạy server:
   ```bash
   npm start
   ```

### 2. Cài đặt Frontend (`/client`)

1. Di chuyển vào thư mục client:
   ```bash
   cd client
   ```
2. Cài đặt dependencies:
   ```bash
   npm install(npm ci)
   ```
3. Tạo file `.env` trong thư mục `client/` từ .env.example

4. Chạy frontend:
   ```bash
   npm run dev
   ```

---

## 🌐 Cấu Hình Webhook SePay (Nạp Tiền)

Để hệ thống nạp tiền tự động hoạt động khi deploy lên server thật:
1. Đảm bảo website của bạn đã cài đặt **SSL (HTTPS)**.
2. Cấu hình URL Webhook trên SePay trỏ về: `https://ten-mien-cua-ban.com/api/webhook/sepay`.
3. Phương thức gửi yêu cầu phải là **POST**.
4. Cấu hình `SePay Webhook API Key` trong phần Cài đặt Admin để xác thực dữ liệu gửi về.

---

## 🔒 Bảo Mật (Security)
- Toàn bộ logic nghiệp vụ (Business Logic) được tách biệt trong thư mục `services`.
- Token được lưu trữ trong HttpOnly Cookie để chống tấn công XSS.
- File mã nguồn tải lên được lưu ở thư mục riêng tư trên server và chỉ có thể tải xuống sau khi hệ thống xác thực người dùng đã mua sản phẩm.
