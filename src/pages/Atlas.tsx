import React, { useState } from "react"
import { Layers, Filter, Search, Download, Eye, EyeOff, MapPin, TreePine, Droplets, Home } from "lucide-react"
import MapViewer from "@/components/MapViewer"

const Atlas = () => {
  const [activeFilters, setActiveFilters] = useState({
    state: "",
    district: "",
    claimType: "",
    status: "",
  })

  const [visibleLayers, setVisibleLayers] = useState({
    ifr: true,
    cfr: true,
    cr: true,
    villages: true,
    forest: false,
    water: false,
    agriculture: false,
  })

  const toggleLayer = (layer: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer as keyof typeof prev],
    }))
  }

  const layerItems = [
    { key: "ifr", label: "Individual Forest Rights (IFR)", icon: Home, color: "text-green-600" },
    { key: "cfr", label: "Community Forest Resource (CFR)", icon: TreePine, color: "text-green-700" },
    { key: "cr", label: "Community Rights (CR)", icon: MapPin, color: "text-blue-600" },
    { key: "villages", label: "Village Boundaries", icon: MapPin, color: "text-gray-600" },
    { key: "forest", label: "Forest Cover", icon: TreePine, color: "text-green-800" },
    { key: "water", label: "Water Bodies", icon: Droplets, color: "text-blue-500" },
    { key: "agriculture", label: "Agricultural Land", icon: Home, color: "text-yellow-600" },
  ]

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🗺️ Interactive FRA Atlas</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive visualization of Forest Rights Act claims and land resources
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Map</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map Controls Sidebar */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State</label>
                <select 
                  value={activeFilters.state}
                  onChange={(e) => setActiveFilters((prev) => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="madhya-pradesh">Madhya Pradesh</option>
                  <option value="chhattisgarh">Chhattisgarh</option>
                  <option value="jharkhand">Jharkhand</option>
                  <option value="odisha">Odisha</option>
                  <option value="assam">Assam</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">District</label>
                <select 
                  value={activeFilters.district}
                  onChange={(e) => setActiveFilters((prev) => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  <option value="bastar">Bastar</option>
                  <option value="khargone">Khargone</option>
                  <option value="aurangabad">Aurangabad</option>
                  <option value="guwahati">Guwahati</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Claim Type</label>
                <select 
                  value={activeFilters.claimType}
                  onChange={(e) => setActiveFilters((prev) => ({ ...prev, claimType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="ifr">Individual Forest Rights</option>
                  <option value="cfr">Community Forest Resource</option>
                  <option value="cr">Community Rights</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select 
                  value={activeFilters.status}
                  onChange={(e) => setActiveFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search village, block..." 
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setActiveFilters({ state: "", district: "", claimType: "", status: "" })}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Map Layers</h2>
            </div>
            <div className="space-y-3">
              {layerItems.map((layer) => {
                const Icon = layer.icon
                const isVisible = visibleLayers[layer.key as keyof typeof visibleLayers]
                return (
                  <div key={layer.key} className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={isVisible} 
                      onChange={() => toggleLayer(layer.key)} 
                      id={layer.key}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Icon className={`w-4 h-4 ${layer.color}`} />
                    <label htmlFor={layer.key} className="text-sm flex-1 cursor-pointer text-gray-700">
                      {layer.label}
                    </label>
                    <button 
                      onClick={() => toggleLayer(layer.key)} 
                      className="p-1 h-auto text-gray-400 hover:text-gray-600"
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Legend</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
                <span className="text-sm text-gray-700">Approved Claims</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow"></div>
                <span className="text-sm text-gray-700">Pending Claims</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                <span className="text-sm text-gray-700">Under Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
                <span className="text-sm text-gray-700">Rejected Claims</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <MapViewer height="600px" showControls={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Atlas
