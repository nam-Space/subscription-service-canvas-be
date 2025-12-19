# 💳 Subscription Service – Canvas Backend (Microservice)

## 📌 Tổng quan

**Subscription Service** là một **microservice độc lập** trong hệ thống **Canvas**, chịu trách nhiệm quản lý toàn bộ nghiệp vụ liên quan đến **gói Premium, thanh toán và đăng ký dịch vụ trả phí** của người dùng.

Service này đảm nhiệm việc tích hợp **Paypal Payment**, xử lý vòng đời thanh toán (order → capture), lưu trữ lịch sử giao dịch và cập nhật trạng thái **Free / Premium** của người dùng.

Việc tách Subscription Service thành một service riêng giúp hệ thống:

* Dễ mở rộng các hình thức thanh toán
* Tăng tính bảo mật cho nghiệp vụ tài chính
* Dễ bảo trì và audit

🔗 Repository: [https://github.com/nam-Space/subscription-service-canvas-be](https://github.com/nam-Space/subscription-service-canvas-be)

---

## 🎯 Mục tiêu của service

* Quản lý gói **Subscription / Premium** một cách độc lập
* Tích hợp và xử lý thanh toán Paypal chuẩn production
* Lưu trữ lịch sử giao dịch rõ ràng, minh bạch
* Cho phép mở rộng thêm Stripe, VNPay, Momo… trong tương lai
* Tuân thủ tư duy **Single Responsibility** trong Microservice Architecture

---

## 🧩 Vai trò trong kiến trúc Microservice

```
Frontend (Canvas FE)
        │
        ▼
API Gateway Service
        │
        ▼
Subscription Service  ──► Paypal API
                │
                └──────► Database (Subscription / Transaction)
```

* Frontend **không giao tiếp trực tiếp** với Subscription Service
* Mọi request đều thông qua **API Gateway**
* Gateway đảm nhiệm xác thực, routing và logging

---

## 🚀 Công nghệ sử dụng

### Backend Core

* **Node.js** – Runtime
* **Express.js** – RESTful API
* **JavaScript / TypeScript** (tuỳ cấu hình repo)

### Payment

* **Paypal REST API**
* Order & Capture Payment Flow

### Database

* **MongoDB** – Lưu thông tin subscription & transaction
* **Mongoose** – ODM

### Khác

* **dotenv** – Quản lý biến môi trường
* **UUID / ObjectId** – Định danh giao dịch
* **Axios** – Giao tiếp với Paypal API

---

## 📂 Cấu trúc thư mục

```bash
subscription-service-canvas-be/
├── src/
│   ├── controllers/          # Xử lý request thanh toán
│   ├── routes/               # Định nghĩa API endpoints
│   ├── services/             # Business logic subscription & payment
│   ├── models/               # Schema MongoDB
│   ├── middlewares/          # Auth, validate, error handling
│   ├── utils/                # Paypal helpers
│   ├── config/               # Paypal & DB config
│   └── app.js / server.js
│
├── .env
├── package.json
└── README.md
```

---

## 🧾 Đối tượng dữ liệu chính

### 1️⃣ Subscription

* `userId`: Người đăng ký
* `plan`: Gói (Monthly / Yearly)
* `status`: active / expired / cancelled
* `startDate`
* `endDate`

### 2️⃣ Transaction

* `transactionId`
* `orderId` (Paypal)
* `amount`
* `currency`
* `status`: pending / completed / failed
* `createdAt`

---

## 💼 Các chức năng chính

### 1️⃣ Tạo Order thanh toán

* Khởi tạo order Paypal
* Trả về approval link cho frontend

```http
POST /subscriptions/create-order
```

---

### 2️⃣ Capture Payment

* Capture order sau khi user thanh toán
* Xác nhận giao dịch thành công
* Cập nhật trạng thái subscription

```http
POST /subscriptions/capture-order
```

---

### 3️⃣ Kiểm tra trạng thái Subscription

* Xác định user là Free hay Premium

```http
GET /subscriptions/status
```

---

### 4️⃣ Lấy lịch sử giao dịch

* Dành cho user hoặc admin

```http
GET /subscriptions/transactions
```

---

## 🔐 Authentication & Authorization

* Request phải đi qua **API Gateway**
* Gateway inject `userId` và `role`
* Subscription Service kiểm tra:

  * Quyền user
  * Trạng thái subscription

---

## 🔄 Luồng thanh toán Paypal

```
User → Frontend → API Gateway → Subscription Service → Paypal API
                                                   ↓
                                             Capture Order
                                                   ↓
                                             Update Database
```

---

## ⚙️ Cấu hình môi trường (.env)

```env
PORT=4004

# Database
MONGODB_URI=mongodb://localhost:27017/canvas_subscription

# Paypal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

---

## ▶️ Cài đặt & Chạy service

### 1️⃣ Clone repository

```bash
git clone https://github.com/nam-Space/subscription-service-canvas-be.git
cd subscription-service-canvas-be
```

---

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

---

### 3️⃣ Chạy development

```bash
npm run dev
```

Service chạy tại:

```
http://localhost:4004
```

---

## 🧪 Test & Sandbox

* Sử dụng **Paypal Sandbox Account**
* Test create order & capture
* Kiểm tra log transaction

---

## 🔒 Bảo mật & Best Practices

* Không log thông tin nhạy cảm
* Validate amount & currency
* Kiểm tra idempotency khi capture
* Phân quyền API rõ ràng

---

## 🚀 Hướng phát triển tương lai

* Thêm Stripe / VNPay / Momo
* Gia hạn subscription tự động
* Webhook Paypal
* Invoice & billing history

---

## 👨‍💻 Tác giả

* **Nam Nguyen**
* GitHub: [https://github.com/nam-Space](https://github.com/nam-Space)

---

## 📄 License

Service được xây dựng cho mục đích **học tập, nghiên cứu kiến trúc microservice và nghiệp vụ thanh toán trong hệ thống Canvas**.
