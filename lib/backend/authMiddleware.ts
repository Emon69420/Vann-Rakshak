import { User } from '@supabase/supabase-js'
import { supabase, Profile } from './supabaseClient'

export interface AuthContext {
  user: User
  profile: Profile
  token: string
}

export type UserRole = 'patta_holder' | 'district_admin' | 'state_admin' | 'super_admin'

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function authenticateUser(authHeader?: string): Promise<AuthContext> {
  if (!authHeader) {
    throw new AuthError('No authorization header provided', 401)
  }

  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    throw new AuthError('Invalid authorization header format', 401)
  }

  // Verify JWT token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    throw new AuthError('Invalid or expired token', 401)
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new AuthError('User profile not found', 404)
  }

  return {
    user,
    profile,
    token
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (auth: AuthContext) => {
    if (!allowedRoles.includes(auth.profile.role as UserRole)) {
      throw new AuthError(
        `Access denied. Required roles: ${allowedRoles.join(', ')}. Current role: ${auth.profile.role}`,
        403
      )
    }
  }
}

export function requireDistrictAdmin(auth: AuthContext, district?: string) {
  const { profile } = auth
  
  if (profile.role === 'super_admin' || profile.role === 'state_admin') {
    return // Super admin and state admin have access to all districts
  }
  
  if (profile.role === 'district_admin') {
    if (district && profile.district !== district) {
      throw new AuthError('Access denied. District admin can only access their own district', 403)
    }
    return
  }
  
  throw new AuthError('Access denied. Admin role required', 403)
}

export function requireOwnershipOrAdmin(auth: AuthContext, resourceUserId: string) {
  const { user, profile } = auth
  
  // User owns the resource
  if (user.id === resourceUserId) {
    return
  }
  
  // Admin roles can access any resource
  if (['district_admin', 'state_admin', 'super_admin'].includes(profile.role)) {
    return
  }
  
  throw new AuthError('Access denied. You can only access your own resources', 403)
}

export async function logAction(
  userId: string | null,
  action: string,
  metadata?: any
): Promise<void> {
  try {
    await supabase
      .from('logs')
      .insert({
        user_id: userId,
        action,
        metadata
      })
  } catch (error) {
    console.error('Failed to log action:', error)
    // Don't throw error for logging failures
  }
}

// Middleware wrapper for API endpoints
export function withAuth(
  handler: (auth: AuthContext, ...args: any[]) => Promise<any>,
  options: {
    requireRoles?: UserRole[]
    requireDistrict?: boolean
  } = {}
) {
  return async (req: any, res: any) => {
    try {
      const auth = await authenticateUser(req.headers.authorization)
      
      // Check role requirements
      if (options.requireRoles) {
        requireRole(options.requireRoles)(auth)
      }
      
      // Call the handler with auth context
      const result = await handler(auth, req, res)
      
      return result
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          error: error.message
        })
      }
      
      console.error('Authentication error:', error)
      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }
}

// Utility function to check if user can access district data
export function canAccessDistrict(profile: Profile, district: string): boolean {
  switch (profile.role) {
    case 'super_admin':
    case 'state_admin':
      return true
    case 'district_admin':
      return profile.district === district
    case 'patta_holder':
      return false
    default:
      return false
  }
}

// Utility function to get accessible districts for a user
export function getAccessibleDistricts(profile: Profile): string[] | 'all' {
  switch (profile.role) {
    case 'super_admin':
    case 'state_admin':
      return 'all'
    case 'district_admin':
      return profile.district ? [profile.district] : []
    case 'patta_holder':
      return []
    default:
      return []
  }
}
