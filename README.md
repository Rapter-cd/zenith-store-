# Zenith Store - Complete E-commerce Application

A production-ready, full-stack e-commerce web application built with React, TypeScript, and Supabase.

## 🚀 Features

### Customer Features
- **User Authentication**: Complete sign-up, sign-in, and profile management
- **Product Catalog**: Browse products with detailed information and images
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **Secure Checkout**: Complete order processing with form validation
- **Order History**: View past orders and track status
- **Responsive Design**: Works seamlessly on all devices

### Admin Features
- **Admin Dashboard**: Overview of store metrics and analytics
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: View and update order statuses

### Technical Features
- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand for client-side state
- **Animations**: Framer Motion for smooth transitions
- **UI Components**: Shadcn/UI for consistent, accessible design
- **Database**: Supabase with Row Level Security (RLS)
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Icons**: Lucide React

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `.env` file with your credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Setup Database**
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - This will create all tables, RLS policies, and sample data

4. **Start development server**
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

## 🗄 Database Schema

### Key Tables
- **`profiles`**: User information and roles
- **`products`**: Product catalog with inventory
- **`orders`**: Customer orders with status tracking
- **`order_items`**: Individual items within orders

## 🚀 Deployment

1. Build the project: `npm run build`
2. Deploy to Vercel/Netlify
3. Set environment variables in deployment platform
4. Configure Supabase RLS policies

## 📁 Project Structure

```
zenith-store/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/        # React contexts (Auth)
│   ├── lib/            # Utilities and configurations
│   ├── pages/          # Route components
│   ├── stores/         # Zustand stores
│   └── types/          # TypeScript definitions
├── supabase-schema.sql # Database schema
└── supabase-edge-function-create-order.ts # Edge function
```

## 🔐 Authentication & Security

- Supabase Auth for user management
- Row Level Security (RLS) policies
- Role-based access control
- Protected routes and API endpoints

Built with ❤️ using modern web technologies
