import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '@/stores/useCartStore'
import { useAuth } from '@/contexts/AuthContext'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (user) {
      addItem(product)
    }
  }

  const isOutOfStock = product.stock_quantity <= 0

  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                }}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg">
                    Out of Stock
                  </Badge>
                </div>
              )}
              {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-2 right-2"
                >
                  Only {product.stock_quantity} left!
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                {product.stock_quantity} in stock
              </span>
            </div>
          </CardContent>

          {user && (
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                variant={isOutOfStock ? "secondary" : "default"}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </Link>
  )
}
