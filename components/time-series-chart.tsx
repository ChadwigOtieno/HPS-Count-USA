"use client"

import { useState, useEffect } from "react"
import { fetchTimeSeriesData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart } from "@/components/ui/chart"

interface TimeSeriesChartProps {
  yearRange: [number, number]
  metric: string
  filterState?: string
}

export default function TimeSeriesChart({ yearRange, metric, filterState = "All States" }: TimeSeriesChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const timeSeriesData = await fetchTimeSeriesData(yearRange, metric, filterState)
        
        // Process data to ensure there are no negative values
        const processedData = timeSeriesData.map(item => {
          const newItem = {...item};
          // Ensure all data points are non-negative
          ["National", "New Mexico", "Arizona", "Colorado", "California", "Washington"].forEach(key => {
            if (key in newItem && newItem[key] < 0) {
              newItem[key] = 0;
            }
          });
          return newItem;
        });
        
        setData(processedData)
      } catch (error) {
        console.error("Error loading time series data:", error)
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

  // Determine which categories to show based on filter state
  const getCategories = () => {
    const allCategories = ["National", "New Mexico", "Arizona", "Colorado", "California", "Washington"];
    
    if (filterState === "All States") {
      return allCategories;
    } else if (allCategories.includes(filterState)) {
      return ["National", filterState];
    } else {
      return ["National"]; // Default to just national if the filtered state isn't in our top 5
    }
  };

  return (
    <div className="h-[300px] w-full">
      <LineChart
        data={data}
        index="Year"
        categories={getCategories()}
        colors={["#ff6b6b", "#ffa502", "#4bcffa", "#0be881", "#a55eea"]}
        valueFormatter={(value) => (metric === "Cases" ? value.toString() : value.toFixed(2))}
        yAxisWidth={60}
        legendTextColor="black"
      />
    </div>
  )
}
