# Zenith Store - Complete E-commerce Application

A production-ready, full-stack e-commerce web application built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

### Customer Features
- **User Authentication**: Complete sign-up, sign-in, and profile management
- **Product Catalog**: Browse products with detailed information and images
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **Secure Checkout**: Complete order processing with Cashfree Payment Gateway integration
- **Order History**: View past orders and track status
- **Responsive Design**: Works seamlessly on all devices

### Admin Features
- **Admin Dashboard**: Overview of store metrics and analytics
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: View and update order statuses

### Technical Features
- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS, Node.js, Express, MongoDB
- **State Management**: Zustand for client-side state
- **Animations**: Framer Motion for smooth transitions
- **UI Components**: Shadcn/UI for consistent, accessible design
- **Database**: MongoDB with Mongoose ODM
- **Type Safety**: Full TypeScript implementation on the frontend

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Payments**: Cashfree Payment Gateway
- **Icons**: Lucide React

## 🔧 Installation

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the `backend` directory with your credentials:
     ```env
     MONGO_URI=your_mongodb_connection_string
     PORT=5000
     JWT_SECRET=your_jwt_secret
     CASHFREE_APP_ID=your_cashfree_app_id
     CASHFREE_SECRET_KEY=your_cashfree_secret_key
     ```

4. **Start Development Servers**
   - Start the backend server (from the `backend` directory):
     ```bash
     npm run dev
     ```
   - Start the frontend server (from the root directory):
     ```bash
     npm run dev
     ```

## 📱 Pages & Routes

### Public Routes
- `/` - Homepage with product catalog
- `/products/:id` - Product detail page
- `/login` - User authentication
- `/signup` - User registration

### Protected Routes
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/profile` - User profile and order history
- `/order-success/:id` - Order confirmation

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management

## 🚀 Deployment

1. Build the frontend: `npm run build`
2. Deploy the frontend to Vercel/Netlify
3. Deploy the backend to Render/Heroku or any Node.js hosting provider
4. Set environment variables in your deployment platforms
5. Ensure your MongoDB cluster allows connections from your backend's IP

## 📁 Project Structure

```
zenith-store/
├── backend/            # Express Backend
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # Express API Routes
│   ├── controllers/    # API Logic
│   └── server.js       # Entry point
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/        # React contexts
│   ├── lib/            # Utilities and configurations
│   ├── pages/          # Route components
│   ├── stores/         # Zustand stores
│   └── types/          # TypeScript definitions
```

## 🔐 Authentication & Security

- JWT (JSON Web Tokens) for user authentication and session management
- Password hashing with bcrypt
- Protected routes and API endpoints using middleware
- Role-based access control (Admin vs User)

Built with ❤️ using modern web technologies
