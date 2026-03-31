import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: any[]
  lowStockProducts: any[]
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await fetchAPI('/admin/stats');

      setStats({
        totalProducts: data.stats.totalProducts || 0,
        totalOrders: data.stats.totalOrders || 0,
        totalUsers: data.stats.totalUsers || 0,
        totalRevenue: data.stats.revenue || 0,
        recentOrders: data.recentOrders || [],
        lowStockProducts: data.recentProducts.filter((p: any) => p.stock_quantity <= 10) || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <p className="text-muted-foreground">No orders found.</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.user_id?.full_name || 'Unknown User'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total_price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <Link to="/admin/orders" className="block mt-4">
                <Button variant="outline" className="w-full">View All Orders</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground">All products are well stocked.</p>
              ) : (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-red-600 font-semibold">
                        {product.stock_quantity} left
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
              <Link to="/admin/products" className="block mt-4">
                <Button variant="outline" className="w-full">Manage Products</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/products">
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
