import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchAPI, setAuthToken } from '@/lib/api'
import { Profile } from '@/types'
import { useCartStore } from '@/stores/useCartStore'

// Map our custom backend user to the interface
export interface User {
  id: string
  _id?: string
  email: string
  full_name?: string
  role: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: { access_token: string } | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<{ access_token: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    const initAuth = async () => {
      try {
        const profileData = await fetchAPI('/auth/profile');
        if (profileData) {
          const userData = {
            id: profileData._id,
            email: profileData.email,
            full_name: profileData.full_name,
            role: profileData.role
          };
          setUser(userData);
          setProfile(userData as Profile);
          setSession({ access_token: "refreshed" }); 
          useCartStore.getState().loadFromBackend();
        }
      } catch (error) {
        setSession(null)
        setUser(null)
        setProfile(null)
      }
      setLoading(false);
    };

    initAuth();
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const data = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name: fullName }),
      })
      setAuthToken(data.token);
      setSession({ access_token: data.token })
      const u = { id: data._id, email: data.email, full_name: data.full_name, role: data.role };
      setUser(u);
      setProfile(u as Profile);
      await useCartStore.getState().syncWithBackend();
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAuthToken(data.token);
      setSession({ access_token: data.token })
      const u = { id: data._id, email: data.email, full_name: data.full_name, role: data.role };
      setUser(u);
      setProfile(u as Profile);
      await useCartStore.getState().loadFromBackend();
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await fetchAPI('/auth/logout', { method: 'POST' });
      setAuthToken(null);
      setSession(null);
      setUser(null);
      setProfile(null);
      useCartStore.getState().clearCart();
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
