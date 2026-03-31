import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useCartStore } from '@/stores/useCartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { items, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-primary"
              >
                Zenith Store
              </motion.div>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <Link to="/profile">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <span className="hidden sm:inline text-sm text-muted-foreground">
                    {profile?.full_name || user.email}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Zenith Store</h3>
              <p className="text-sm text-muted-foreground">
                Your premier destination for high-quality electronics and accessories.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/products" className="text-muted-foreground hover:text-foreground">Products</Link></li>
                <li><Link to="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Returns</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Zenith Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
