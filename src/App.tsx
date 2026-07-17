import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderSuccessPage } from '@/pages/OrderSuccessPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { AdminProducts } from '@/pages/AdminProducts'
import { AdminOrders } from '@/pages/AdminOrders'
import { AdminUsers } from '@/pages/AdminUsers'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Main app routes (with layout) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Protected routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/order-success/:orderId" element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute adminOnly>
                    <AdminProducts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly>
                    <AdminOrders />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute adminOnly>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
