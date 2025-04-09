"use client"

import { useState, useEffect } from "react"
import { fetchCorrelationData } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CorrelationTableProps {
  filterState?: string
}

export default function CorrelationTable({ filterState = "All States" }: CorrelationTableProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const correlationData = await fetchCorrelationData(filterState)
        setData(correlationData)
      } catch (error) {
        console.error("Error loading correlation data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filterState])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Environmental Factor</TableHead>
          <TableHead>Correlation</TableHead>
          <TableHead>P-Value</TableHead>
          <TableHead>Significance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={index}
            className={item.Significance === "Significant" ? "bg-green-500/20 dark:bg-green-500/30" : ""}
          >
            <TableCell className="text-black dark:text-white">{item.Factor}</TableCell>
            <TableCell className="text-black dark:text-white">{item.Correlation.toFixed(3)}</TableCell>
            <TableCell className="text-black dark:text-white">{item.P_Value.toFixed(3)}</TableCell>
            <TableCell
              className={
                item.Significance === "Significant" 
                  ? "font-medium text-green-600 dark:text-green-400" 
                  : "text-black dark:text-white"
              }
            >
              {item.Significance}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
