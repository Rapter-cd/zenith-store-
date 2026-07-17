import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchAPI } from '@/lib/api'
import { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [search, category, page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching products...')

      const queryParams = new URLSearchParams()
      if (search) queryParams.append('search', search)
      if (category && category !== 'All') queryParams.append('category', category)
      queryParams.append('page', page.toString())

      const data = await fetchAPI(`/products?${queryParams.toString()}`)

      const mappedData = data.products?.map((p: any) => ({ ...p, id: p._id })) || []
      setProducts(mappedData)
      setTotalPages(data.pages || 1)
      console.log('Products set:', mappedData.length)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to fetch products.')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProducts}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Welcome to Zenith Store
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover premium electronics and accessories. Quality you can trust, prices you'll love.
        </p>
      </motion.section>

      {/* Products Section */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-1/3"
            />
            <select 
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-1/4"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">
                No products available at the moment.
              </p>
            </motion.div>
          )}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button 
                variant="outline" 
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="text-center p-6 rounded-lg bg-muted/30">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
          <p className="text-muted-foreground">
            Free shipping on all orders over $50
          </p>
        </div>

        <div className="text-center p-6 rounded-lg bg-muted/30">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
          <p className="text-muted-foreground">
            Your payment information is safe with us
          </p>
        </div>

        <div className="text-center p-6 rounded-lg bg-muted/30">
          <div className="text-4xl mb-4">💯</div>
          <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
          <p className="text-muted-foreground">
            30-day money back guarantee on all items
          </p>
        </div>
      </motion.section>
    </div>
  )
}
