"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"
import { fetchStateData } from "@/lib/api"
import { scaleQuantize } from "d3-scale"
import { Skeleton } from "@/components/ui/skeleton"

// URL to US states GeoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

interface USMapProps {
  yearRange: [number, number]
  metric: string
  onStateSelect: (state: string) => void
}

export default function USMap({ yearRange, metric, onStateSelect }: USMapProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [tooltipContent, setTooltipContent] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const stateData = await fetchStateData(yearRange, metric)
        setData(stateData)
      } catch (error) {
        console.error("Error loading map data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [yearRange, metric])

  // Update the map colors to be more visible
  // Define color scale based on metric
  const getColorScale = () => {
    const domain = [Math.min(...data.map((d) => d[metric])), Math.max(...data.map((d) => d[metric]))]

    let colorRange
    if (metric === "Cases") {
      colorRange = ["#cceeff", "#99ddff", "#66ccff", "#33bbff", "#00aaff", "#0088cc", "#006699"]
    } else if (metric === "Case_Rate") {
      colorRange = ["#ffeecc", "#ffdd99", "#ffcc66", "#ffbb33", "#ffaa00", "#cc8800", "#996600"]
    } else {
      // Mortality_Rate
      colorRange = ["#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#ff0000", "#cc0000", "#990000"]
    }

    return scaleQuantize()
      .domain(domain)
      .range(colorRange as any)
  }

  const colorScale = data.length ? getColorScale() : () => "#EEE"

  // Format tooltip content based on metric
  const formatTooltip = (geo: any) => {
    const stateData = data.find((d) => d.State === geo.properties.name)
    if (!stateData) return ""

    if (metric === "Cases") {
      return `
        <div>
          <strong>${geo.properties.name}</strong><br />
          Cases: ${stateData.Cases}<br />
          Case Rate: ${stateData.Case_Rate.toFixed(2)} per 100,000<br />
          Population: ${stateData.Population.toLocaleString()}
        </div>
      `
    } else if (metric === "Case_Rate") {
      return `
        <div>
          <strong>${geo.properties.name}</strong><br />
          Case Rate: ${stateData.Case_Rate.toFixed(2)} per 100,000<br />
          Cases: ${stateData.Cases}<br />
          Population: ${stateData.Population.toLocaleString()}
        </div>
      `
    } else {
      // Mortality_Rate
      return `
        <div>
          <strong>${geo.properties.name}</strong><br />
          Mortality Rate: ${stateData.Mortality_Rate.toFixed(2)}%<br />
          Deaths: ${stateData.Deaths}<br />
          Cases: ${stateData.Cases}
        </div>
      `
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="mb-2 text-sm text-center text-muted-foreground">
        Click on any state to view detailed information about HPS cases in that region
      </div>
      <ComposableMap projection="geoAlbersUsa" className="map-container">
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateData = data.find((d) => d.State === geo.properties.name)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="state"
                    fill={stateData ? colorScale(stateData[metric]) : "#EEE"}
                    data-tooltip-id="state-tooltip"
                    data-tooltip-html={formatTooltip(geo)}
                    onClick={() => onStateSelect(geo.properties.name)}
                    onMouseEnter={() => {
                      setTooltipContent(formatTooltip(geo))
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="state-tooltip" html={true} />

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white p-2 rounded-md shadow-sm text-xs">
        <div className="font-semibold mb-1">
          {metric === "Cases"
            ? "Case Count"
            : metric === "Case_Rate"
              ? "Case Rate (per 100,000)"
              : "Mortality Rate (%)"}
        </div>
        <div className="flex items-center">
          <div className="w-full h-2 flex">
            {(metric === "Cases"
              ? ["#cceeff", "#99ddff", "#66ccff", "#33bbff", "#00aaff", "#0088cc", "#006699"]
              : metric === "Case_Rate"
                ? ["#ffeecc", "#ffdd99", "#ffcc66", "#ffbb33", "#ffaa00", "#cc8800", "#996600"]
                : ["#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#ff0000", "#cc0000", "#990000"]
            ).map((color, i) => (
              <div key={i} className="flex-1 h-2" style={{ backgroundColor: color }}></div>
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[10px] mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}
