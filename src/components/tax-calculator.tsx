"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface JobDetails {
  name: string
  payRate: number
  hoursPerWeek: number
  annualIncome: number
  taxCredits: number
}

export default function TaxCalculator() {
  const [job1, setJob1] = useState<JobDetails>({
    name: "",
    payRate: 0,
    hoursPerWeek: 0,
    annualIncome: 0,
    taxCredits: 0,
  })

  const [job2, setJob2] = useState<JobDetails>({
    name: "",
    payRate: 0,
    hoursPerWeek: 0,
    annualIncome: 0,
    taxCredits: 0,
  })

  const TAX_CREDITS = 4000
  const TARGET_ANNUAL_INCOME = 44000

  useEffect(() => {
    // Calculate initial annual incomes
    const job1WeeklyIncome = job1.payRate * job1.hoursPerWeek
    const job2WeeklyIncome = job2.payRate * job2.hoursPerWeek
    let job1Annual = job1WeeklyIncome * 52
    let job2Annual = job2WeeklyIncome * 52
    const totalOriginal = job1Annual + job2Annual

    // Adjust to target annual income if there's any income
    if (totalOriginal > 0) {
      const adjustmentFactor = TARGET_ANNUAL_INCOME / totalOriginal
      job1Annual *= adjustmentFactor
      job2Annual *= adjustmentFactor

      // Calculate tax credits proportionally
      const job1Credits = (TAX_CREDITS * job1Annual) / TARGET_ANNUAL_INCOME
      const job2Credits = (TAX_CREDITS * job2Annual) / TARGET_ANNUAL_INCOME

      setJob1((prev) => ({ ...prev, annualIncome: job1Annual, taxCredits: job1Credits }))
      setJob2((prev) => ({ ...prev, annualIncome: job2Annual, taxCredits: job2Credits }))
    }
  }, [job1.payRate, job1.hoursPerWeek, job2.payRate, job2.hoursPerWeek])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Revenue Calculator for Students ❤️
          </CardTitle>
          <CardDescription>Calculate tax credits for two part-time jobs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Job 1 Inputs */}
            <div className="space-y-4">
              <h3 className="font-semibold">Primary Employment</h3>
              <div className="space-y-2">
                <Label htmlFor="job1-name">Job Name</Label>
                <Input
                  id="job1-name"
                  value={job1.name}
                  onChange={(e) => setJob1({ ...job1, name: e.target.value })}
                  placeholder="Enter job name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job1-rate">Pay Rate per Hour (€)</Label>
                <Input
                  id="job1-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={job1.payRate || ""}
                  onChange={(e) => setJob1({ ...job1, payRate: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job1-hours">Hours per Week</Label>
                <Input
                  id="job1-hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={job1.hoursPerWeek || ""}
                  onChange={(e) => setJob1({ ...job1, hoursPerWeek: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Job 2 Inputs */}
            <div className="space-y-4">
              <h3 className="font-semibold">Secondary Employment</h3>
              <div className="space-y-2">
                <Label htmlFor="job2-name">Job Name</Label>
                <Input
                  id="job2-name"
                  value={job2.name}
                  onChange={(e) => setJob2({ ...job2, name: e.target.value })}
                  placeholder="Enter job name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job2-rate">Pay Rate per Hour (€)</Label>
                <Input
                  id="job2-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={job2.payRate || ""}
                  onChange={(e) => setJob2({ ...job2, payRate: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job2-hours">Hours per Week</Label>
                <Input
                  id="job2-hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={job2.hoursPerWeek || ""}
                  onChange={(e) => setJob2({ ...job2, hoursPerWeek: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{job1.name || "Primary Employment"}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Annual Income:</span>
                  <span className="font-semibold">{formatCurrency(job1.annualIncome)}</span>
                  <span>Tax Credits:</span>
                  <span className="font-semibold">{formatCurrency(job1.taxCredits)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">{job2.name || "Secondary Employment"}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span>Annual Income:</span>
                  <span className="font-semibold">{formatCurrency(job2.annualIncome)}</span>
                  <span>Tax Credits:</span>
                  <span className="font-semibold">{formatCurrency(job2.taxCredits)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                  <span>Total Annual Income:</span>
                  <span className="font-semibold">{formatCurrency(TARGET_ANNUAL_INCOME)}</span>
                  <span>Total Tax Credits:</span>
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

