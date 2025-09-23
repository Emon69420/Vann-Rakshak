import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'

// Simple types for now
interface Profile {
  id: string
  full_name: string
  email: string
  role: string
  district?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(false) // Set to false for now

  useEffect(() => {
    // Mock user and profile for testing - remove this when ready to integrate
    const mockUser: User = {
      id: 'mock-user-id',
      email: 'suman.sharma@fraatlas.gov.in',
      created_at: '2022-03-15T00:00:00Z',
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated'
    } as User

    const mockProfile: Profile = {
      id: 'mock-user-id',
      full_name: 'Suman Sharma',
      email: 'suman.sharma@fraatlas.gov.in',
      role: 'district_admin',
      district: 'Delhi',
      created_at: '2022-03-15T00:00:00Z',
      updated_at: new Date().toISOString()
    }

    setUser(mockUser)
    setProfile(mockProfile)
    setLoading(false)
    // Uncomment below when supabase is properly configured
    /*
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
    */
  }, [])

  const fetchProfile = async (userId: string) => {
    // Mock implementation for now
    console.log('fetchProfile:', userId)
    setLoading(false)
  }

  const createProfile = async (userId: string) => {
    // Mock implementation for now
    console.log('createProfile:', userId)
  }

  const signIn = async (email: string, password: string) => {
    console.log('signIn:', email)
    // Mock success for now
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('signUp:', email, fullName)
    // Mock success for now
  }

  const signOut = async () => {
    console.log('signOut')
    // Mock success for now
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('updateProfile:', updates)
    // Mock success for now
  }

  const logAction = async (action: string, metadata?: any) => {
    console.log('logAction:', action, metadata)
    // Mock success for now
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
