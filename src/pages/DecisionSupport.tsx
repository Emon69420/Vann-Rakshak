import React, { useState } from "react"
import {
  Brain,
  Target,
  TrendingUp,
  Droplets,
  Wheat,
  TreePine,
  Home,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { generateRecommendationsFromHF, type SchemeRecommendation } from "../utils/hf"

const DecisionSupport = () => {
  const [selectedClaim, setSelectedClaim] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<SchemeRecommendation[]>([])
  const [hasAnalyzed, setHasAnalyzed] = useState(false) // NEW

  const claims = [
    { id: "FRA001", holder: "Ramesh Kumar", village: "Khargone", type: "IFR" },
    { id: "FRA002", holder: "Bastar Tribal Committee", village: "Jagdalpur", type: "CFR" },
    { id: "FRA003", holder: "Sunita Devi", village: "Aurangabad", type: "CR" },
  ]

  const runAnalysis = async () => {
    if (!selectedClaim) return
    setIsAnalyzing(true)
    setHasAnalyzed(false) // reset while running
    try {
      const claim = claims.find(c => c.id === selectedClaim)!
      // Optionally pass OCR text if you have it in app state
      const recs = await generateRecommendationsFromHF({ claim })
      setRecommendations(recs)
    } catch (e) {
      console.error(e)
      // fallback static if HF fails
      setRecommendations([
        { id: "mgnrega", name: "MGNREGA", description: "Guaranteed wage employment", benefits: "100 days work", matchScore: 85, category: "Livelihood", icon: "💼" },
        { id: "pm-kisan", name: "PM-KISAN", description: "Income support to farmers", benefits: "₹6,000/year", matchScore: 78, category: "Agriculture", icon: "🌾" },
      ])
    } finally {
      setIsAnalyzing(false)
      setHasAnalyzed(true) // show analysis sections only after run
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Decision Support System</h1>
          <p className="text-gray-600 mt-2">
            AI-powered scheme recommendations based on asset analysis and eligibility
          </p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={isAnalyzing || !selectedClaim} // disable until a claim is chosen
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
        </button>
      </div>

      {/* Claim Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select FRA Claim for Analysis</h2>
        <select 
          value={selectedClaim}
          onChange={(e) => { setSelectedClaim(e.target.value); setRecommendations([]); setHasAnalyzed(false) }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a claim to analyze...</option>
          {claims.map((claim) => (
            <option key={claim.id} value={claim.id}>
              {claim.id} - {claim.holder} ({claim.village})
            </option>
          ))}
        </select>
      </div>

      {/* Show a prompt until analysis is run */}
      {!hasAnalyzed && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-sm text-gray-600">
          Select a claim and click “Run Analysis” to view Asset Analysis, Eligibility, and Recommended Schemes.
        </div>
      )}

      {/* Analysis sections only after run */}
      {hasAnalyzed && (
        <>
          {/* Asset Analysis + Eligibility */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Analysis</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Agricultural Land</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Forest Area</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Homestead</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Water Access</span>
                  <span className="text-yellow-600 text-sm">Seasonal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Land Area</span>
                  <span className="text-gray-900 font-medium">2.5 hectares</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Status</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Valid FRA Title Holder</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Rural Household</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Below Poverty Line</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Tribal Community Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Government Schemes</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {(recommendations.length ? recommendations : []).map((scheme) => (
                <div key={scheme.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{scheme.icon}</span>
                      <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${scheme.matchScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {scheme.matchScore}% Match
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{scheme.description}</p>
                  <p className="text-gray-800 text-sm font-medium mb-3">{scheme.benefits}</p>
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {scheme.category}
                    </span>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {!recommendations.length && (
                <div className="text-sm text-gray-500">
                  Select a claim and click “Run Analysis” to fetch dynamic recommendations.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DecisionSupport