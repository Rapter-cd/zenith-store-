import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAPI } from '@/lib/api'
import { useCartStore } from '@/stores/useCartStore'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingCart, ArrowLeft, Package, Shield, Truck } from 'lucide-react'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const data = await fetchAPI(`/products/${productId}`)
      setProduct({ ...data, id: data._id })
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product && user) {
      addItem(product)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock_quantity <= 0

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop';
                }}
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                <Badge variant="destructive">
                  Only {product.stock_quantity} left!
                </Badge>
              )}
              {isOutOfStock && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{product.stock_quantity} in stock</span>
              </div>

              {user ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              ) : (
                <Link to="/login" className="block">
                  <Button size="lg" className="w-full">
                    Sign in to Purchase
                  </Button>
                </Link>
              )}
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Free Shipping</h3>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">2 Year Warranty</h3>
                  <p className="text-xs text-muted-foreground">Full coverage</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Easy Returns</h3>
                  <p className="text-xs text-muted-foreground">30 day guarantee</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
