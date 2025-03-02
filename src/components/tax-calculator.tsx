"use client"

import { useState, useMemo } from "react"
import { Calculator, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { NumericFormat } from "react-number-format"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid"

interface JobDetails {
  id: string
  name: string
  payRate: number
  hoursPerWeek: number
}

export default function TaxCalculator() {
  const [jobs, setJobs] = useState<JobDetails[]>([
    {
      id: "job-1",
      name: "",
      payRate: 0,
      hoursPerWeek: 0,
    },
    {
      id: "job-2",
      name: "",
      payRate: 0,
      hoursPerWeek: 0,
    },
  ])

  const TAX_CREDITS = 4000
  const TARGET_ANNUAL_INCOME = 44000

  // Calculate all derived values using useMemo
  const calculations = useMemo(() => {
    // Calculate weekly and annual incomes for all jobs
    const jobsWithAnnual = jobs.map((job) => {
      const weeklyIncome = job.payRate * job.hoursPerWeek
      const originalAnnual = weeklyIncome * 52
      return {
        ...job,
        originalAnnual,
      }
    })

    // Calculate total original annual income
    const totalOriginalAnnual = jobsWithAnnual.reduce((sum, job) => sum + job.originalAnnual, 0)

    if (totalOriginalAnnual === 0) {
      return jobs.map((job) => ({
        ...job,
        annualIncome: 0,
        taxCredits: 0,
      }))
    }

    // Calculate adjustment factor
    const adjustmentFactor = TARGET_ANNUAL_INCOME / totalOriginalAnnual

    // Calculate final values for each job
    return jobsWithAnnual.map((job) => {
      const adjustedAnnual = job.originalAnnual * adjustmentFactor
      const taxCredits = (TAX_CREDITS * adjustedAnnual) / TARGET_ANNUAL_INCOME

      return {
        ...job,
        annualIncome: adjustedAnnual,
        taxCredits: taxCredits,
      }
    })
  }, [jobs])

  const addJob = () => {
    setJobs([
      ...jobs,
      {
        id: uuidv4(),
        name: "",
        payRate: 0,
        hoursPerWeek: 0,
      },
    ])
  }

  const removeJob = (id: string) => {
    if (jobs.length > 1) {
      setJobs(jobs.filter((job) => job.id !== id))
    }
  }

  const updateJob = (id: string, field: keyof JobDetails, value: string | number) => {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, [field]: value } : job)))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Revenue Calculator for Students ❤️
          </CardTitle>
          <CardDescription>Calculate tax credits for multiple jobs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Inputs */}
          <div className="space-y-6">
            {jobs.map((job, index) => {
              const calculatedJob = calculations[index]
              return (
                <Card key={job.id} className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{job.name ? job.name : `Job ${index + 1}`}</CardTitle>
                      {jobs.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeJob(job.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove job</span>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3 pt-0">
                    <div className="space-y-2">
                      <Label htmlFor={`job-${job.id}-name`}>Job Name</Label>
                      <Input
                        id={`job-${job.id}-name`}
                        value={job.name}
                        onChange={(e) => updateJob(job.id, "name", e.target.value)}
                        placeholder="Enter job name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`job-${job.id}-rate`}>Pay Rate per Hour (€)</Label>
                      <NumericFormat
                        id={`job-${job.id}-rate`}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        inputMode="decimal"
                        value={job.payRate || ""}
                        onValueChange={(e) => updateJob(job.id, "payRate", e.floatValue || 0)}
                        placeholder="0.00"
                        thousandSeparator={false}
                        decimalSeparator="."
                        allowNegative={false}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`job-${job.id}-hours`}>Hours per Week</Label>
                      <NumericFormat
                        id={`job-${job.id}-hours`}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        inputMode="decimal"
                        value={job.hoursPerWeek || ""}
                        onValueChange={(e) => updateJob(job.id, "hoursPerWeek", e.floatValue || 0)}
                        placeholder="0.00"
                        thousandSeparator={false}
                        decimalSeparator="."
                        allowNegative={false}
                        decimalScale={2}
                        fixedDecimalScale={true}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-2 pb-2 px-6 text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>Annual Income:</span>
                    <span className="font-semibold">{formatCurrency(calculatedJob.annualIncome || 0)}</span>
                    <span>Tax Credits:</span>
                    <span className="font-semibold">{formatCurrency(calculatedJob.taxCredits || 0)}</span>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Button onClick={addJob} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Another Job
            </Button>
          </div>

          {/* Results Summary */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculations.map((job, index) => (
                <div key={job.id} className="space-y-2">
                  <h4 className="font-medium">{job.name || `Job ${index + 1}`}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span>Annual Income:</span>
                    <span className="font-semibold">{formatCurrency(job.annualIncome || 0)}</span>
                    <span>Tax Credits:</span>
                    <span className="font-semibold">{formatCurrency(job.taxCredits || 0)}</span>
                  </div>
                  {index < calculations.length - 1 && (
                    <hr className="my-2 border-t border-gray-200 dark:border-gray-700" />
                  )}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                  <span>Target Annual Income:</span>
                  <span className="font-semibold">{formatCurrency(TARGET_ANNUAL_INCOME)}</span>
                  <span>Target Tax Credits:</span>
                  <span className="font-semibold">{formatCurrency(TAX_CREDITS)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}