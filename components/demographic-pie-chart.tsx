"use client"

import { useState, useEffect } from "react"
import { fetchDemographicData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart } from "@/components/ui/chart"

interface DemographicPieChartProps {
  demographicType: string
  filterState?: string
}

export default function DemographicPieChart({ demographicType, filterState = "All States" }: DemographicPieChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const demographicData = await fetchDemographicData(demographicType, filterState)
        setData(demographicData)
      } catch (error) {
        console.error("Error loading demographic data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [demographicType, filterState])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="h-[300px] w-full">
      <div className="flex flex-col h-full">
        <PieChart
          data={data}
          index="name"
          category="value"
          valueFormatter={(value) => `${value.toFixed(1)}%`}
          colors={["#ff6b6b", "#ffa502", "#4bcffa", "#0be881", "#a55eea"]}
          compactLegend={true}
          legendTextColor="black"
        />
      </div>
    </div>
  )
}
