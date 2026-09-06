# 🛒 Zenith Store — Full-Stack E-Commerce Application

A production-ready full-stack e-commerce web application built with **React**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**. Features complete purchase lifecycle management, real payment integration, and an admin dashboard.

🔗 **Live Demo:** [zenith-store-eight.vercel.app](https://zenith-store-eight.vercel.app)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schemas](#-database-schemas)
- [API Endpoints](#-api-endpoints)
- [Key Features & Flows](#-key-features--flows)
  - [Authentication Flow](#1-authentication-flow)
  - [Cart Flow](#2-cart-flow)
  - [Checkout & Payment Flow](#3-checkout--payment-flow)
  - [Order Lifecycle (State Machine)](#4-order-lifecycle-state-machine)
  - [Image Upload Flow](#5-image-upload-flow)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework with type safety |
| Vite | Fast dev server and bundler |
| React Router DOM v6 | Client-side routing |
| Zustand | Lightweight global state (cart) |
| Framer Motion | Animations and transitions |
| Tailwind CSS + Shadcn/UI | Styling and accessible components |
| React Hook Form + Zod | Form management and validation |
| Cashfree JS SDK | Payment gateway checkout popup |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database with ODM |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| Cloudinary + Multer | Cloud image storage and upload handling |
| cookie-parser | HTTP cookie parsing (refresh tokens) |

---

## 📁 Project Structure

```
zenith-store/
│
├── backend/                        # Node.js + Express backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification + role guard
│   │   └── uploadMiddleware.js      # Multer + Cloudinary config
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Product.js              # Product schema
│   │   ├── Order.js                # Order + OrderItem schema
│   │   ├── Cart.js                 # Cart schema
│   │   └── RefreshToken.js         # Refresh token with TTL index
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── productRoutes.js        # Product CRUD
│   │   ├── orderRoutes.js          # Order management
│   │   ├── cartRoutes.js           # Cart sync endpoints
│   │   ├── paymentRoutes.js        # Cashfree integration + webhook
│   │   └── adminRoutes.js          # Admin dashboard routes
│   ├── services/
│   │   └── orderStateMachine.js    # Valid order status transitions
│   └── server.js                   # Express app entry point
│
├── src/                            # React + TypeScript frontend
│   ├── components/
│   │   ├── Layout.tsx              # Navbar + page wrapper
│   │   ├── ProductCard.tsx         # Reusable product card
│   │   ├── ProtectedRoute.tsx      # Auth + admin route guard
│   │   └── ui/                     # Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx         # Global auth state + methods
│   ├── lib/
│   │   ├── api.ts                  # fetchAPI with auto token refresh
│   │   └── utils.ts                # Helper utilities
│   ├── pages/
│   │   ├── HomePage.tsx            # Product listing + search + filter
│   │   ├── ProductDetailPage.tsx   # Single product view
│   │   ├── CartPage.tsx            # Cart management
│   │   ├── CheckoutPage.tsx        # Shipping form + Cashfree payment
│   │   ├── OrderSuccessPage.tsx    # Post-payment confirmation
│   │   ├── ProfilePage.tsx         # User profile + order history
│   │   ├── LoginPage.tsx           # Login form
│   │   ├── SignUpPage.tsx          # Registration form
│   │   ├── AdminDashboard.tsx      # Stats + recent activity
│   │   ├── AdminProducts.tsx       # Product CRUD UI
│   │   ├── AdminOrders.tsx         # Order status management
│   │   └── AdminUsers.tsx          # User moderation
│   ├── stores/
│   │   └── useCartStore.ts         # Zustand cart store (persisted)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── App.tsx                     # Router + route definitions
│
├── package.json                    # Frontend dependencies
├── vite.config.ts                  # Vite configuration
└── tailwind.config.js              # Tailwind configuration
```

---

## 🗄 Database Schemas

### User
```
Collection: users
─────────────────────────────────────────────────────
Field          Type        Constraints
─────────────────────────────────────────────────────
_id            ObjectId    Auto-generated
full_name      String      Required
email          String      Required, Unique, Indexed
password       String      Required (bcrypt hashed)
role           String      Enum: ['user', 'admin']  Default: 'user'
isActive       Boolean     Default: true
createdAt      Date        Auto (timestamps)
updatedAt      Date        Auto (timestamps)
─────────────────────────────────────────────────────
Note: Password is hashed in a Mongoose pre-save hook.
      Passwords are never returned in API responses.
```

### Product
```
Collection: products
─────────────────────────────────────────────────────
Field            Type        Constraints
─────────────────────────────────────────────────────
_id              ObjectId    Auto-generated
name             String      Required
description      String      Optional
price            Number      Required
category         String      Default: 'General'
image_url        String      Cloudinary CDN URL
image_public_id  String      Cloudinary ID (for deletion)
stock_quantity   Number      Default: 0
createdAt        Date        Auto (timestamps)
updatedAt        Date        Auto (timestamps)
─────────────────────────────────────────────────────
```

### Order
```
Collection: orders
─────────────────────────────────────────────────────
Field              Type        Constraints
─────────────────────────────────────────────────────
_id                ObjectId    Auto-generated
user_id            ObjectId    Ref: 'User', Required
order_items        Array       Embedded OrderItem documents
  └ product_id     ObjectId    Ref: 'Product', Required
  └ quantity       Number      Required
  └ price          Number      Required (snapshot at purchase time)
total_price        Number      Required
status             String      Enum: ['Pending','Paid','Shipped',
                               'Delivered','Cancelled']  Default: 'Pending'
cashfreeOrderId    String      Unique, Sparse (links to payment gateway)
webhookProcessed   Boolean     Default: false (prevents duplicate updates)
createdAt          Date        Auto (timestamps)
updatedAt          Date        Auto (timestamps)
─────────────────────────────────────────────────────
```

### Cart
```
Collection: carts
─────────────────────────────────────────────────────
Field          Type        Constraints
─────────────────────────────────────────────────────
_id            ObjectId    Auto-generated
user_id        ObjectId    Ref: 'User', Required, Indexed
cart_items     Array       Embedded CartItem documents
  └ product_id ObjectId    Ref: 'Product', Required
  └ quantity   Number      Required, Min: 1
  └ price      Number      Required
createdAt      Date        Auto (timestamps)
updatedAt      Date        Auto (timestamps)
─────────────────────────────────────────────────────
Note: One cart document per user. Updated on every cart change.
```

### RefreshToken
```
Collection: refreshtokens
─────────────────────────────────────────────────────
Field          Type        Constraints
─────────────────────────────────────────────────────
_id            ObjectId    Auto-generated
user_id        ObjectId    Ref: 'User', Required
token          String      Required (the raw JWT refresh token)
expiresAt      Date        Required
createdAt      Date        Auto (timestamps)
─────────────────────────────────────────────────────
Note: TTL index on expiresAt — MongoDB automatically deletes
      expired tokens. Stored in DB so logout can revoke them.
```

---

## 📡 API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ None | Register new user. Returns access token + sets refresh cookie |
| `POST` | `/auth/login` | ❌ None | Login with email/password. Returns access token + sets refresh cookie |
| `POST` | `/auth/refresh` | 🍪 Cookie | Use refresh token cookie to get a new access token |
| `POST` | `/auth/logout` | 🍪 Cookie | Delete refresh token from DB + clear cookie |
| `GET` | `/auth/profile` | 🔑 Bearer | Get the currently logged-in user's profile |

**Register / Login Response Body:**
```json
{
  "_id": "64abc...",
  "full_name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "<access_token>"
}
```

---

### 📦 Products — `/api/products`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/products` | ❌ None | List products with optional filters |
| `GET` | `/products/:id` | ❌ None | Get a single product by ID |
| `POST` | `/products` | 👑 Admin | Create a new product (supports image upload) |
| `PUT` | `/products/:id` | 👑 Admin | Update a product (replaces image if new one provided) |
| `DELETE` | `/products/:id` | 👑 Admin | Delete product + remove image from Cloudinary |

**GET /products Query Parameters:**
```
?search=laptop       → Filter by product name (regex, case-insensitive)
?category=Electronics → Filter by category
?page=1              → Page number (default: 1)
?limit=12            → Items per page (default: 12)
```

**GET /products Response:**
```json
{
  "products": [...],
  "page": 1,
  "pages": 5,
  "total": 60
}
```

**POST/PUT /products Request (multipart/form-data):**
```
name            → string (required)
price           → number (required)
description     → string
category        → string
stock_quantity  → number
image           → file (optional, uploaded to Cloudinary)
image_url       → string (optional, if no file uploaded)
```

---

### 🛒 Cart — `/api/cart`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/cart` | 🔑 Bearer | Get the logged-in user's cart (creates one if not exists) |
| `PUT` | `/cart` | 🔑 Bearer | Overwrite cart items (upsert — used on every cart change) |
| `POST` | `/cart/sync` | 🔑 Bearer | Sync/overwrite cart (used after login to push guest cart) |

**PUT /cart Request Body:**
```json
{
  "cart_items": [
    { "product_id": "64abc...", "quantity": 2, "price": 29.99 }
  ]
}
```

---

### 📋 Orders — `/api/orders`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/orders` | 🔑 Bearer | Create order using MongoDB transaction (atomic stock deduction) |
| `GET` | `/orders/myorders` | 🔑 Bearer | Get all orders for the current user |
| `GET` | `/orders/:id` | 🔑 Bearer | Get a single order by ID |
| `GET` | `/orders` | 👑 Admin | Get all orders (admin only) |
| `PUT` | `/orders/:id/status` | 👑 Admin | Update order status (validated by state machine) |

**POST /orders Request Body:**
```json
{
  "order_items": [
    { "product_id": "64abc...", "quantity": 2, "price": 29.99 }
  ],
  "total_price": 64.77,
  "cashfreeOrderId": "order_1721234567890"
}
```

**PUT /orders/:id/status Request Body:**
```json
{
  "status": "Shipped"
}
```

---

### 💳 Payments — `/api/payments`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/payments/create-order` | 🔑 Bearer | Create a Cashfree order, returns payment session ID |
| `POST` | `/payments/webhook` | ❌ HMAC Verified | Cashfree webhook — marks order as 'Paid' on success |

**POST /payments/create-order Request Body:**
```json
{
  "order_items": [...],
  "total_price": 64.77,
  "customer_details": {
    "customer_id": "64abc...",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "9876543210"
  }
}
```

**POST /payments/create-order Response:**
```json
{
  "payment_session_id": "session_abc123...",
  "order_id": "order_1721234567890"
}
```

> **Webhook Security:** The `/payments/webhook` endpoint verifies every request using HMAC-SHA256 signature  
> (`HMAC(secret, timestamp + rawBody)`). Requests with invalid signatures are rejected with 401.

---

### 👑 Admin — `/api/admin`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | 👑 Admin | Dashboard stats: totals, revenue, recent orders, low stock |
| `GET` | `/admin/users` | 👑 Admin | List all users (passwords excluded) |
| `PUT` | `/admin/users/:id/status` | 👑 Admin | Activate or deactivate a user account |

**GET /admin/stats Response:**
```json
{
  "stats": {
    "totalProducts": 42,
    "totalOrders": 128,
    "totalUsers": 56,
    "revenue": 9823.50
  },
  "recentOrders": [...],
  "recentProducts": [...],
  "lowStockProducts": [...]
}
```

**PUT /admin/users/:id/status Request Body:**
```json
{ "isActive": false }
```

---

## 🔁 Key Features & Flows

### 1. Authentication Flow

The app uses a **dual-token system** for security:

```
┌─────────┐  POST /auth/login   ┌─────────┐
│ Browser │ ─────────────────► │ Backend │
│         │ ◄───────────────── │         │
│         │  Access Token (JWT) │         │
│         │  15 min expiry      │         │
│         │  Refresh Token      │         │
│         │  HttpOnly Cookie    │         │
│         │  7 days expiry      │         │
└─────────┘                    └────┬────┘
                                    │
                               Refresh token
                               also saved in
                               MongoDB (for
                               revocation on
                               logout)
```

**Auto Token Refresh:**
```
Every API Request:
  fetchAPI() → Authorization: Bearer <accessToken>

If 401 received:
  fetchAPI() → POST /auth/refresh (cookie sent automatically)
             ← New accessToken
  Retry original request → Transparent to the user
```

**Logout:**
```
POST /auth/logout
  → Delete refresh token from MongoDB   (revoked server-side)
  → Clear zenith_refresh cookie          (removed from browser)
  → Set memoryToken = null               (cleared from memory)
  → Zustand clearCart()
```

---

### 2. Cart Flow

```
Guest User (not logged in):
  Add/Remove items → Zustand store only
  Persisted to localStorage ("cart-storage")
  syncWithBackend() is called but silently ignores 401

User Logs In:
  loadFromBackend() called → GET /api/cart
  Server cart overwrites local cart in Zustand
  Future changes → syncWithBackend() → PUT /api/cart

Page Refresh (already logged in):
  AuthContext.initAuth() → GET /auth/profile
  If valid → loadFromBackend() → cart restored from server

User Logs Out:
  clearCart() → Zustand emptied → syncWithBackend() sends empty cart
```

---

### 3. Checkout & Payment Flow

```
1. User fills shipping info on /checkout
   └─ Full Name, Phone, Address, City, ZIP

2. User clicks "Pay via Cashfree"
   └─ Frontend → POST /api/payments/create-order
      └─ Backend calls Cashfree API → gets payment_session_id

3. Cashfree JS SDK opens payment popup (modal)
   └─ User selects UPI / Card / Netbanking / etc.
   └─ Completes payment inside popup

4a. Payment FAILED
    └─ result.error → Show error message to user

4b. Payment SUCCEEDED
    └─ result.paymentDetails is returned

5. Frontend → POST /api/orders (with cashfreeOrderId)
   └─ Backend starts MongoDB Transaction:
      a. For each item: check stock_quantity >= requested qty
      b. Atomically decrement stock ($inc: -qty)
      c. If any item out of stock → ABORT transaction → 409 error
      d. If all ok → Create Order document → COMMIT transaction

6. clearCart() → Navigate to /order-success/:orderId

7. (Async) Cashfree sends webhook to POST /api/payments/webhook
   └─ Backend verifies HMAC-SHA256 signature
   └─ Finds order by cashfreeOrderId where webhookProcessed = false
   └─ Sets status = 'Paid', webhookProcessed = true
```

---

### 4. Order Lifecycle (State Machine)

Order status can only move through **defined valid transitions**:

```
                    ┌──────────┐
                    │  PENDING │ ─────────────────────┐
                    └────┬─────┘                       │
                         │                             │ (Admin cancels)
                   (Payment confirmed                  │
                    via webhook)                        ▼
                         │                     ┌───────────────┐
                         ▼                     │   CANCELLED   │
                    ┌──────────┐               │  (Terminal)   │
                    │   PAID   │               └───────────────┘
                    └────┬─────┘
                         │
                   (Admin ships)
                         │
                         ▼
                    ┌──────────┐
                    │ SHIPPED  │
                    └────┬─────┘
                         │
                  (Admin confirms delivery)
                         │
                         ▼
                    ┌──────────────┐
                    │  DELIVERED   │
                    │  (Terminal)  │
                    └──────────────┘
```

Any invalid transition (e.g., Pending → Delivered) is rejected with a `400` error.

---

### 5. Image Upload Flow

```
Admin uploads product image:
  └─ Multipart form-data → POST /api/products

Backend (uploadMiddleware.js):
  └─ Multer intercepts the file
  └─ CloudinaryStorage streams file to Cloudinary
     (No disk storage — streams directly)
  └─ req.file.path      = Cloudinary CDN URL
  └─ req.file.filename  = Cloudinary public_id

Saved to MongoDB:
  └─ image_url        = CDN URL (served to frontend)
  └─ image_public_id  = used for future deletion

On Product Update (new image uploaded):
  └─ cloudinary.uploader.destroy(old_public_id)
  └─ Save new image_url + image_public_id

On Product Delete:
  └─ cloudinary.uploader.destroy(image_public_id)
  └─ Product.findByIdAndDelete(id)
```

---

## 🔒 Security Summary

| Feature | How It's Implemented |
|---|---|
| Password hashing | bcryptjs with salt rounds=10, Mongoose pre-save hook |
| Access token | Short-lived JWT (15 min), sent in `Authorization: Bearer` header |
| Refresh token | Long-lived JWT (7 days), HttpOnly cookie — inaccessible to JS |
| Token revocation | Refresh tokens stored in MongoDB — deleted on logout |
| Auto token expiry | MongoDB TTL index on `expiresAt` field in RefreshToken collection |
| Role-based access | `protect` + `admin` middleware chain on every admin route |
| User banning | `isActive` flag — banned users receive 403 on every authenticated request |
| Webhook security | HMAC-SHA256 signature verification prevents fake payment notifications |
| Oversell prevention | MongoDB transactions with atomic `$gte` stock check + `$inc` decrement |
| CORS | Whitelist: localhost:5173, localhost:5174, production Vercel URL |

---

## ⚙ Environment Variables

### Backend — `backend/.env`
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/zenith-store
PORT=5000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development

CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend — `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Cashfree account (sandbox for testing)

### Installation

**1. Clone the repository**
```bash
git clone <repo-url>
cd zenith-store
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd backend
npm install
```

**4. Set up environment variables**
- Copy the env variables above into `backend/.env`
- Create `.env` in root with `VITE_API_URL`

**5. Start development servers**

Backend (from `/backend`):
```bash
npm run dev        # uses nodemon — auto-restarts on changes
```

Frontend (from root):
```bash
npm run dev        # Vite dev server at http://localhost:5173
```

### Seed the Database (Optional)
```bash
cd backend
node seed.js       # Populates sample products
```

---

## 🌐 Routes Overview

### Public Routes (no login required)
| Route | Page |
|---|---|
| `/` | Homepage — product catalog with search and category filter |
| `/products/:id` | Product detail page |
| `/login` | Login form |
| `/signup` | Registration form |

### Protected Routes (login required)
| Route | Page |
|---|---|
| `/cart` | Shopping cart |
| `/checkout` | Checkout with Cashfree payment |
| `/order-success/:orderId` | Order confirmation page |
| `/profile` | User profile and order history |

### Admin Routes (admin role required)
| Route | Page |
|---|---|
| `/admin` | Dashboard with stats and alerts |
| `/admin/products` | Product CRUD management |
| `/admin/orders` | Order listing and status updates |
| `/admin/users` | User management and moderation |

---

## 📦 Deployment

**Frontend → Vercel**
```bash
npm run build          # Outputs to /dist
# Deploy /dist to Vercel
```

**Backend → Render / Railway / Heroku**
```bash
# Set all backend environment variables in your hosting dashboard
# Start command: node server.js
```

**Database → MongoDB Atlas**
- Whitelist your backend server's IP address
- Use the Atlas connection string in `MONGO_URI`

---

Built with ❤️ using React, Node.js, Express, and MongoDB.
