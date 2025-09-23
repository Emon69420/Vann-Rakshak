import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StatsCard from "@/components/StatsCard"
import MapViewer from "@/components/MapViewer"
import SplitText from "@/components/SplitText"
import { FileText, CheckCircle, Clock, AlertCircle, Users, MapPin, TrendingUp, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const handleAnimationComplete = () => {
    console.log("Title animation completed!")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="FRA Atlas Dashboard"
              className="text-3xl font-heading font-bold text-gray-900"
              tag="h1"
              delay={0}
              duration={0}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="left"
              onLetterAnimationComplete={handleAnimationComplete}
            />

          </div>
          <div className="flex space-x-3">
            <Link to="/claims">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <FileText className="w-4 h-4" />
                <span>Add New Claim</span>
              </Button>
            </Link>
            <Link to="/atlas">
              <Button className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>View Atlas</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview - Traditional Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Claims"
            value="2,847"
            description="All FRA claims in system"
            icon={FileText}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Approved Claims"
            value="1,923"
            description="Successfully processed"
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pending Review"
            value="624"
            description="Awaiting verification"
            icon={Clock}
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard
            title="Beneficiaries"
            value="8,471"
            description="Patta holders served"
            icon={Users}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Overview */}
          <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <SplitText
                  text="FRA Claims Overview"
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
              <MapViewer height="400px" />
              <div className="flex justify-end mt-4">
                <Link to="/atlas">
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <span>View Full Atlas</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <SplitText
                    text="Quick Actions"
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
              <CardContent className="space-y-3">
                <Link to="/claims" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Claims
                  </Button>
                </Link>
                <Link to="/dss" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Decision Support
                  </Button>
                </Link>
                <Link to="/assets" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Asset Mapping
                  </Button>
                </Link>
                <Link to="/ocr" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="w-4 h-4 mr-2" />
                    OCR Processing
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <SplitText
                    text="Recent Alerts"
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
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Pending Claims Review</p>
                    <p className="text-xs text-gray-600">624 claims awaiting verification in Bastar district</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Scheme Matching</p>
                    <p className="text-xs text-gray-600">247 new scheme recommendations generated</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Asset Data Updated</p>
                    <p className="text-xs text-gray-600">Satellite imagery refreshed for 12 districts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Claims Table Preview */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <SplitText
                text="Recent Claims"
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
            <Link to="/claims">
              <Button variant="outline" size="sm">
                View All Claims
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 font-medium text-gray-700">Claim ID</th>
                    <th className="text-left p-2 font-medium text-gray-700">Village</th>
                    <th className="text-left p-2 font-medium text-gray-700">Type</th>
                    <th className="text-left p-2 font-medium text-gray-700">Area (Ha)</th>
                    <th className="text-left p-2 font-medium text-gray-700">Status</th>
                    <th className="text-left p-2 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "FRA001",
                      village: "Khargone",
                      type: "IFR",
                      area: "2.5",
                      status: "Approved",
                      date: "2024-01-15",
                    },
                    {
                      id: "FRA002",
                      village: "Bastar",
                      type: "CFR",
                      area: "45.2",
                      status: "Pending",
                      date: "2024-01-14",
                    },
                    {
                      id: "FRA003",
                      village: "Aurangabad",
                      type: "CR",
                      area: "12.8",
                      status: "Under Review",
                      date: "2024-01-13",
                    },
                    {
                      id: "FRA004",
                      village: "Guwahati",
                      type: "IFR",
                      area: "3.1",
                      status: "Approved",
                      date: "2024-01-12",
                    },
                  ].map((claim, index) => (
                    <tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-2 font-medium">{claim.id}</td>
                      <td className="p-2">{claim.village}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{claim.type}</span>
                      </td>
                      <td className="p-2">{claim.area}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            claim.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : claim.status === "Pending"
                                ? "bg-orange-100 text-orange-800"
                                : claim.status === "Under Review"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-2 text-gray-600">{claim.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
