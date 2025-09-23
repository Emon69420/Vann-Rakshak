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

const DecisionSupport = () => {
  const [selectedClaim, setSelectedClaim] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const claims = [
    { id: "FRA001", holder: "Ramesh Kumar", village: "Khargone", type: "IFR" },
    { id: "FRA002", holder: "Bastar Tribal Committee", village: "Jagdalpur", type: "CFR" },
    { id: "FRA003", holder: "Sunita Devi", village: "Aurangabad", type: "CR" },
  ]

  const recommendations = [
    {
      id: "pm-kisan",
      name: "PM-KISAN",
      description: "Direct income support to farmer families",
      benefits: "₹6,000 per year in three installments",
      matchScore: 95,
      category: "Agriculture",
      icon: "🌾",
      color: "bg-green-100 text-green-800"
    },
    {
      id: "jal-jeevan",
      name: "Jal Jeevan Mission",
      description: "Providing functional household tap water connection",
      benefits: "Functional tap water connection with adequate pressure",
      matchScore: 87,
      category: "Water",
      icon: "💧",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "mgnrega",
      name: "MGNREGA",
      description: "Guaranteed wage employment for rural households",
      benefits: "100 days guaranteed employment per year",
      matchScore: 89,
      category: "Livelihood",
      icon: "💼",
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: "pmay-g",
      name: "PM Awas Yojana - Gramin",
      description: "Housing assistance for rural poor",
      benefits: "₹1.20 lakh assistance for plain areas",
      matchScore: 73,
      category: "Housing",
      icon: "🏠",
      color: "bg-orange-100 text-orange-800"
    },
  ]

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🤖 Decision Support System</h1>
          <p className="text-gray-600 mt-2">
            AI-powered scheme recommendations based on asset analysis and eligibility
          </p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={isAnalyzing}
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
          onChange={(e) => setSelectedClaim(e.target.value)}
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

      {/* Asset Analysis */}
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
          {recommendations.map((scheme) => (
            <div key={scheme.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{scheme.icon}</span>
                  <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${scheme.color}`}>
                    {scheme.matchScore}% Match
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{scheme.description}</p>
              <p className="text-gray-800 text-sm font-medium mb-3">{scheme.benefits}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${scheme.color}`}>
                  {scheme.category}
                </span>
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                  <span>Apply Now</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DecisionSupport