"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Treemap,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import { TrendingUp, Layers, Filter, Eye, Download } from "lucide-react"

// Sample data for interactive charts
const timeSeriesData = [
  { month: "Jan", claims: 120, approved: 95, rejected: 15, pending: 10 },
  { month: "Feb", claims: 135, approved: 110, rejected: 18, pending: 7 },
  { month: "Mar", claims: 148, approved: 125, rejected: 12, pending: 11 },
  { month: "Apr", claims: 162, approved: 140, rejected: 14, pending: 8 },
  { month: "May", claims: 178, approved: 155, rejected: 16, pending: 7 },
  { month: "Jun", claims: 195, approved: 170, rejected: 18, pending: 7 },
]

const treemapData = [
  {
    name: "Forest Rights",
    size: 4500,
    children: [
      { name: "Individual Forest Rights", size: 2800 },
      { name: "Community Forest Rights", size: 1200 },
      { name: "Community Rights", size: 500 },
    ],
  },
  {
    name: "Asset Types",
    size: 3200,
    children: [
      { name: "Water Bodies", size: 1200 },
      { name: "Agricultural Land", size: 1000 },
      { name: "Forest Cover", size: 800 },
      { name: "Settlements", size: 200 },
    ],
  },
  {
    name: "Schemes",
    size: 2800,
    children: [
      { name: "DAJGUA", size: 1200 },
      { name: "MGNREGA", size: 800 },
      { name: "Jal Jeevan Mission", size: 500 },
      { name: "Other Schemes", size: 300 },
    ],
  },
]

const funnelData = [
  { name: "Applications Received", value: 1000, fill: "#8884d8" },
  { name: "Initial Verification", value: 850, fill: "#83a6ed" },
  { name: "Field Survey", value: 720, fill: "#8dd1e1" },
  { name: "Committee Review", value: 650, fill: "#82ca9d" },
  { name: "Final Approval", value: 580, fill: "#a4de6c" },
]

const chartConfig = {
  claims: { label: "Total Claims", color: "hsl(var(--chart-1))" },
  approved: { label: "Approved", color: "hsl(var(--chart-2))" },
  rejected: { label: "Rejected", color: "hsl(var(--chart-3))" },
  pending: { label: "Pending", color: "hsl(var(--chart-4))" },
}

interface InteractiveChartsProps {
  className?: string
}

const InteractiveCharts: React.FC<InteractiveChartsProps> = ({ className = "" }) => {
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [timeRange, setTimeRange] = useState("6months")

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric)
  }

  const getFilteredData = () => {
    if (selectedMetric === "all") return timeSeriesData
    return timeSeriesData.map((item) => ({
      month: item.month,
      [selectedMetric]: item[selectedMetric as keyof typeof item],
    }))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Interactive Time Series Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Claims Processing Trends</span>
              </CardTitle>
              <div className="flex space-x-2">
                {["all", "claims", "approved", "rejected", "pending"].map((metric) => (
                  <Button
                    key={metric}
                    variant={selectedMetric === metric ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMetricChange(metric)}
                    className="capitalize"
                  >
                    {metric === "all" ? "All Metrics" : metric}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getFilteredData()}>
                  <defs>
                    <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {(selectedMetric === "all" || selectedMetric === "claims") && (
                    <Area
                      type="monotone"
                      dataKey="claims"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorClaims)"
                    />
                  )}
                  {(selectedMetric === "all" || selectedMetric === "approved") && (
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke="hsl(var(--chart-2))"
                      fillOpacity={1}
                      fill="url(#colorApproved)"
                    />
                  )}
                  {(selectedMetric === "all" || selectedMetric === "rejected") && (
                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stroke="hsl(var(--chart-3))"
                      fillOpacity={1}
                      fill="url(#colorRejected)"
                    />
                  )}
                  {(selectedMetric === "all" || selectedMetric === "pending") && (
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stroke="hsl(var(--chart-4))"
                      fillOpacity={1}
                      fill="url(#colorPending)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                <span>Total Claims: {timeSeriesData[timeSeriesData.length - 1].claims}</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                <span>Approved: {timeSeriesData[timeSeriesData.length - 1].approved}</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                <span>Rejected: {timeSeriesData[timeSeriesData.length - 1].rejected}</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                <span>Pending: {timeSeriesData[timeSeriesData.length - 1].pending}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hierarchical Treemap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="w-5 h-5" />
                <span>Asset Hierarchy Map</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Hierarchical view of FRA assets and schemes by size</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    fill="hsl(var(--chart-1))"
                  >
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">Size: {data.size?.toLocaleString()}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Processing Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Claims Processing Funnel</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Conversion rates through the claims approval process</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      <LabelList position="center" fill="#fff" stroke="none" />
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {funnelData.map((stage, index) => {
                  const conversionRate =
                    index > 0 ? ((stage.value / funnelData[index - 1].value) * 100).toFixed(1) : "100.0"
                  return (
                    <div key={stage.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.fill }} />
                        <span>{stage.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{stage.value}</span>
                        <Badge variant="outline" className="text-xs">
                          {conversionRate}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap gap-3 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Eye className="w-4 h-4" />
          <span>View Detailed Report</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Download className="w-4 h-4" />
          <span>Export Charts</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
        </Button>
      </motion.div>
    </div>
  )
}

export default InteractiveCharts
