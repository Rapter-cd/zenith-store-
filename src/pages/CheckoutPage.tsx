import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAPI } from '@/lib/api'
import { useCartStore } from '@/stores/useCartStore'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Lock } from 'lucide-react'
import { load } from '@cashfreepayments/cashfree-js'

let cashfree: any;
const initializeCashfree = async () => {
  cashfree = await load({
    mode: "sandbox",
  });
};
initializeCashfree();

export function CheckoutPage() {
  const { user } = useAuth()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalPrice = getTotalPrice()
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + tax

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  })



  if (!user || items.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {!user ? 'Please sign in to checkout' : 'Your cart is empty'}
          </h1>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!shippingInfo.phone || !shippingInfo.fullName) {
      setError('Please fill in your Full Name and Phone number')
      return;
    }

    setLoading(true)
    setError('')

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id || item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }))

      // 1. Create order on Cashfree
      const customer_details = {
        customer_id: user?.id || user?._id || 'guest',
        customer_phone: shippingInfo.phone,
        customer_name: shippingInfo.fullName,
        customer_email: user?.email || 'customer@example.com'
      }

      const cfResponse = await fetchAPI('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          order_items: orderItems,
          total_price: finalTotal,
          customer_details
        }),
      })

      if (!cfResponse.payment_session_id) {
         throw new Error('Failed to generate Cashfree payment session');
      }

      // 2. Open Cashfree Checkout popup
      cashfree.checkout({
        paymentSessionId: cfResponse.payment_session_id,
        redirectTarget: "_modal",
      }).then(async (result: any) => {
        if (result.error) {
          setError(result.error.message || 'Payment failed or cancelled')
          setLoading(false)
          return
        }

        if (result.redirect) {
          console.log("Payment will be redirected")
          return
        }

        if (result.paymentDetails) {
          // Payment is successful
          // Now create the actual order in our database
            const orderResponse = await fetchAPI('/orders', {
              method: 'POST',
              body: JSON.stringify({
                order_items: orderItems,
                total_price: finalTotal,
                cashfreeOrderId: cfResponse.order_id
              }),
            })
          
          clearCart()
          navigate(`/order-success/${orderResponse._id}`)
        }
      });
      
    } catch (err) {
      console.error('Error starting payment:', err)
      setError(err instanceof Error ? err.message : 'Failed to start payment')
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cashfree handles payment information securely */}
              <div className="bg-muted p-4 rounded-lg flex items-center justify-center space-x-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Payment will be processed securely via Cashfree</span>
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id || item.product._id} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Starting Payment...' : `Pay via Cashfree - $${finalTotal.toFixed(2)}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  <Lock className="inline h-3 w-3 mr-1" />
                  Your payment information is secure and encrypted
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
