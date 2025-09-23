import * as React from "react"
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface ChartProps {
  children: React.ReactNode
  className?: string
}

interface ChartContainerProps {
  config: Record<string, any>
  className?: string
  children: React.ReactNode
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  config,
  className,
  children,
}) => {
  return (
    <div className={`w-full h-[300px] ${className || ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export const ChartTooltip = Tooltip
export const ChartTooltipContent = Tooltip
export const ChartLegend = Legend
export const ChartLegendContent = Legend

// Re-export recharts components
export {
  ResponsiveContainer,
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"