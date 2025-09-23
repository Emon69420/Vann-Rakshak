
import { supabase, FraClaim, AssetMap } from './supabaseClient'

export interface GovernmentScheme {
  id: string
  name: string
  description: string
  eligibilityCriteria: string[]
  benefits: string
  applicationUrl?: string
  contactInfo?: string
  category: 'agriculture' | 'forest' | 'livelihood' | 'infrastructure' | 'social'
}

export interface RecommendationContext {
  claim: FraClaim
  assets: AssetMap[]
  userProfile?: any
}

export interface SchemeRecommendation {
  scheme: GovernmentScheme
  relevanceScore: number
  eligibilityMatch: boolean
  reasoning: string
  priority: 'high' | 'medium' | 'low'
}

export interface DSSResult {
  claimId: string
  recommendations: SchemeRecommendation[]
  totalSchemes: number
  highPriorityCount: number
  mediumPriorityCount: number
  lowPriorityCount: number
  generatedAt: string
  engineVersion: string
}

// Government schemes database
const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Income support scheme providing ₹6,000 per year to eligible farmer families',
    eligibilityCriteria: [
      'Small and marginal farmers',
      'Landholding up to 2 hectares',
      'Valid land ownership documents'
    ],
    benefits: '₹6,000 per year in three equal installments',
    applicationUrl: 'https://pmkisan.gov.in/',
    contactInfo: 'PM-KISAN Helpline: 155261',
    category: 'agriculture'
  },
  {
    id: 'jal-jeevan-mission',
    name: 'Jal Jeevan Mission',
    description: 'Aims to provide safe and adequate drinking water through individual household tap connections',
    eligibilityCriteria: [
      'Rural households',
      'No existing piped water connection',
      'Village-level implementation'
    ],
    benefits: 'Tap water connection to every rural household',
    applicationUrl: 'https://jaljeevanmission.gov.in/',
    contactInfo: 'JJM Control Room: 011-24368023',
    category: 'infrastructure'
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)',
    description: 'Guarantees 100 days of employment per rural household per year',
    eligibilityCriteria: [
      'Adult members of rural households',
      'Willing to do unskilled manual work',
      'Valid job card'
    ],
    benefits: '100 days guaranteed employment at minimum wages',
    applicationUrl: 'https://nrega.nic.in/',
    contactInfo: 'MGNREGA Helpline: 1800-345-2244',
    category: 'livelihood'
  },
  {
    id: 'pradhan-mantri-awas-yojana-grameen',
    name: 'Pradhan Mantri Awas Yojana - Gramin',
    description: 'Provides assistance for construction of pucca houses with basic amenities',
    eligibilityCriteria: [
      'Rural households',
      'Homeless or inadequate housing',
      'Below poverty line families',
      'SC/ST, minorities, widows, disabled persons get priority'
    ],
    benefits: '₹1.20 lakh assistance for construction of house in plain areas',
    applicationUrl: 'https://pmayg.nic.in/',
    contactInfo: 'PMAY-G Helpline: 1800-11-6446',
    category: 'infrastructure'
  },
  {
    id: 'forest-rights-act',
    name: 'Forest Rights Act Implementation Support',
    description: 'Support for implementation of community forest rights and livelihood activities',
    eligibilityCriteria: [
      'Scheduled Tribes and other traditional forest dwellers',
      'Evidence of forest dwelling for 75 years (before 2005)',
      'Dependence on forest for bonafide livelihood needs'
    ],
    benefits: 'Recognition of forest rights, community forest governance, livelihood support',
    applicationUrl: 'https://tribal.nic.in/',
    contactInfo: 'Ministry of Tribal Affairs: 011-24016707',
    category: 'forest'
  },
  {
    id: 'krishak-bandhu',
    name: 'Krishak Bandhu Scheme',
    description: 'Financial assistance to farmers and life insurance coverage',
    eligibilityCriteria: [
      'Small and marginal farmers',
      'Valid land documents',
      'Resident of eligible state'
    ],
    benefits: '₹5,000 per acre per year + life insurance',
    applicationUrl: 'https://wb.gov.in/krishakbandhu/',
    contactInfo: 'State Agriculture Department',
    category: 'agriculture'
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    description: 'Provides soil health cards to farmers with recommendations for appropriate nutrients',
    eligibilityCriteria: [
      'All farmers',
      'Own agricultural land'
    ],
    benefits: 'Free soil testing and nutrient recommendations',
    applicationUrl: 'https://soilhealth.dac.gov.in/',
    contactInfo: 'Department of Agriculture: 1551',
    category: 'agriculture'
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support to farmers in case of crop failure',
    eligibilityCriteria: [
      'Farmers growing notified crops',
      'Sharecroppers and tenant farmers',
      'Premium payment'
    ],
    benefits: 'Insurance coverage against crop loss due to natural calamities',
    applicationUrl: 'https://pmfby.gov.in/',
    contactInfo: 'PMFBY Helpline: 14447',
    category: 'agriculture'
  }
]

export class DSSEngine {
  private static readonly ENGINE_VERSION = 'v1.0.0'

  static async generateRecommendations(claimId: string): Promise<DSSResult> {
    try {
      // Get claim details
      const { data: claim, error: claimError } = await supabase
        .from('fra_claims')
        .select('*')
        .eq('id', claimId)
        .single()

      if (claimError || !claim) {
        throw new Error(`Claim not found: ${claimId}`)
      }

      // Get related assets
      const { data: assets, error: assetsError } = await supabase
        .from('asset_maps')
        .select('*')
        .eq('village_name', claim.village_name)
        .eq('district', claim.district)

      if (assetsError) {
        console.warn('Failed to fetch assets:', assetsError)
      }

      const context: RecommendationContext = {
        claim,
        assets: assets || []
      }

      // Generate recommendations
      const recommendations = this.evaluateSchemes(context)

      // Count priorities
      const highPriorityCount = recommendations.filter(r => r.priority === 'high').length
      const mediumPriorityCount = recommendations.filter(r => r.priority === 'medium').length
      const lowPriorityCount = recommendations.filter(r => r.priority === 'low').length

      const result: DSSResult = {
        claimId,
        recommendations: recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore),
        totalSchemes: recommendations.length,
        highPriorityCount,
        mediumPriorityCount,
        lowPriorityCount,
        generatedAt: new Date().toISOString(),
        engineVersion: this.ENGINE_VERSION
      }

      // Save recommendations to database
      await this.saveRecommendations(result)

      return result
    } catch (error) {
      console.error('DSS recommendation generation failed:', error)
      throw error
    }
  }

  private static evaluateSchemes(context: RecommendationContext): SchemeRecommendation[] {
    const { claim, assets } = context
    const recommendations: SchemeRecommendation[] = []

    for (const scheme of GOVERNMENT_SCHEMES) {
      const evaluation = this.evaluateScheme(scheme, context)
      if (evaluation.relevanceScore > 0.3) { // Only include relevant schemes
        recommendations.push(evaluation)
      }
    }

    return recommendations
  }

  private static evaluateScheme(
    scheme: GovernmentScheme,
    context: RecommendationContext
  ): SchemeRecommendation {
    const { claim, assets } = context
    let score = 0.0
    let reasoning = []
    let eligibilityMatch = false

    // Base scoring rules
    switch (scheme.id) {
      case 'pm-kisan':
        if (claim.area_hectares <= 2.0) {
          score += 0.8
          eligibilityMatch = true
          reasoning.push('Land area is within 2 hectares limit')
        }
        if (assets.some(a => a.asset_type === 'agriculture')) {
          score += 0.3
          reasoning.push('Agricultural land detected in asset mapping')
        }
        if (claim.claim_type === 'IFR') {
          score += 0.2
          reasoning.push('Individual Forest Rights holders often engage in agriculture')
        }
        break

      case 'jal-jeevan-mission':
        if (!assets.some(a => a.asset_type === 'water_body')) {
          score += 0.6
          eligibilityMatch = true
          reasoning.push('No significant water bodies detected - may need water infrastructure')
        }
        if (claim.area_hectares > 0.5) {
          score += 0.2
          reasoning.push('Sufficient land area to benefit from water infrastructure')
        }
        if (claim.claim_type === 'CFR') {
          score += 0.3
          reasoning.push('Community forest rights holders can benefit from village-level water projects')
        }
        break

      case 'mgnrega':
        score += 0.7 // Always relevant for rural households
        eligibilityMatch = true
        reasoning.push('Universal rural employment scheme')
        if (claim.area_hectares < 1.0) {
          score += 0.2
          reasoning.push('Small landholders often need additional income sources')
        }
        break

      case 'pradhan-mantri-awas-yojana-grameen':
        if (assets.some(a => a.asset_type === 'homestead')) {
          score += 0.1
          reasoning.push('Existing homestead may indicate housing needs')
        } else {
          score += 0.5
          reasoning.push('No homestead detected - may need housing support')
          eligibilityMatch = true
        }
        break

      case 'forest-rights-act':
        if (claim.claim_type === 'CFR') {
          score += 0.9
          eligibilityMatch = true
          reasoning.push('Community Forest Rights claim - highly relevant')
        }
        if (claim.claim_type === 'IFR') {
          score += 0.7
          eligibilityMatch = true
          reasoning.push('Individual Forest Rights claim - relevant for implementation support')
        }
        if (assets.some(a => a.asset_type === 'forest')) {
          score += 0.3
          reasoning.push('Forest assets detected')
        }
        break

      case 'krishak-bandhu':
        if (claim.area_hectares <= 2.0) {
          score += 0.6
          eligibilityMatch = true
          reasoning.push('Small/marginal farmer eligible for financial assistance')
        }
        if (assets.some(a => a.asset_type === 'agriculture')) {
          score += 0.4
          reasoning.push('Agricultural activities detected')
        }
        break

      case 'soil-health-card':
        if (assets.some(a => a.asset_type === 'agriculture')) {
          score += 0.8
          eligibilityMatch = true
          reasoning.push('Agricultural land can benefit from soil health assessment')
        }
        break

      case 'pmfby':
        if (assets.some(a => a.asset_type === 'agriculture') && claim.area_hectares > 0.25) {
          score += 0.7
          eligibilityMatch = true
          reasoning.push('Agricultural land with sufficient area for crop insurance')
        }
        break

      default:
        score += 0.1 // Minimal relevance for unlisted schemes
    }

    // Apply category-based scoring
    if (scheme.category === 'agriculture' && assets.some(a => a.asset_type === 'agriculture')) {
      score += 0.2
    }
    if (scheme.category === 'forest' && assets.some(a => a.asset_type === 'forest')) {
      score += 0.2
    }

    // Determine priority based on score and eligibility
    let priority: 'high' | 'medium' | 'low'
    if (eligibilityMatch && score >= 0.8) {
      priority = 'high'
    } else if (eligibilityMatch && score >= 0.5) {
      priority = 'medium'
    } else if (score >= 0.7) {
      priority = 'medium'
    } else {
      priority = 'low'
    }

    return {
      scheme,
      relevanceScore: Math.min(score, 1.0), // Cap at 1.0
      eligibilityMatch,
      reasoning: reasoning.join('; '),
      priority
    }
  }

  private static async saveRecommendations(result: DSSResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('scheme_recommendations')
        .upsert(
          {
            fra_claim_id: result.claimId,
            recommended_schemes: result.recommendations.map(r => ({
              scheme_id: r.scheme.id,
              scheme_name: r.scheme.name,
              relevance_score: r.relevanceScore,
              eligibility_match: r.eligibilityMatch,
              reasoning: r.reasoning,
              priority: r.priority
            })),
            engine_version: result.engineVersion
          },
          { onConflict: 'fra_claim_id' }
        )

      if (error) {
        console.error('Failed to save recommendations:', error)
        throw error
      }
    } catch (error) {
      console.error('Error saving DSS results:', error)
      throw error
    }
  }

  static async getRecommendations(claimId: string): Promise<DSSResult | null> {
    try {
      const { data, error } = await supabase
        .from('scheme_recommendations')
        .select('*')
        .eq('fra_claim_id', claimId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return null
      }

      // Reconstruct full scheme details
      const recommendations: SchemeRecommendation[] = data.recommended_schemes.map((rec: any) => ({
        scheme: GOVERNMENT_SCHEMES.find(s => s.id === rec.scheme_id) || {
          id: rec.scheme_id,
          name: rec.scheme_name,
          description: 'Scheme details not available',
          eligibilityCriteria: [],
          benefits: 'Contact local authorities for details',
          category: 'social' as const
        },
        relevanceScore: rec.relevance_score,
        eligibilityMatch: rec.eligibility_match,
        reasoning: rec.reasoning,
        priority: rec.priority
      }))

      const highPriorityCount = recommendations.filter(r => r.priority === 'high').length
      const mediumPriorityCount = recommendations.filter(r => r.priority === 'medium').length
      const lowPriorityCount = recommendations.filter(r => r.priority === 'low').length

      return {
        claimId,
        recommendations,
        totalSchemes: recommendations.length,
        highPriorityCount,
        mediumPriorityCount,
        lowPriorityCount,
        generatedAt: data.generated_at,
        engineVersion: data.engine_version
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return null
    }
  }

  // Bulk recommendation generation for admin use
  static async generateBulkRecommendations(
    district?: string,
    state?: string,
    limit: number = 100
  ): Promise<{ processed: number; failed: number }> {
    try {
      let query = supabase
        .from('fra_claims')
        .select('id')
        .eq('status', 'pending')
        .limit(limit)

      if (district) query = query.eq('district', district)
      if (state) query = query.eq('state', state)

      const { data: claims, error } = await query

      if (error || !claims) {
        throw new Error('Failed to fetch claims for bulk processing')
      }

      let processed = 0
      let failed = 0

      for (const claim of claims) {
        try {
          await this.generateRecommendations(claim.id)
          processed++
        } catch (error) {
          console.error(`Failed to process claim ${claim.id}:`, error)
          failed++
        }
      }

      return { processed, failed }
    } catch (error) {
      console.error('Bulk recommendation generation failed:', error)
      throw error
    }
  }

  // Get scheme by ID
  static getSchemeById(schemeId: string): GovernmentScheme | null {
    return GOVERNMENT_SCHEMES.find(s => s.id === schemeId) || null
  }

  // Get all available schemes
  static getAllSchemes(): GovernmentScheme[] {
    return [...GOVERNMENT_SCHEMES]
  }

  // Get schemes by category
  static getSchemesByCategory(category: GovernmentScheme['category']): GovernmentScheme[] {
    return GOVERNMENT_SCHEMES.filter(s => s.category === category)
  }
}
