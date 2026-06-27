# 🥛 Milk Store E-commerce Platform

Dự án **Milk Store** là một hệ thống thương mại điện tử chuyên cung cấp các sản phẩm sữa và thực phẩm từ sữa. Hệ thống được chia thành 2 phần riêng biệt: **Backend** (PHP) cung cấp API và **Frontend** (React/JavaScript) cho giao diện người dùng và trang quản trị (Admin Dashboard).

## ✨ Tính năng nổi bật

### Khách hàng (Customer)
*   **Xác thực:** Đăng nhập, đăng ký, đăng nhập bằng mạng xã hội (Social Auth).
*   **Mua sắm:** Tìm kiếm sản phẩm, xem danh mục, thêm vào giỏ hàng.
*   **Thanh toán:** Quy trình thanh toán an toàn, áp dụng mã khuyến mãi (Promotion).
*   **Theo dõi đơn hàng:** Xem lịch sử mua hàng, trạng thái đơn hàng.
*   **Đánh giá:** Để lại nhận xét, đánh giá (Review) cho sản phẩm.
*   **Hỗ trợ thông minh:** Tích hợp Chatbot AI để tư vấn sản phẩm và hỗ trợ khách hàng.

### Quản trị viên (Admin)
*   **Quản lý sản phẩm & Danh mục:** Thêm, sửa, xóa sản phẩm phân loại theo danh mục.
*   **Quản lý nhập xuất/Kho hàng (Invoice/Supplier):** Quản lý nhà cung cấp và hóa đơn nhập khẩu.
*   **Quản lý thương hiệu:** Theo dõi các nhà sản xuất sữa (Manufacturer).
*   **Quản lý đơn hàng:** Xử lý đơn hàng, cập nhật trạng thái đơn hàng.
*   **Quản lý khuyến mãi:** Tạo và quản lý mã giảm giá, chương trình khuyến mãi.
*   **Quản lý người dùng:** Quản lý tài khoản khách hàng và nhân viên.
*   **Thống kê & Báo cáo:** Xem tổng quan doanh thu, số liệu hoạt động trên Dashboard.

## 🛠️ Trải nghiệm Công nghệ

### Backend (PHP API)
*   **Ngôn ngữ:** PHP thuần (Native PHP) chuẩn MVC.
*   **Cơ sở dữ liệu:** MySQL (thông qua PDO).
*   **Bảo mật:** JWT (JSON Web Tokens) thông qua `firebase/php-jwt`.
*   **Gửi email:** `phpmailer/phpmailer` hỗ trợ gửi email thông báo, xác nhận.
*   **API tích hợp:** Tích hợp API AI cho chatbot.

### Frontend (SPA - React/Vanilla JS)
*   **Giao diện:** HTML5, CSS3, tích hợp thư viện **Tailwind CSS**.
*   **Routing:** Custom routing cho Single Page Application (`app-routes.js`, `protected-routes.js`).
*   **Quản lý State:** Context API (VD: `cart-context.js`).
*   **Cấu trúc thư mục:** Chia trang độc lập (Admin, Auth, Customer, component dùng chung).
*   **Môi trường:** Đã được thiết lập sẵn Docker (`Dockerfile`) để dễ dàng triển khai.

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt Backend
1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện PHP qua Composer:
   ```bash
   composer install
   ```
3. Cấu hình cơ sở dữ liệu và thông tin biến môi trường tại `backend/config/config.php` (hoặc `.env` nếu có).
4. Khởi chạy server PHP:
   ```bash
   php -S localhost:8000 -t public
   ```

### 2. Cài đặt Frontend
1. Di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt các dependencies:
   ```bash
   npm install
   ```
3. Khởi chạy dự án:
   ```bash
   npm start
   # hoặc khởi chạy bằng Docker nếu đã có image
   ```

## 📂 Kiến trúc thư mục

```text
php_milk_project/
├── backend/                  # Mã nguồn API (PHP)
│   ├── config/               # Cấu hình hệ thống (Database, environment...)
│   ├── public/               # Thư mục public (chia sẻ file tĩnh, entry point index.php)
│   ├── src/                  # Mã nguồn chính của Backend
│   │   ├── Controllers/      # Controller xử lý logic (Admin, Customer, Auth...)
│   │   ├── Database/         # Kết nối CSDL (Connection.php)
│   │   ├── Helpers/          # Các hàm hỗ trợ dùng chung
│   │   ├── Models/           # Tương tác CSDL (Product, User, Order...)
│   │   ├── Routes/           # Định nghĩa các Router (api.php, AdminRoutes, CustomerRoutes...)
│   │   └── Services/         # Dịch vụ bên ngoài (AIClient, Mailer...)
│   └── vendor/               # Thư viện quản lý bởi Composer (firebase/php-jwt, phpmailer)
│
└── frontend/                 # Mã nguồn Giao diện (React/JS)
    ├── public/               # File tĩnh (index.html, hình ảnh...)
    ├── src/                  # Mã nguồn chính của Frontend
    │   ├── component/        # Các thành phần giao diện dùng chung (header, footer, chatbot...)
    │   ├── context/          # Quản lý State toàn cục (cart-context...)
    │   ├── pages/            # Các trang giao diện (chia theo admin, auth, customer)
    │   ├── routes/           # Định nghĩa các đường dẫn Frontend
    │   └── styles/           # File CSS/Tailwind
    ├── Dockerfile            # Cấu hình Docker
    └── package.json          # Quản lý thư viện Frontend
```

