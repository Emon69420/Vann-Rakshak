import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SplitText from "@/components/SplitText"
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Save,
  RefreshCw,
} from "lucide-react"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      claimUpdates: true,
      systemAlerts: true,
    },
    display: {
      theme: "light",
      language: "en",
      timezone: "Asia/Kolkata",
      mapDefaultView: "terrain",
    },
    privacy: {
      shareAnalytics: false,
      publicProfile: false,
      dataRetention: "1year",
    },
    system: {
      autoSave: true,
      cacheSize: "100MB",
      exportFormat: "JSON",
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "system", label: "System", icon: Database },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <SplitText
              text="Settings"
              className="text-3xl font-heading font-bold text-gray-900"
              tag="h1"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="left"
            />
            <SplitText
              text="Manage your FRA Atlas preferences and system configuration"
              className="text-gray-600 mt-2"
              delay={30}
              duration={0.6}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="left"
            />
          </div>
          <div className="flex space-x-3">
            <Button className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-6 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Settings Tabs */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <SplitText
                    text="Settings Categories"
                    className="text-lg font-semibold"
                    delay={40}
                    duration={0.5}
                    ease="power2.out"
                    splitType="words"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    textAlign="left"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </motion.button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
            
                {/* General Settings */}
                {activeTab === "general" && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SplitText
                      text="General Settings"
                      className="text-lg font-semibold text-gray-900"
                      delay={40}
                      duration={0.5}
                      ease="power2.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      textAlign="left"
                    />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Theme</label>
                    <select 
                      value={settings.display.theme}
                      onChange={(e) => updateSetting('display', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <select 
                      value={settings.display.language}
                      onChange={(e) => updateSetting('display', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                    <select 
                      value={settings.display.timezone}
                      onChange={(e) => updateSetting('display', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Map View</label>
                    <select 
                      value={settings.display.mapDefaultView}
                      onChange={(e) => updateSetting('display', 'mapDefaultView', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="openstreetmap">OpenStreetMap</option>
                      <option value="satellite">Satellite</option>
                      <option value="terrain">Terrain</option>
                    </select>
                  </div>
                    </div>
                  </motion.div>
                )}

                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SplitText
                      text="Notification Preferences"
                      className="text-lg font-semibold text-gray-900"
                      delay={40}
                      duration={0.5}
                      ease="power2.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      textAlign="left"
                    />
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'pushNotifications' && 'Receive browser push notifications'}
                          {key === 'claimUpdates' && 'Get notified about FRA claim status changes'}
                          {key === 'systemAlerts' && 'Receive system maintenance and security alerts'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  ))}
                    </div>
                  </motion.div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SplitText
                      text="Privacy & Security"
                      className="text-lg font-semibold text-gray-900"
                      delay={40}
                      duration={0.5}
                      ease="power2.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      textAlign="left"
                    />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Share Analytics Data</h4>
                      <p className="text-sm text-gray-500">Help improve FRA Atlas by sharing anonymous usage data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareAnalytics}
                      onChange={(e) => updateSetting('privacy', 'shareAnalytics', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Public Profile</h4>
                      <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.publicProfile}
                      onChange={(e) => updateSetting('privacy', 'publicProfile', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Data Retention Period</label>
                    <select 
                      value={settings.privacy.dataRetention}
                      onChange={(e) => updateSetting('privacy', 'dataRetention', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="6months">6 Months</option>
                      <option value="1year">1 Year</option>
                      <option value="2years">2 Years</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>
                    </div>
                  </motion.div>
                )}

                {/* System Settings */}
                {activeTab === "system" && (
                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SplitText
                      text="System Configuration"
                      className="text-lg font-semibold text-gray-900"
                      delay={40}
                      duration={0.5}
                      ease="power2.out"
                      splitType="words"
                      from={{ opacity: 0, y: 20 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      textAlign="left"
                    />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Auto-save</h4>
                      <p className="text-sm text-gray-500">Automatically save changes as you work</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.autoSave}
                      onChange={(e) => updateSetting('system', 'autoSave', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cache Size Limit</label>
                    <select 
                      value={settings.system.cacheSize}
                      onChange={(e) => updateSetting('system', 'cacheSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="50MB">50 MB</option>
                      <option value="100MB">100 MB</option>
                      <option value="250MB">250 MB</option>
                      <option value="500MB">500 MB</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Export Format</label>
                    <select 
                      value={settings.system.exportFormat}
                      onChange={(e) => updateSetting('system', 'exportFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="JSON">JSON</option>
                      <option value="CSV">CSV</option>
                      <option value="XML">XML</option>
                      <option value="PDF">PDF</option>
                    </select>
                  </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings