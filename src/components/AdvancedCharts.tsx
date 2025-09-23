"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Activity, Zap } from "lucide-react"

// Sample data for advanced charts
const performanceData = [
  { month: "Jan", claims: 120, processing: 95, efficiency: 79 },
  { month: "Feb", claims: 135, processing: 110, efficiency: 81 },
  { month: "Mar", claims: 148, processing: 125, efficiency: 84 },
  { month: "Apr", claims: 162, processing: 140, efficiency: 86 },
  { month: "May", claims: 178, processing: 155, efficiency: 87 },
  { month: "Jun", claims: 195, processing: 170, efficiency: 87 },
]

const assetCorrelationData = [
  { x: 2.5, y: 0.85, z: 45, type: "Forest" },
  { x: 1.8, y: 0.92, z: 32, type: "Agriculture" },
  { x: 3.2, y: 0.78, z: 28, type: "Water" },
  { x: 1.5, y: 0.88, z: 15, type: "Settlement" },
  { x: 4.1, y: 0.82, z: 52, type: "Mixed" },
]

const radarData = [
  { subject: "Processing Speed", A: 120, B: 110, fullMark: 150 },
  { subject: "Accuracy", A: 98, B: 130, fullMark: 150 },
  { subject: "Coverage", A: 86, B: 100, fullMark: 150 },
  { subject: "User Satisfaction", A: 99, B: 85, fullMark: 150 },
  { subject: "Cost Efficiency", A: 85, B: 90, fullMark: 150 },
  { subject: "Innovation", A: 65, B: 85, fullMark: 150 },
]

const chartConfig = {
  claims: { label: "Claims", color: "hsl(var(--chart-1))" },
  processing: { label: "Processing", color: "hsl(var(--chart-2))" },
  efficiency: { label: "Efficiency", color: "hsl(var(--chart-3))" },
}

interface AdvancedChartsProps {
  className?: string
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ className = "" }) => {
  return (
    <div className={`grid gap-6 lg:grid-cols-2 ${className}`}>
      {/* Performance Trends */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="claims" fill="hsl(var(--chart-1))" />
                  <Bar yAxisId="left" dataKey="processing" fill="hsl(var(--chart-2))" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Asset Correlation Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Asset Correlation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Area (Ha)" />
                  <YAxis dataKey="y" name="Confidence" />
                  <ZAxis dataKey="z" range={[50, 400]} name="Count" />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={assetCorrelationData} fill="hsl(var(--chart-1))" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Performance Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>System Performance Radar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 150]} />
                  <Radar
                    name="Current System"
                    dataKey="A"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Target Performance"
                    dataKey="B"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdvancedCharts
