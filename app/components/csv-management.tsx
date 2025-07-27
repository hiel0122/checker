"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet } from "lucide-react"

export default function CsvManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">CSV 관리</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">CSV 파일을 관리하고 분석합니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">CSV 관리 대시보드</CardTitle>
          <CardDescription className="text-center">CSV 파일 업로드, 편집 및 분석 도구</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileSpreadsheet className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center">CSV 관리 기능이 준비 중입니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}
