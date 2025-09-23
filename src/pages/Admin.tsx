import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatsCard from '@/components/StatsCard';
import { 
  Settings, 
  Users, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  BarChart3,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Shield,
  Database,
  Activity
} from 'lucide-react';

interface PendingClaim {
  id: string;
  holderName: string;
  village: string;
  district: string;
  type: string;
  area: number;
  submittedBy: string;
  submittedDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Verifier' | 'Data Entry';
  district: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-priorities');

  // Sample pending claims data
  const [pendingClaims] = useState<PendingClaim[]>([
    {
      id: 'FRA006',
      holderName: 'Lakshmi Devi',
      village: 'Kondagaon',
      district: 'Bastar',
      type: 'IFR',
      area: 1.8,
      submittedBy: 'field_officer_01',
      submittedDate: '2024-01-16',
      priority: 'High'
    },
    {
      id: 'FRA007',
      holderName: 'Tribal Collective',
      village: 'Kanker',
      district: 'Kanker',
      type: 'CFR',
      area: 67.3,
      submittedBy: 'data_entry_03',
      submittedDate: '2024-01-15',
      priority: 'Medium'
    },
    {
      id: 'FRA008',
      holderName: 'Ravi Sharma',
      village: 'Durg',
      district: 'Durg',
      type: 'CR',
      area: 4.2,
      submittedBy: 'verifier_02',
      submittedDate: '2024-01-14',
      priority: 'Low'
    }
  ]);

  // Sample users data
  const [users] = useState<User[]>([
    {
      id: 'usr001',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@fra.gov.in',
      role: 'Admin',
      district: 'All Districts',
      status: 'Active',
      lastLogin: '2024-01-16 09:30'
    },
    {
      id: 'usr002',
      name: 'Priya Sharma',
      email: 'priya.sharma@fra.gov.in',
      role: 'Verifier',
      district: 'Bastar',
      status: 'Active',
      lastLogin: '2024-01-16 08:45'
    },
    {
      id: 'usr003',
      name: 'Mohan Singh',
      email: 'mohan.singh@fra.gov.in',
      role: 'Data Entry',
      district: 'Kanker',
      status: 'Active',
      lastLogin: '2024-01-15 17:20'
    },
    {
      id: 'usr004',
      name: 'Sunita Devi',
      email: 'sunita.devi@fra.gov.in',
      role: 'Verifier',
      district: 'Durg',
      status: 'Inactive',
      lastLogin: '2024-01-10 14:15'
    }
  ]);

  const approveClaim = (claimId: string) => {
    console.log(`Approving claim: ${claimId}`);
    // Implementation for claim approval
  };

  const rejectClaim = (claimId: string) => {
    console.log(`Rejecting claim: ${claimId}`);
    // Implementation for claim rejection
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-primary/10 text-primary border-primary/20';
      case 'Verifier': return 'bg-accent/10 text-accent border-accent/20';
      case 'Data Entry': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold gradient-text">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            System administration and claim management
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Reviews"
          value="24"
          description="Claims awaiting approval"
          icon={Clock}
          trend={{ value: 8, isPositive: false }}
        />
        <StatsCard
          title="Active Users"
          value="87"
          description="System users online"
          icon={Users}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Processing Rate"
          value="94.2%"
          description="Claims processed on time"
          icon={BarChart3}
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="System Health"
          value="99.8%"
          description="Uptime this month"
          icon={Activity}
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="claims" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="claims">Pending Claims</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* Pending Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Claims Requiring Review</span>
                </div>
                <Badge variant="secondary">{pendingClaims.length} pending</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
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
                    <SelectValue placeholder="Filter by Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-priorities">All Priorities</SelectItem>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Claims Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Claim ID</th>
                      <th className="text-left p-3 font-medium">Holder</th>
                      <th className="text-left p-3 font-medium">Location</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Area</th>
                      <th className="text-left p-3 font-medium">Priority</th>
                      <th className="text-left p-3 font-medium">Submitted</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingClaims.map((claim) => (
                      <tr key={claim.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium">{claim.id}</td>
                        <td className="p-3">{claim.holderName}</td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{claim.village}</div>
                            <div className="text-muted-foreground text-xs">{claim.district}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{claim.type}</Badge>
                        </td>
                        <td className="p-3">{claim.area} Ha</td>
                        <td className="p-3">
                          <Badge className={getPriorityColor(claim.priority)}>
                            {claim.priority}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{claim.submittedDate}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => approveClaim(claim.id)}
                              className="text-success hover:text-success"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => rejectClaim(claim.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="w-4 h-4" />
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
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>System Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Role</th>
                      <th className="text-left p-3 font-medium">District</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Last Login</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3 text-muted-foreground">{user.email}</td>
                        <td className="p-3">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3">{user.district}</td>
                        <td className="p-3">
                          <Badge className={
                            user.status === 'Active' 
                              ? 'bg-success/10 text-success border-success/20' 
                              : 'bg-muted/10 text-muted-foreground border-muted/20'
                          }>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{user.lastLogin}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
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
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Generate Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Claims Summary Report
                </Button>
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  User Activity Report
                </Button>
                <Button className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  System Performance Report
                </Button>
                <Button className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Database Size</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Claims</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">API Requests/Day</span>
                  <span className="font-medium">15,234</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Database Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import/Export Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  System Monitoring
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Server Status</span>
                    <Badge className="bg-success/10 text-success">Online</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Database Status</span>
                    <Badge className="bg-success/10 text-success">Connected</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Backup Status</span>
                    <Badge className="bg-success/10 text-success">Up to date</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Maintenance</span>
                    <span className="text-muted-foreground">2024-01-15</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
