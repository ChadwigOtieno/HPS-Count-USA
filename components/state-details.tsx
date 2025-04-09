"use client"

import { useState, useEffect } from "react"
import { fetchStateDetails } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StateDetailsProps {
  state: string
  yearRange: [number, number]
}

export default function StateDetails({ state, yearRange }: StateDetailsProps) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const stateDetails = await fetchStateDetails(state, yearRange)
        setData(stateDetails)
      } catch (error) {
        console.error("Error loading state details:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [state, yearRange])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (!data) {
    return <div>No data available for {state}</div>
  }

  return (
    <div>
      <ul className="mb-4 space-y-1">
        <li><strong>Total Cases:</strong> {data.caseStats.totalCases}</li>
        <li><strong>Total Deaths:</strong> {data.caseStats.totalDeaths}</li>
        <li><strong>Case Rate:</strong> {data.caseStats.caseRate.toFixed(2)} per 100,000</li>
        <li><strong>Mortality Rate:</strong> {data.caseStats.mortalityRate.toFixed(2)}%</li>
      </ul>

      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">Case Statistics</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Factors</TabsTrigger>
          <TabsTrigger value="demographic">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="cases">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total Cases</TableCell>
                <TableCell>{data.caseStats.totalCases}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Deaths</TableCell>
                <TableCell>{data.caseStats.totalDeaths}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Case Rate (per 100,000)</TableCell>
                <TableCell>{data.caseStats.caseRate.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mortality Rate (%)</TableCell>
                <TableCell>{data.caseStats.mortalityRate.toFixed(2)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Population</TableCell>
                <TableCell>{data.caseStats.avgPopulation.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="environmental">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Average Elevation (m)</TableCell>
                <TableCell>{data.environmental.avgElevation.toFixed(1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Forest Coverage (%)</TableCell>
                <TableCell>{data.environmental.forestCoverage.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Population Density</TableCell>
                <TableCell>{data.environmental.populationDensity.toFixed(1)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Annual Precipitation (cm)</TableCell>
                <TableCell>{data.environmental.annualPrecipitation.toFixed(1)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="demographic">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Demographic</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Male</TableCell>
                <TableCell>{data.demographic.malePct.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Female</TableCell>
                <TableCell>{data.demographic.femalePct.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>White</TableCell>
                <TableCell>{data.demographic.whitePct.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Black</TableCell>
                <TableCell>{data.demographic.blackPct.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hispanic</TableCell>
                <TableCell>{data.demographic.hispanicPct.toFixed(1)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
