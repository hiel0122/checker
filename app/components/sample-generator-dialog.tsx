"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, FileSpreadsheet } from "lucide-react"

interface SampleGeneratorDialogProps {
  trigger?: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function SampleGeneratorDialog({
  trigger,
  variant = "outline",
  size = "sm",
}: SampleGeneratorDialogProps) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(20)
  const [includeHomonyms, setIncludeHomonyms] = useState(true)

  // 샘플 CSV 데이터 생성 함수
  function generateSampleCSV(count: number, includeHomonyms: boolean): string {
    const headers = "이름,소속,직급,이메일,전화번호"
    const names = ["김민준", "이서연", "박지훈", "최수아", "정도윤", "강하은", "윤민서", "임준호", "한지민", "오현우"]
    const orgs = [
      "마케팅부",
      "개발팀",
      "인사팀",
      "영업부",
      "기획팀",
      "디자인팀",
      "재무팀",
      "고객지원팀",
      "연구소",
      "총무팀",
    ]
    const positions = ["사원", "대리", "과장", "차장", "부장", "팀장", "실장", "이사", "상무", "전무"]

    // 동명이인 처리를 위한 이름 중복 확률 설정
    const duplicateNameProbability = includeHomonyms ? 0.3 : 0

    // 이미 사용된 이름 추적
    const usedNames = new Set<string>()

    const rows = Array.from({ length: count }, (_, i) => {
      // 동명이인 생성 로직
      let name: string
      if (Math.random() < duplicateNameProbability && usedNames.size > 0) {
        // 이미 사용된 이름 중에서 랜덤하게 선택
        const usedNamesArray = Array.from(usedNames)
        name = usedNamesArray[Math.floor(Math.random() * usedNamesArray.length)]
      } else {
        // 새로운 이름 생성
        const nameIndex = Math.floor(Math.random() * names.length)
        name = names[nameIndex]
        usedNames.add(name)
      }

      const orgIndex = Math.floor(Math.random() * orgs.length)
      const posIndex = Math.floor(Math.random() * positions.length)
      const org = orgs[orgIndex]
      const position = positions[posIndex]
      const email = `${name}${Math.floor(Math.random() * 1000)}@example.com`
      const phone = `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`

      return `${name},${org},${position},${email},${phone}`
    })

    return [headers, ...rows].join("\n")
  }

  // CSV 파일 다운로드 함수
  function downloadCSV(csvContent: string, fileName: string): void {
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerate = () => {
    const sampleData = generateSampleCSV(count, includeHomonyms)
    downloadCSV(sampleData, `출석체크_샘플데이터_${count}명.csv`)
    setOpen(false)
  }

  const defaultTrigger = (
    <Button variant={variant} size={size}>
      <FileSpreadsheet className="w-4 h-4 mr-2" />
      샘플 CSV 생성
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>테스트용 CSV 샘플 생성</DialogTitle>
          <DialogDescription>테스트 목적으로 사용할 가상의 참석자 데이터를 생성합니다.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="count">참석자 수: {count}명</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCount(Math.max(5, count - 5))}
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCount(Math.min(100, count + 5))}
                >
                  +
                </Button>
              </div>
            </div>
            <Slider
              id="count"
              min={5}
              max={100}
              step={1}
              value={[count]}
              onValueChange={(values) => setCount(values[0])}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeHomonyms"
              checked={includeHomonyms}
              onChange={(e) => setIncludeHomonyms(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="includeHomonyms">동명이인 포함하기</Label>
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
            <p>생성될 CSV 파일은 다음 형식을 따릅니다:</p>
            <p className="font-mono text-xs mt-1">이름,소속,직급,이메일,전화번호</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleGenerate}>
            <Download className="w-4 h-4 mr-2" />
            생성 및 다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
