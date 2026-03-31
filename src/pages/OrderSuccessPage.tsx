import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Order } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Package, Home } from 'lucide-react'

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId && user) {
      fetchOrder()
    }
  }, [orderId, user])

  const fetchOrder = async () => {
    if (!orderId) return

    try {
      const data = await fetchAPI(`/orders/${orderId}`)
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
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

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
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
        className="max-w-2xl mx-auto"
      >
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
        </motion.div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-mono text-sm">{(order._id || order.id).slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p>{new Date(order.createdAt || order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-bold">${order.total_price.toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.order_items?.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Product ID: {item.product_id}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center space-y-4"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
            <p className="text-blue-600 text-sm">
              We'll send you a confirmation email with tracking information once your order ships.
              Estimated delivery: 3-5 business days.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Orders
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
