"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Map,
  Database,
  Brain,
  Satellite,
  Settings,
  FileText,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  BarChart3,
  Scan,
  UserCog,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"

interface NavigationProps {
  onAuthClick?: () => void
}

const Navigation: React.FC<NavigationProps> = ({ onAuthClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: Database,
      roles: ["patta_holder", "district_admin", "state_admin", "super_admin"],
    },
    {
      path: "/atlas",
      label: "FRA Atlas",
      icon: Map,
      roles: ["patta_holder", "district_admin", "state_admin", "super_admin"],
    },
    {
      path: "/claims",
      label: "Claims Explorer",
      icon: FileText,
      roles: ["patta_holder", "district_admin", "state_admin", "super_admin"],
    },
    {
      path: "/dss",
      label: "Decision Support",
      icon: Brain,
      roles: ["patta_holder", "district_admin", "state_admin", "super_admin"],
    },
    {
      path: "/assets",
      label: "Asset Mapping",
      icon: Satellite,
      roles: ["district_admin", "state_admin", "super_admin"],
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      roles: ["district_admin", "state_admin", "super_admin"],
    },
    {
      path: "/ocr",
      label: "OCR Processing",
      icon: Scan,
      roles: ["district_admin", "state_admin", "super_admin"],
    },
    { path: "/admin", label: "Admin", icon: Settings, roles: ["district_admin", "state_admin", "super_admin"] },
  ]

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => !profile || item.roles.includes(profile.role))

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-500"
      case "state_admin":
        return "bg-purple-500"
      case "district_admin":
        return "bg-blue-500"
      case "patta_holder":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const isActive = (path: string) => location.pathname === path

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  }

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  }

  return (
    <nav className="bg-gradient-primary border-b border-border shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-white">FRA Atlas</h1>
                <p className="text-xs text-white/80">Decision Support System</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {filteredNavItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      size="sm"
                      className={`
                        flex items-center space-x-2 transition-all duration-200
                        ${
                          isActive(item.path)
                            ? "bg-white/20 text-white shadow-glow"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              )
            })}

            {/* User Menu */}
            {user && profile ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-4 text-white hover:bg-white/10">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="hidden lg:block text-left">
                          <div className="text-sm font-medium">{profile.full_name}</div>
                          <div className="text-xs text-white/70 capitalize">{profile.role.replace("_", " ")}</div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="pb-2">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium">{profile.full_name}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <Badge className={`w-fit text-white ${getRoleBadgeColor(profile.role)}`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {profile.role.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onAuthClick}
                  className="ml-4 bg-white/20 text-white hover:bg-white/30"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-white/20 overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex flex-col space-y-2">
                {filteredNavItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.path}
                      variants={mobileItemVariants}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          variant={isActive(item.path) ? "secondary" : "ghost"}
                          size="sm"
                          className={`
                            w-full justify-start space-x-3
                            ${
                              isActive(item.path)
                                ? "bg-white/20 text-white"
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Mobile User Info */}
                {user && profile ? (
                  <motion.div className="pt-4 border-t border-white/20 space-y-2" variants={mobileItemVariants}>
                    <div className="px-3 py-2 text-white">
                      <div className="font-medium">{profile.full_name}</div>
                      <div className="text-sm text-white/70">{profile.email}</div>
                      <Badge className={`mt-2 text-white ${getRoleBadgeColor(profile.role)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {profile.role.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate('/profile')
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full justify-start space-x-3 text-white/90 hover:bg-white/10"
                      >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate('/settings')
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full justify-start space-x-3 text-white/90 hover:bg-white/10"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleSignOut()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full justify-start space-x-3 text-red-300 hover:bg-red-500/20"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div className="pt-4 border-t border-white/20" variants={mobileItemVariants}>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          onAuthClick?.()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full justify-start space-x-3 bg-white/20 text-white hover:bg-white/30"
                      >
                        <User className="w-5 h-5" />
                        <span>Sign In</span>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navigation
