import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Order, OrderWithItems } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Package, Edit, Save, X } from 'lucide-react'

export function ProfilePage() {
  const { user, profile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || '')

  useEffect(() => {
    if (user) {
      fetchOrders()
      setFullName(user?.full_name || '')
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const data = await fetchAPI('/orders/myorders')
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    // Left unimplemented for backend demo, not critical.
    setEditingProfile(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary'
      case 'shipped':
        return 'default'
      case 'delivered':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  {editingProfile ? (
                    <div className="flex space-x-2">
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      <Button size="icon" onClick={handleUpdateProfile}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingProfile(false)
                          setFullName(user?.full_name || '')
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        value={fullName}
                        disabled
                        className="bg-muted"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setEditingProfile(true)}
                        disabled
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Account Type</Label>
                  <div className="mt-1">
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order._id || order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">
                              Order #{(order._id || order.id).slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(order.status) as any}>
                              {order.status}
                            </Badge>
                            <p className="font-bold mt-1">
                              ${order.total_price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Items:</p>
                          {order.order_items?.map((item: any) => (
                            <div
                              key={item._id}
                              className="flex justify-between text-sm text-muted-foreground"
                            >
                              <span>
                                Product #{item.product_id} × {item.quantity}
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
