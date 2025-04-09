"use client"

import { useState, useEffect } from "react"
import { fetchTopStatesData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart } from "@/components/ui/chart"

interface TopStatesChartProps {
  yearRange: [number, number]
  metric: string
  filterState?: string
}

export default function TopStatesChart({ yearRange, metric, filterState = "All States" }: TopStatesChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const topStates = await fetchTopStatesData(yearRange, metric, filterState)
        setData(topStates)
      } catch (error) {
        console.error("Error loading top states data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [yearRange, metric, filterState])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  // Format y-axis label based on metric
  const getYAxisLabel = () => {
    if (metric === "Cases") return "Number of Cases"
    if (metric === "Case_Rate") return "Cases per 100,000"
    return "Mortality Rate (%)"
  }

  // Format the data for the chart
  const chartData = data.map((item) => ({
    name: item.State,
    value: Math.max(0, item[metric]),
  }))

  return (
    <div className="h-[300px] w-full">
      <BarChart
        data={chartData}
        index="name"
        categories={["value"]}
        colors={["#0000FF"]}
        valueFormatter={(value) => (metric === "Cases" ? value.toString() : value.toFixed(2))}
        yAxisWidth={60}
        showLegend={false}
        legendTextColor="black"
      />
    </div>
  )
}
