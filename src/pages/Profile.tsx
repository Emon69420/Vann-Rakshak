import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SplitText from "@/components/SplitText"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  Edit2,
  Save,
  Camera,
  Award,
  FileText,
  Activity,
} from "lucide-react"

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Suman Sharma",
    email: "suman.sharma@fraatlas.gov.in",
    phone: "+91 98765 43210",
    designation: "Forest Rights Officer",
    department: "Ministry of Tribal Affairs",
    location: "New Delhi, India",
    joinedDate: "2022-03-15",
    employeeId: "FRO-2022-001",
    bio: "Experienced Forest Rights Officer working to empower tribal communities through the Forest Rights Act. Specialized in GIS mapping, community engagement, and legal compliance.",
    avatar: "/placeholder-avatar.jpg",
    certifications: [
      "Forest Rights Act Specialist",
      "GIS Professional Certification",
      "Community Development Certificate"
    ],
    stats: {
      claimsProcessed: 247,
      surveysCompleted: 89,
      communitiesServed: 23,
      yearsExperience: 8
    }
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would normally save to backend
    console.log("Profile updated:", profile)
  }

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
              text="User Profile"
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
              text="Manage your personal information and account settings"
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
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="bg-transparent"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="grid gap-6 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Card */}
          <motion.div className="lg:col-span-1" variants={cardVariants}>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-blue-600" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-300 hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">{profile.designation}</p>
              <p className="text-sm text-gray-500">{profile.department}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white border border-gray-200 shadow-sm mt-6">
              <CardHeader>
                <CardTitle>
                  <SplitText
                    text="Performance Stats"
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
                <div className="space-y-4">
                  {Object.entries(profile.stats).map(([key, value], index) => (
                    <motion.div 
                      key={key} 
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <motion.span 
                        className="font-semibold text-gray-900"
                        whileHover={{ scale: 1.1 }}
                      >
                        {value}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div className="lg:col-span-2" variants={cardVariants}>
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <SplitText
                    text="Personal Information"
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
            
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Employee ID</span>
                  </label>
                  <p className="px-3 py-2 text-gray-900 bg-gray-50 rounded-md">{profile.employeeId}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Designation</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.designation}
                      onChange={(e) => updateProfile('designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.designation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => updateProfile('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="px-3 py-2 text-gray-900">{profile.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Bio</span>
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900">{profile.bio}</p>
                )}
              </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-white border border-gray-200 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <SplitText
                    text="Certifications & Qualifications"
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
                <div className="space-y-3">
                  {profile.certifications.map((cert, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileHover={{ x: 10 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-900">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border border-gray-200 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <SplitText
                    text="Recent Activity"
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
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Completed FRA claim verification for Village Khandwa</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Updated GIS mapping for 5 forest plots</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Attended community meeting in Balaghat district</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile