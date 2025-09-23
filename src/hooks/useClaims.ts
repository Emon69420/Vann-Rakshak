import { useState, useEffect } from 'react'
import { supabase, FraClaim } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

export function useClaims() {
  const [claims, setClaims] = useState<FraClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user) {
      fetchClaims()
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('fra_claims')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'fra_claims'
        }, handleRealtimeUpdate)
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user, profile])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('fra_claims')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      // Apply role-based filtering
      if (profile?.role === 'patta_holder') {
        query = query.eq('user_id', user!.id)
      } else if (profile?.role === 'district_admin') {
        query = query.eq('district', profile.district)
      }
      // state_admin and super_admin see all claims

      const { data, error } = await query

      if (error) throw error

      setClaims(data || [])
    } catch (err: any) {
      console.error('Error fetching claims:', err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to fetch claims. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        setClaims(prev => [newRecord, ...prev])
        toast({
          title: "New Claim",
          description: `A new claim has been submitted for ${newRecord.village_name}`,
        })
        break
      
      case 'UPDATE':
        setClaims(prev => prev.map(claim => 
          claim.id === newRecord.id ? newRecord : claim
        ))
        
        // Show status change notifications
        if (oldRecord.status !== newRecord.status) {
          const statusMessage = newRecord.status === 'approved' 
            ? 'approved' 
            : newRecord.status === 'rejected' 
            ? 'rejected' 
            : 'updated'
          
          toast({
            title: "Claim Updated",
            description: `Claim for ${newRecord.village_name} has been ${statusMessage}`,
          })
        }
        break
      
      case 'DELETE':
        setClaims(prev => prev.filter(claim => claim.id !== oldRecord.id))
        toast({
          title: "Claim Deleted",
          description: "A claim has been deleted",
        })
        break
    }
  }

  const submitClaim = async (claimData: {
    villageName: string
    district: string
    state: string
    claimType: 'IFR' | 'CR' | 'CFR'
    areaHectares: number
    document?: File
    shapefile?: File
  }) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setLoading(true)

      // Upload document if provided
      let documentUrl = null
      if (claimData.document) {
        const fileName = `${user.id}/${Date.now()}_${claimData.document.name}`
        const { error: uploadError } = await supabase.storage
          .from('fra-claims-docs')
          .upload(fileName, claimData.document)

        if (uploadError) throw uploadError
        documentUrl = fileName
      }

      // Upload shapefile if provided
      let shapefileUrl = null
      if (claimData.shapefile) {
        const fileName = `${user.id}/${Date.now()}_${claimData.shapefile.name}`
        const { error: uploadError } = await supabase.storage
          .from('fra-shapefiles')
          .upload(fileName, claimData.shapefile)

        if (uploadError) throw uploadError
        shapefileUrl = fileName
      }

      // Create claim record
      const { error } = await supabase
        .from('fra_claims')
        .insert({
          user_id: user.id,
          village_name: claimData.villageName,
          district: claimData.district,
          state: claimData.state,
          claim_type: claimData.claimType,
          area_hectares: claimData.areaHectares,
          document_url: documentUrl,
          shapefile_url: shapefileUrl,
          status: 'pending'
        })

      if (error) throw error

      // Log the action
      await supabase
        .from('logs')
        .insert({
          user_id: user.id,
          action: 'submit_claim',
          metadata: {
            village_name: claimData.villageName,
            district: claimData.district,
            claim_type: claimData.claimType
          }
        })

      toast({
        title: "Claim Submitted",
        description: `Your FRA claim for ${claimData.villageName} has been submitted successfully.`,
      })

      // Refresh claims
      await fetchClaims()

    } catch (err: any) {
      console.error('Error submitting claim:', err)
      toast({
        title: "Submission Failed",
        description: err.message || "Failed to submit claim. Please try again.",
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateClaimStatus = async (claimId: string, status: 'approved' | 'rejected', notes?: string) => {
    if (!user || !profile) throw new Error('User not authenticated')
    
    // Check permissions
    if (!['district_admin', 'state_admin', 'super_admin'].includes(profile.role)) {
      throw new Error('Insufficient permissions')
    }

    try {
      const { error } = await supabase
        .from('fra_claims')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: user.id,
          metadata_json: notes ? { admin_notes: notes } : undefined
        })
        .eq('id', claimId)

      if (error) throw error

      // Log the action
      await supabase
        .from('logs')
        .insert({
          user_id: user.id,
          action: `claim_${status}`,
          metadata: {
            claim_id: claimId,
            admin_notes: notes
          }
        })

      toast({
        title: `Claim ${status}`,
        description: `The claim has been ${status} successfully.`,
      })

    } catch (err: any) {
      console.error(`Error ${status} claim:`, err)
      toast({
        title: "Update Failed",
        description: err.message || `Failed to ${status} claim. Please try again.`,
        variant: "destructive"
      })
      throw err
    }
  }

  const deleteClaim = async (claimId: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('fra_claims')
        .delete()
        .eq('id', claimId)
        .eq('user_id', user.id) // Can only delete own claims

      if (error) throw error

      toast({
        title: "Claim Deleted",
        description: "Your claim has been deleted successfully.",
      })

    } catch (err: any) {
      console.error('Error deleting claim:', err)
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete claim. Please try again.",
        variant: "destructive"
      })
      throw err
    }
  }

  return {
    claims,
    loading,
    error,
    submitClaim,
    updateClaimStatus,
    deleteClaim,
    refetch: fetchClaims
  }
}
