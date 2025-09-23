"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SplitText from "@/components/SplitText"
import { Plus, Search, Filter, Download, FileText, Eye, Edit, Upload, MapPin } from "lucide-react"

interface Claim {
  id: string
  holderName: string
  village: string
  district: string
  state: string
  type: "IFR" | "CFR" | "CR"
  area: number
  status: "Approved" | "Pending" | "Under Review" | "Rejected"
  dateSubmitted: string
  coordinates?: { lat: number; lng: number }
}

const Claims = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all-status")
  const [typeFilter, setTypeFilter] = useState("all-types")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Sample claims data
  const [claims] = useState<Claim[]>([
    {
      id: "FRA001",
      holderName: "Ramesh Kumar",
      village: "Khargone",
      district: "Khargone",
      state: "Madhya Pradesh",
      type: "IFR",
      area: 2.5,
      status: "Approved",
      dateSubmitted: "2024-01-15",
      coordinates: { lat: 22.7196, lng: 75.8577 },
    },
    {
      id: "FRA002",
      holderName: "Bastar Tribal Committee",
      village: "Jagdalpur",
      district: "Bastar",
      state: "Chhattisgarh",
      type: "CFR",
      area: 45.2,
      status: "Pending",
      dateSubmitted: "2024-01-14",
      coordinates: { lat: 19.0822, lng: 82.0174 },
    },
    {
      id: "FRA003",
      holderName: "Sunita Devi",
      village: "Aurangabad",
      district: "Aurangabad",
      state: "Maharashtra",
      type: "CR",
      area: 12.8,
      status: "Under Review",
      dateSubmitted: "2024-01-13",
      coordinates: { lat: 19.8762, lng: 75.3433 },
    },
    {
      id: "FRA004",
      holderName: "Mohan Singh",
      village: "Guwahati",
      district: "Kamrup",
      state: "Assam",
      type: "IFR",
      area: 3.1,
      status: "Approved",
      dateSubmitted: "2024-01-12",
      coordinates: { lat: 26.1445, lng: 91.7362 },
    },
    {
      id: "FRA005",
      holderName: "Kamla Community",
      village: "Raipur",
      district: "Raipur",
      state: "Chhattisgarh",
      type: "CFR",
      area: 78.5,
      status: "Rejected",
      dateSubmitted: "2024-01-10",
      coordinates: { lat: 21.2514, lng: 81.6296 },
    },
  ])

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all-status" || !statusFilter || claim.status === statusFilter
    const matchesType = typeFilter === "all-types" || !typeFilter || claim.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success border-success/20"
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "Under Review":
        return "bg-accent/10 text-accent border-accent/20"
      case "Rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "IFR":
        return "bg-primary/10 text-primary border-primary/20"
      case "CFR":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "CR":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <SplitText
              text="FRA Claims Explorer"
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
            />

          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add New Claim</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New FRA Claim</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holderName">Patta Holder Name</Label>
                      <Input id="holderName" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="village">Village</Label>
                      <Input id="village" placeholder="Village name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input id="district" placeholder="District" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mp">Madhya Pradesh</SelectItem>
                          <SelectItem value="cg">Chhattisgarh</SelectItem>
                          <SelectItem value="jh">Jharkhand</SelectItem>
                          <SelectItem value="od">Odisha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Claim Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ifr">Individual Forest Rights</SelectItem>
                          <SelectItem value="cfr">Community Forest Resource</SelectItem>
                          <SelectItem value="cr">Community Rights</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">Area (Hectares)</Label>
                      <Input id="area" type="number" placeholder="0.0" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coordinates">Coordinates</Label>
                      <Input id="coordinates" placeholder="Lat, Lng (optional)" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Additional details about the claim..." />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddModalOpen(false)}>Add Claim</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, village, or claim ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  <SelectItem value="IFR">Individual Forest Rights</SelectItem>
                  <SelectItem value="CFR">Community Forest Resource</SelectItem>
                  <SelectItem value="CR">Community Rights</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all-status")
                  setTypeFilter("all-types")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Claims Table */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <SplitText
                text={`Claims Data (${filteredClaims.length} records)`}
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Total Area: {filteredClaims.reduce((sum, claim) => sum + claim.area, 0).toFixed(1)} Ha</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-700">Claim ID</th>
                    <th className="text-left p-3 font-medium text-gray-700">Patta Holder</th>
                    <th className="text-left p-3 font-medium text-gray-700">Location</th>
                    <th className="text-left p-3 font-medium text-gray-700">Type</th>
                    <th className="text-left p-3 font-medium text-gray-700">Area (Ha)</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                    <th className="text-left p-3 font-medium text-gray-700">Submitted</th>
                    <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{claim.id}</td>
                      <td className="p-3">{claim.holderName}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{claim.village}</div>
                          <div className="text-gray-600 text-xs">
                            {claim.district}, {claim.state}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getTypeColor(claim.type)}>{claim.type}</Badge>
                      </td>
                      <td className="p-3">{claim.area.toFixed(1)}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                      </td>
                      <td className="p-3 text-gray-600">{claim.dateSubmitted}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
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

export default Claims
