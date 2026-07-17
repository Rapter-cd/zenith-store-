import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Ban, CheckCircle } from 'lucide-react'
import { fetchAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchAPI('/admin/users')
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'ban' : 'unban'} this user?`)) return
    try {
      await fetchAPI(`/admin/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus })
      })
      fetchUsers()
    } catch (error: any) {
      alert('Failed to update user status')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="px-6 py-4 font-medium">{user.full_name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className="text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Active</span>
                          ) : (
                            <span className="text-red-600 flex items-center"><Ban className="h-4 w-4 mr-1"/> Banned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.role !== 'admin' && (
                            <Button 
                              variant="ghost" 
                              className={user.isActive ? "text-destructive" : "text-green-600"}
                              onClick={() => toggleUserStatus(user._id, user.isActive)}
                            >
                              {user.isActive ? 'Ban User' : 'Unban User'}
                            </Button>
                          )}
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
