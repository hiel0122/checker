"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function VipManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">VIP 관리</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">VIP 고객 정보를 관리합니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">VIP 관리 대시보드</CardTitle>
          <CardDescription className="text-center">VIP 고객 정보 관리 및 특별 서비스 제공</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Star className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center">VIP 관리 기능이 준비 중입니다.</p>
        </CardContent>
      </Card>
    </div>
  )
}
