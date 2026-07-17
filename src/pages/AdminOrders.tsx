import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'
import { fetchAPI } from '@/lib/api'

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchAPI('/orders')
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetchAPI(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })
      fetchOrders()
    } catch (error: any) {
      alert(error.message || 'Failed to update status')
    }
  }

  const validTransitions: Record<string, string[]> = {
    Pending: ['Paid', 'Cancelled'],
    Paid: ['Shipped'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: []
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Order Management</h1>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">Loading orders...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const allowedNext = validTransitions[order.status] || [];
                      return (
                        <tr key={order._id} className="border-b">
                          <td className="px-6 py-4 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4">{order.user_id?.full_name || 'Unknown'}</td>
                          <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-bold">${order.total_price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <select 
                              value={order.status} 
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="bg-background border rounded p-1"
                              disabled={allowedNext.length === 0}
                            >
                              <option value={order.status}>{order.status}</option>
                              {allowedNext.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
