"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function DataAnalytics() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">데이터 분석</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">이벤트 데이터를 분석하고 통계를 확인합니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">데이터 분석 대시보드</CardTitle>
          <CardDescription className="text-center">이벤트 데이터 분석 및 통계 도구</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Database className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center">데이터 분석 기능이 준비 중입니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}
