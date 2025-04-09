"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

import USMap from "@/components/us-map"
import TopStatesChart from "@/components/top-states-chart"
import TimeSeriesChart from "@/components/time-series-chart"
import DemographicPieChart from "@/components/demographic-pie-chart"
import CorrelationTable from "@/components/correlation-table"
import StateDetails from "@/components/state-details"

export default function Dashboard() {
  // State for filters
  const [yearRange, setYearRange] = useState<[number, number]>([1993, 2022])
  const [metric, setMetric] = useState<string>("Cases")
  const [demographicFilter, setDemographicFilter] = useState<string>("all")
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [filterState, setFilterState] = useState<string>("All States")

  // Handle year range change
  const handleYearRangeChange = (value: number[]) => {
    setYearRange([value[0], value[1]])
  }

  // List of states for filter dropdown
  const statesList = [
    "All States",
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ]

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="text-md text-muted-foreground mb-2">
              Student: <span className="font-semibold">Your Name</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hantavirus Pulmonary Syndrome (HPS) Dashboard (1993-2022)
            </h1>
            <p className="text-muted-foreground">Explore HPS cases, rates, and correlations across the United States</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Year Range: {yearRange[0]} - {yearRange[1]}
                </Label>
                <Slider
                  defaultValue={[1993, 2022]}
                  min={1993}
                  max={2022}
                  step={1}
                  onValueChange={handleYearRangeChange}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Metric</Label>
                <RadioGroup defaultValue="Cases" onValueChange={setMetric} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cases" id="cases" />
                    <Label htmlFor="cases">Case Count</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Case_Rate" id="case-rate" />
                    <Label htmlFor="case-rate">Case Rate (per 100,000)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Mortality_Rate" id="mortality-rate" />
                    <Label htmlFor="mortality-rate">Mortality Rate (%)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Demographic Filter</Label>
                <Select defaultValue="all" onValueChange={setDemographicFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="gender">Gender</SelectItem>
                    <SelectItem value="race">Race/Ethnicity</SelectItem>
                    <SelectItem value="age">Age Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>State Filter</Label>
                <Select defaultValue="All States" onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesList.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>HPS Cases Across the United States</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <USMap yearRange={yearRange} metric={metric} onStateSelect={setSelectedState} />
              
              {/* State Details Modal - Show when a state is selected */}
              {selectedState && (
                <div className="absolute inset-0 bg-background/95 z-10 p-4 overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{selectedState} State Details</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedState(null)}
                      aria-label="Close state details"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <StateDetails state={selectedState} yearRange={yearRange} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 States by HPS Incidence</CardTitle>
            </CardHeader>
            <CardContent>
              <TopStatesChart yearRange={yearRange} metric={metric} filterState={filterState} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HPS Cases Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart yearRange={yearRange} metric={metric} filterState={filterState} />
            </CardContent>
          </Card>
        </div>

        {/* Demographics and Correlations Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Demographic Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start">
              <div className="w-full md:w-3/4">
                <DemographicPieChart demographicType={demographicFilter} filterState={filterState} />
              </div>
              <div className="w-full md:w-1/4 mt-4 md:mt-0 md:pl-4">
                <div className="space-y-2">
                  <Label>Demographic View</Label>
                  <Select value={demographicFilter} onValueChange={setDemographicFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="gender">Gender</SelectItem>
                      <SelectItem value="race">Race/Ethnicity</SelectItem>
                      <SelectItem value="age">Age Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <CorrelationTable filterState={filterState} />
            </CardContent>
          </Card>
        </div>

        {/* Key Findings */}
        <Card>
          <CardHeader>
            <CardTitle>Key Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">National Summary</h3>
              <ul className="space-y-2">
                <li>Highest incidence states: New Mexico, Arizona, Colorado, California, Washington</li>
                <li>Most cases occur in western states with higher elevations and forest coverage</li>
                <li>Strong correlation between HPS cases and forest coverage (R=0.720, p=0.008)</li>
                <li>Significant correlation with elevation (R=0.680, p=0.012)</li>
                <li>Click on a state in the map above to see detailed state information</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Source Citation */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Source: <a href="https://www.cdc.gov/hantavirus/data-research/cases/index.html" target="_blank" rel="noopener noreferrer" className="underline">CDC Reported Cases of Hantavirus Disease</a></p>
        </div>
      </div>
    </main>
  )
}
