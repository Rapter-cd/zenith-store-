import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from 'lucide-react'

export function AdminProducts() {
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Product management interface would be implemented here.
              </p>
              <p className="text-sm text-muted-foreground">
                Features: Add/Edit/Delete products, manage inventory, upload images
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
