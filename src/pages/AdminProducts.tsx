import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import { fetchAPI } from '@/lib/api'
import { Product } from '@/types'

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await fetchAPI('/products?limit=100') // Get more for admin view
      setProducts(data.products || data || [])
    } catch (error) {
      console.error('Error fetching products', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await fetchAPI(`/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      if (currentProduct?._id || currentProduct?.id) {
        const id = currentProduct._id || currentProduct.id;
        await fetchAPI(`/products/${id}`, {
          method: 'PUT',
          body: formData,
        }, true) // true flag bypasses default JSON serialization in a custom fetchAPI if configured, or use raw fetch
      } else {
        await fetchAPI('/products', {
          method: 'POST',
          body: formData,
        }, true)
      }
      setIsEditing(false)
      setCurrentProduct(null)
      fetchProducts()
    } catch (error) {
      console.error('Failed to save product', error)
      alert('Failed to save product')
    }
  }

  if (isEditing) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" className="mb-4" onClick={() => { setIsEditing(false); setCurrentProduct(null); }}>Back to Products</Button>
        <Card>
          <CardHeader>
            <CardTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Using standard form with action for multipart/form-data. Since we intercept with fetch, we manually construct FormData */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" defaultValue={currentProduct?.name} required className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input type="number" step="0.01" name="price" defaultValue={currentProduct?.price} required className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input type="number" name="stock_quantity" defaultValue={currentProduct?.stock_quantity} required className="w-full p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input name="category" defaultValue={currentProduct?.category || 'General'} required className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" defaultValue={currentProduct?.description} required className="w-full p-2 border rounded" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                {currentProduct?.image_url && <img src={currentProduct.image_url} alt="Current" className="h-20 w-20 object-cover mb-2 rounded" />}
                <input type="file" name="image" accept="image/*" className="w-full p-2 border rounded" />
                <p className="text-xs text-muted-foreground mt-1">Leave blank to keep existing image</p>
              </div>
              <Button type="submit" className="w-full">Save Product</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <tr key={product.id || product._id} className="border-b">
                        <td className="px-6 py-4 font-medium flex items-center space-x-3">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <Package className="h-10 w-10 text-muted-foreground" />
                          )}
                          <span>{product.name}</span>
                        </td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stock_quantity}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setCurrentProduct(product); setIsEditing(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id || product._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
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
