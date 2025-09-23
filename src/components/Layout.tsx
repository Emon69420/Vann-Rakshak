import type React from "react"
import { useState, Suspense } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut, Settings } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

// Simple Navigation Component
const SimpleNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: "" },
    { name: "Atlas", path: "/atlas", icon: "" },
    { name: "Claims", path: "/claims", icon: "" },
    { name: "Decision Support", path: "/dss", icon: "" },
    { name: "Asset Mapping", path: "/assets", icon: "" },
    { name: "Analytics", path: "/analytics", icon: "" },
    { name: "Admin", path: "/admin", icon: "" },
    { name: "OCR Processing", path: "/ocr", icon: "" },
  ]
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl"></span>
              <span className="font-bold text-xl text-gray-900">Vann Rakshak</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  )
}

export default Layout
