"use client"

import * as React from "react"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Bar } from "@visx/shape"
import { Line, LinePath } from "@visx/shape"
import { curveMonotoneX } from "@visx/curve"
import { Pie } from "@visx/shape"
import { Text } from "@visx/text"
import { localPoint } from "@visx/event"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { LegendOrdinal } from "@visx/legend"
import { ParentSize } from "@visx/responsive"

// Bar Chart Component
interface BarChartProps {
  data: Array<{ [key: string]: any }>
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  showLegend?: boolean
  legendTextColor?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 50,
  showLegend = true,
  legendTextColor = "inherit",
}: BarChartProps) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <BarChartInner
          data={data}
          index={index}
          categories={categories}
          colors={colors}
          valueFormatter={valueFormatter}
          yAxisWidth={yAxisWidth}
          showLegend={showLegend}
          legendTextColor={legendTextColor}
          width={width}
          height={height}
        />
      )}
    </ParentSize>
  )
}

// Update the Bar Chart component to use more visible colors
function BarChartInner({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth = 50,
  showLegend,
  legendTextColor,
  width,
  height,
}: BarChartProps & { width: number; height: number }) {
  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<{
    key: string
    value: number
    color: string
  }>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  // Margins
  const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }

  // Bounds
  const innerWidth = width - (margin.left || 0) - (margin.right || 0)
  const innerHeight = height - (margin.top || 0) - (margin.bottom || 0)

  // Scales
  const xScale = scaleBand<string>({
    domain: data.map((d) => d[index]),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => Math.max(...categories.map((c) => d[c] || 0))))],
    range: [innerHeight, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal<string, string>({
    domain: categories,
    range: (colors || []).map((color) => {
      if (color.startsWith("#")) return color
      return `var(--${color})`
    }),
  })

  // Get bar width
  const barWidth = xScale.bandwidth() / categories.length
  
  // Safe valueFormatter
  const formatValue = (value: number) => {
    return valueFormatter ? valueFormatter(value) : value.toString();
  };

  return (
    <div ref={containerRef} className="relative">
      <svg width={width} height={height}>
        <Group left={margin.left || 0} top={margin.top || 0}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="var(--border)"
            strokeOpacity={0.2}
            strokeDasharray="4,4"
          />
          <AxisLeft
            scale={yScale}
            tickFormat={(value) => formatValue(value as number)}
            stroke="var(--foreground)"
            tickStroke="var(--foreground)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 10,
              textAnchor: "end",
              dy: "0.33em",
            }}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke="var(--foreground)"
            tickStroke="var(--foreground)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 10,
              textAnchor: "middle",
              dy: "0.33em",
            }}
          />
          {data.map((d) => {
            const category = categories[0]
            const value = d[category] || 0
            const barHeight = innerHeight - yScale(value)
            const x = xScale(d[index]) || 0
            const y = innerHeight - barHeight

            return (
              <Bar
                key={`bar-${d[index]}`}
                x={x}
                y={y}
                width={xScale.bandwidth()}
                height={barHeight}
                fill={colorScale(category)}
                onMouseMove={(event) => {
                  const point = localPoint(event)
                  if (!point) return
                  showTooltip({
                    tooltipData: {
                      key: d[index],
                      value,
                      color: colorScale(category),
                    },
                    tooltipLeft: point.x,
                    tooltipTop: point.y,
                  })
                }}
                onMouseLeave={() => hideTooltip()}
              />
            )
          })}
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            padding: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.25rem",
          }}
        >
          <div className="font-medium">{tooltipData.key}</div>
          <div className="flex items-center text-sm" style={{ color: tooltipData.color }}>
            {formatValue(tooltipData.value)}
          </div>
        </TooltipInPortal>
      )}

      {showLegend && (
        <div className="mt-2 flex justify-center">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center text-sm">
                <div className="mr-1 h-3 w-3 rounded-full" style={{ backgroundColor: colorScale(category) }} />
                <span style={{ color: legendTextColor }}>{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Line Chart Component
interface LineChartProps {
  data: Array<{ [key: string]: any }>
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  legendTextColor?: string
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 50,
  legendTextColor = "inherit",
}: LineChartProps) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <LineChartInner
          data={data}
          index={index}
          categories={categories}
          colors={colors}
          valueFormatter={valueFormatter}
          yAxisWidth={yAxisWidth}
          legendTextColor={legendTextColor}
          width={width}
          height={height}
        />
      )}
    </ParentSize>
  )
}

// Update the Line Chart component to use more visible colors and thicker lines
function LineChartInner({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth = 50,
  legendTextColor,
  width,
  height,
}: LineChartProps & { width: number; height: number }) {
  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<{
    key: string
    values: { category: string; value: number; color: string }[]
  }>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  // Margins
  const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }

  // Bounds
  const innerWidth = width - (margin.left || 0) - (margin.right || 0)
  const innerHeight = height - (margin.top || 0) - (margin.bottom || 0)

  // Scales
  const xScale = scaleBand<string>({
    domain: data.map((d) => d[index]),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const allValues = data.flatMap((d) => categories.map((c) => (d[c] !== undefined ? d[c] : 0)))
  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...allValues)],
    range: [innerHeight, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal<string, string>({
    domain: categories,
    range: (colors || []).map((color) => {
      if (color.startsWith("#")) return color
      return `var(--${color})`
    }),
  })
  
  // Safe valueFormatter
  const formatValue = (value: number) => {
    return valueFormatter ? valueFormatter(value) : value.toString();
  };

  return (
    <div ref={containerRef} className="relative">
      <svg width={width} height={height}>
        <Group left={margin.left || 0} top={margin.top || 0}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="var(--border)"
            strokeOpacity={0.2}
            strokeDasharray="4,4"
          />
          <AxisLeft
            scale={yScale}
            tickFormat={(value) => formatValue(value as number)}
            stroke="var(--foreground)"
            tickStroke="var(--foreground)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 10,
              textAnchor: "end",
              dy: "0.33em",
            }}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke="var(--foreground)"
            tickStroke="var(--foreground)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 10,
              textAnchor: "middle",
              dy: "0.33em",
            }}
          />

          {/* Vertical hover line */}
          {tooltipData && (
            <Line
              from={{ x: tooltipLeft || 0, y: 0 }}
              to={{ x: tooltipLeft || 0, y: innerHeight }}
              stroke="var(--foreground)"
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="4,4"
            />
          )}

          {/* Draw lines for each category */}
          {categories.map((category, i) => {
            const lineData = data
              .map((d) => ({
                x: xScale(d[index]) || 0,
                y: yScale(d[category] !== undefined ? d[category] : 0),
                value: d[category] !== undefined ? d[category] : 0,
              }))
              .filter((d) => d.value !== undefined)

            return (
              <Group key={`line-${category}`}>
                <LinePath
                  data={lineData}
                  x={(d) => d.x + xScale.bandwidth() / 2}
                  y={(d) => d.y}
                  stroke={colorScale(category)}
                  strokeWidth={3}
                  curve={curveMonotoneX}
                />
                {lineData.map((d, j) => (
                  <circle
                    key={`circle-${category}-${j}`}
                    cx={d.x + xScale.bandwidth() / 2}
                    cy={d.y}
                    r={4}
                    fill={colorScale(category)}
                    stroke="var(--background)"
                    strokeWidth={1.5}
                  />
                ))}
              </Group>
            )
          })}

          {/* Invisible overlay for hover detection */}
          {data.map((d, i) => {
            const x = xScale(d[index]) || 0
            return (
              <Bar
                key={`overlay-${i}`}
                x={x}
                y={0}
                width={xScale.bandwidth()}
                height={innerHeight}
                fill="transparent"
                onMouseMove={(event) => {
                  const point = localPoint(event)
                  if (!point) return
                  showTooltip({
                    tooltipData: {
                      key: d[index],
                      values: categories.map((category) => ({
                        category,
                        value: d[category] !== undefined ? d[category] : 0,
                        color: colorScale(category),
                      })),
                    },
                    tooltipLeft: x + xScale.bandwidth() / 2,
                    tooltipTop: point.y,
                  })
                }}
                onMouseLeave={() => hideTooltip()}
              />
            )
          })}
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            background: "var(--background)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            padding: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.25rem",
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-medium">{tooltipData.key}</div>
          <div className="mt-1 space-y-1">
            {tooltipData.values
              .filter((v) => v.value !== undefined)
              .sort((a, b) => b.value - a.value)
              .map((v, i) => (
                <div key={`tooltip-${i}`} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: v.color }} />
                    <span>{v.category}</span>
                  </div>
                  <span>{formatValue(v.value)}</span>
                </div>
              ))}
          </div>
        </TooltipInPortal>
      )}

      <div className="mt-2 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <div key={category} className="flex items-center text-sm">
            <div className="mr-1 h-3 w-3 rounded-full" style={{ backgroundColor: colorScale(category) }} />
            <span style={{ color: legendTextColor }}>{category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Pie Chart Component
interface PieChartProps {
  data: Array<{ [key: string]: any }>
  index: string
  category: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  compactLegend?: boolean
  legendTextColor?: string
}

export function PieChart({
  data,
  index,
  category,
  colors = ["primary", "secondary", "accent", "destructive", "muted"],
  valueFormatter = (value: number) => value.toString(),
  compactLegend = false,
  legendTextColor = "inherit",
}: PieChartProps) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <PieChartInner
          data={data}
          index={index}
          category={category}
          colors={colors}
          valueFormatter={valueFormatter}
          compactLegend={compactLegend}
          legendTextColor={legendTextColor}
          width={width}
          height={height}
        />
      )}
    </ParentSize>
  )
}

// Update the Pie Chart component to use more visible colors
function PieChartInner({
  data,
  index,
  category,
  colors,
  valueFormatter,
  compactLegend,
  legendTextColor,
  width,
  height,
}: PieChartProps & { width: number; height: number; legendTextColor?: string }) {
  // Tooltip setup
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<{
    key: string
    value: number
    color: string
  }>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  })

  // Calculate total for percentages
  const total = data.reduce((acc, d) => acc + d[category], 0)

  // Dimensions
  const margin = { top: 20, right: 20, bottom: 20, left: 20 }
  const legendWidth = compactLegend ? 100 : 150
  const chartAreaWidth = width - legendWidth
  const innerWidth = chartAreaWidth - (margin.left || 0) - (margin.right || 0)
  const innerHeight = height - (margin.top || 0) - (margin.bottom || 0)
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerX = (innerWidth / 2) + (margin.left || 0)
  const centerY = innerHeight / 2 + (margin.top || 0)
  
  // Safe valueFormatter
  const formatValue = (value: number) => {
    return valueFormatter ? valueFormatter(value) : value.toString();
  };

  // Color scale
  const colorScale = scaleOrdinal<string, string>({
    domain: data.map((d) => d[index]),
    range: (colors || []).map((color) => {
      if (color.startsWith("#")) return color
      return `var(--${color})`
    }),
  })

  // Pie layout
  const pie = React.useMemo(
    () => ({
      data,
      value: (d: any) => d[category],
      label: (d: any) => d[index],
    }),
    [data, category, index],
  )

  return (
    <div ref={containerRef} className="relative flex">
      <div style={{ width: chartAreaWidth, height }}>
        <svg width={chartAreaWidth} height={height}>
          <Group top={centerY} left={centerX}>
            <Pie data={data} pieValue={(d) => d[category]} outerRadius={radius} innerRadius={radius / 2} padAngle={0.01}>
              {(pie) => {
                return pie.arcs.map((arc, i) => {
                  const { label } = arc.data
                  const [centroidX, centroidY] = pie.path.centroid(arc)
                  const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
                  const arcPath = pie.path(arc) || ""
                  const arcFill = colorScale(arc.data[index])

                  return (
                    <g
                      key={`arc-${i}`}
                      onMouseMove={(event) => {
                        const point = localPoint(event)
                        if (!point) return
                        showTooltip({
                          tooltipData: {
                            key: arc.data[index],
                            value: arc.data[category],
                            color: arcFill,
                          },
                          tooltipLeft: point.x,
                          tooltipTop: point.y,
                        })
                      }}
                      onMouseLeave={() => hideTooltip()}
                    >
                      <path d={arcPath} fill={arcFill} />
                      {hasSpaceForLabel && (
                        <Text
                          x={centroidX}
                          y={centroidY}
                          dy=".33em"
                          fontSize={12}
                          textAnchor="middle"
                          fill="var(--background)"
                          fontWeight="bold"
                        >
                          {arc.data[index]}
                        </Text>
                      )}
                    </g>
                  )
                })
              }}
            </Pie>
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              background: "var(--background)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              padding: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              borderRadius: "0.25rem",
            }}
          >
            <div className="font-medium">{tooltipData.key}</div>
            <div className="flex items-center text-sm" style={{ color: tooltipData.color }}>
              {formatValue(tooltipData.value)} ({((tooltipData.value / total) * 100).toFixed(1)}%)
            </div>
          </TooltipInPortal>
        )}
      </div>
      
      <div style={{ width: legendWidth }} className="flex flex-col justify-center">
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d[index]} className="flex items-center text-sm">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: colorScale(d[index]) }} />
              <span style={{ color: legendTextColor }}>
                {compactLegend 
                  ? d[index]
                  : `${d[index]}: ${formatValue(d[category])} (${((d[category] / total) * 100).toFixed(1)}%)`
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
