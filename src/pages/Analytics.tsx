import React, { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"
import { BarChart3, TrendingUp, PieChartIcon, Activity, MapPin, Download, Satellite, Zap } from "lucide-react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

// Sample data based on the images provided
const assetDistributionData = [
  { name: "DAJGUA", value: 1740, color: "#f97316" },
  { name: "MGNREGA", value: 1200, color: "#3b82f6" },
  { name: "Jal_Jeevan_Mission", value: 800, color: "#10b981" },
  { name: "Other/None", value: 400, color: "#6b7280" },
]

const districtWiseData = [
  { district: "Nizamabad", assets: 120 },
  { district: "Udaipur", assets: 110 },
  { district: "Hyderabad", assets: 105 },
  { district: "Kailashahar", assets: 98 },
  { district: "Warangal", assets: 95 },
  { district: "Agartala", assets: 88 },
  { district: "Karimnagar", assets: 85 },
  { district: "Dharmanagar", assets: 82 },
  { district: "Cuttack", assets: 78 },
  { district: "Balasore", assets: 75 },
]

const ndviNdwiData = [
  { type: "irrigation_channel", ndvi: 0.42, ndwi: 0.12 },
  { type: "water_tank", ndvi: 0.69, ndwi: 0.53 },
  { type: "forest", ndvi: 0.65, ndwi: 0.32 },
  { type: "plantation", ndvi: 0.56, ndwi: 0.47 },
  { type: "pipeline", ndvi: 0.54, ndwi: 0.64 },
  { type: "community_tap", ndvi: 0.48, ndwi: 0.42 },
  { type: "farm_pond", ndvi: 0.42, ndwi: 0.33 },
  { type: "farm", ndvi: 0.42, ndwi: 0.15 },
  { type: "solar_pump", ndvi: 0.36, ndwi: 0.52 },
  { type: "pond", ndvi: 0.12, ndwi: 0.52 },
]

const confidenceScoreData = [
  { date: "May 9", confidence: 0.82 },
  { date: "May 10", confidence: 0.86 },
  { date: "May 15", confidence: 0.87 },
  { date: "May 18", confidence: 0.87 },
  { date: "May 20", confidence: 0.9 },
  { date: "May 22", confidence: 0.86 },
  { date: "May 27", confidence: 0.86 },
  { date: "May 28", confidence: 0.86 },
  { date: "May 30", confidence: 0.85 },
  { date: "Aug 19", confidence: 0.8 },
]

const fundingSourceData = [
  { name: "Central Government", value: 45, color: "#ef4444" },
  { name: "State Government", value: 30, color: "#3b82f6" },
  { name: "Private Sector", value: 15, color: "#10b981" },
  { name: "International Aid", value: 10, color: "#f59e0b" },
]

const assetTypeDistribution = [
  { type: "pond", count: 450 },
  { type: "farm", count: 380 },
  { type: "forest", count: 320 },
  { type: "community_tap", count: 180 },
  { type: "plantation", count: 150 },
  { type: "farm_pond", count: 120 },
  { type: "solar_pump", count: 80 },
  { type: "irrigation_channel", count: 60 },
]

const assetStatusData = [
  { name: "Active", value: 65, color: "#10b981" },
  { name: "Under Construction", value: 20, color: "#f59e0b" },
  { name: "Planned", value: 10, color: "#3b82f6" },
  { name: "Inactive", value: 5, color: "#ef4444" },
]

const chartConfig = {
  ndvi: {
    label: "NDVI",
    color: "hsl(var(--chart-1))",
  },
  ndwi: {
    label: "NDWI",
    color: "hsl(var(--chart-2))",
  },
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-3))",
  },
  assets: {
    label: "Assets",
    color: "hsl(var(--chart-1))",
  },
}

// Add deterministic PRNG to vary data per state
function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function vary(n: number, rnd: () => number, factor = 0.15) {
  const delta = (rnd() * 2 - 1) * factor // +/- factor
  return Math.max(0, Math.round(n * (1 + delta)))
}
function varyFloat(n: number, rnd: () => number, factor = 0.1, decimals = 2) {
  const delta = (rnd() * 2 - 1) * factor
  return Number((n * (1 + delta)).toFixed(decimals))
}
function generateDataForState(state: string) {
  const seed = xmur3(state)()
  const rnd = mulberry32(seed)

  const nextAssetDistribution = assetDistributionData.map((d) => ({
    ...d,
    value: vary(d.value, rnd, 0.2),
  }))

  const nextAssetTypeDistribution = assetTypeDistribution.map((d) => ({
    ...d,
    count: vary(d.count, rnd, 0.25),
  }))

  const nextAssetStatus = assetStatusData.map((d) => ({
    ...d,
    value: vary(d.value, rnd, 0.15),
  }))

  const nextNDVI_NDWI = ndviNdwiData.map((d) => ({
    ...d,
    ndvi: varyFloat(d.ndvi, rnd, 0.12, 2),
    ndwi: varyFloat(d.ndwi, rnd, 0.12, 2),
  }))

  const nextConfidence = confidenceScoreData.map((d) => ({
    ...d,
    confidence: varyFloat(d.confidence, rnd, 0.06, 2),
  }))

  const nextDistrictWise = districtWiseData
    .map((d) => ({ ...d, assets: vary(d.assets, rnd, 0.25) }))
    .sort((a, b) => b.assets - a.assets)

  const totalAssets = nextAssetDistribution.reduce((s, x) => s + x.value, 0)
  const totalAreaHa = varyFloat(80, rnd, 0.2, 2) // base 80ha +/-20%
  const avgAreaHa = totalAssets ? Number((totalAreaHa / totalAssets).toFixed(2)) : 0

  return {
    assetDistributionData: nextAssetDistribution,
    assetTypeDistribution: nextAssetTypeDistribution,
    assetStatusData: nextAssetStatus,
    ndviNdwiData: nextNDVI_NDWI, // FIX: was nextNDVI_NDVI
    confidenceScoreData: nextConfidence,
    districtWiseData: nextDistrictWise,
    metrics: {
      totalAssets: totalAssets.toLocaleString(),
      totalArea: `${totalAreaHa} ha`,
      avgArea: `${avgAreaHa} ha`,
      assetTypes: String(nextAssetTypeDistribution.length),
    },
  }
}

const Analytics = () => {
  const [selectedState, setSelectedState] = useState("chhattisgarh")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  const initial = generateDataForState("chhattisgarh")

  // NEW: stateful datasets initialized from generated data
  const [assetDist, setAssetDist] = useState(initial.assetDistributionData)
  const [assetTypeDist, setAssetTypeDist] = useState(initial.assetTypeDistribution)
  const [assetStatus, setAssetStatus] = useState(initial.assetStatusData)
  const [ndviNdwi, setNdviNdwi] = useState(initial.ndviNdwiData)
  const [confidence, setConfidence] = useState(initial.confidenceScoreData)
  const [districtWise, setDistrictWise] = useState(initial.districtWiseData)
  const [metrics, setMetrics] = useState(initial.metrics)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Asset Insights Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of FRA assets, schemes, and performance metrics
          </p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={selectedState} 
            onChange={(e) => {
              const st = e.target.value
              setSelectedState(st)
              setIsLoading(true)
              setTimeout(() => {
                try {
                  const next = generateDataForState(st)
                  setAssetDist(next.assetDistributionData)
                  setAssetTypeDist(next.assetTypeDistribution)
                  setAssetStatus(next.assetStatusData)
                  setNdviNdwi(next.ndviNdwiData)
                  setConfidence(next.confidenceScoreData)
                  setDistrictWise(next.districtWiseData)
                  setMetrics(next.metrics) // metrics change per state
                } catch (err) {
                  console.error('Failed to update analytics', err)
                } finally {
                  setIsLoading(false)
                }
              }, 800)
            }}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="telangana">Telangana</option>
            <option value="odisha">Odisha</option>
            <option value="chhattisgarh">Chhattisgarh</option>
            <option value="jharkhand">Jharkhand</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-4">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "interactive", label: "Interactive Charts", icon: "📈" },
          { id: "advanced", label: "Advanced Analytics", icon: "⚡" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id 
                ? "bg-blue-100 text-blue-700 border border-blue-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-md bg-white shadow border border-gray-200">
              <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm text-gray-700">Updating analytics…</span>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Assets", value: metrics.totalAssets, description: "Total number of assets", icon: "📊", trend: "+5%" },
          { title: "Total Area", value: metrics.totalArea, description: "Total area covered", icon: "🏞️", trend: "+2.3%" },
          { title: "Average Area", value: metrics.avgArea, description: "Average area per asset", icon: "📏", trend: "-1.2%" },
          { title: "Asset Types", value: metrics.assetTypes, description: "Unique asset categories", icon: "🏗️", trend: "0%" },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">{stat.trend}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Asset Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Asset Type Distribution</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Distribution of different asset types across regions</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetTypeDist} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Status Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Asset Status Overview</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Distribution of assets by their current operational status</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NDVI & NDWI Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Satellite className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">NDVI & NDWI Analysis</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Average vegetation and water index by asset type</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ndviNdwi} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ndvi" fill="#10B981" name="Avg. NDVI" />
                  <Bar dataKey="ndwi" fill="#3B82F6" name="Avg. NDWI" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-gray-600">
              <p><strong>Avg. NDVI:</strong> {(
                ndviNdwi.reduce((s, d) => s + d.ndvi, 0) / ndviNdwi.length
              ).toFixed(3)}</p>
              <p><strong>Avg. NDWI:</strong> {(
                ndviNdwi.reduce((s, d) => s + d.ndwi, 0) / ndviNdwi.length
              ).toFixed(3)}</p>
            </div>
          </div>

          {/* Confidence Score Tracking */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Confidence Score Tracking</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Confidence scores of seasonal assets over time</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidence} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0.7, 1]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {activeTab === "interactive" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Interactive Charts</h2>
          <p className="text-gray-600">Interactive analytics features coming soon...</p>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Advanced Analytics</h2>
          <p className="text-gray-600">Advanced AI-powered analytics coming soon...</p>
        </div>
      )}

      {/* Scheme Share Analysis - Always visible */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Scheme Share Analysis</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">Distribution of assets across different government schemes</p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDist}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {assetDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Scheme Details</h4>
            {assetDist.map((scheme, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: scheme.color }} />
                  <span className="font-medium text-gray-900">{scheme.name.replace(/_/g, " ")}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{scheme.value}</div>
                  <div className="text-xs text-gray-500">
                    {(
                      (scheme.value / assetDist.reduce((sum, item) => sum + item.value, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total Assets:</span>
                <span>{assetDist.reduce((sum, item) => sum + item.value, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
