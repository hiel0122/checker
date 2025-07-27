"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Search, Download, Check, AlertCircle, Users, Calendar, FileSpreadsheet } from "lucide-react"
import SampleGeneratorDialog from "./sample-generator-dialog"

interface EventInfo {
  managerName: string
  organization: string
  eventName: string
  eventDateTime: string
}

interface Participant {
  name: string
  organization: string
  position: string
  email: string
  phone: string
  attended: boolean
  attendedAt?: string
}

interface AttendanceCheckerProps {
  eventInfo: EventInfo
}

export default function AttendanceChecker({ eventInfo }: AttendanceCheckerProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [searchName, setSearchName] = useState("")
  const [searchResults, setSearchResults] = useState<Participant[]>([])
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showAlert = (type: "success" | "error" | "info", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      showAlert("error", "CSV 파일만 업로드 가능합니다.")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        showAlert("error", "올바른 CSV 형식이 아닙니다.")
        return
      }

      const headers = lines[0].split(",").map((h) => h.trim())
      const expectedHeaders = ["이름", "소속", "직급", "이메일", "전화번호"]

      if (!expectedHeaders.every((header) => headers.includes(header))) {
        showAlert("error", "CSV 파일의 헤더가 올바르지 않습니다. (이름, 소속, 직급, 이메일, 전화번호)")
        return
      }

      const parsedParticipants: Participant[] = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim())
          return {
            name: values[headers.indexOf("이름")] || "",
            organization: values[headers.indexOf("소속")] || "",
            position: values[headers.indexOf("직급")] || "",
            email: values[headers.indexOf("이메일")] || "",
            phone: values[headers.indexOf("전화번호")] || "",
            attended: false,
          }
        })
        .filter((p) => p.name) // 이름이 있는 참석자만 포함

      setParticipants(parsedParticipants)
      setIsFileUploaded(true)
      showAlert("success", `${parsedParticipants.length}명의 참석자 정보가 업로드되었습니다.`)
    }

    reader.readAsText(file, "utf-8")
  }

  const handleSearch = () => {
    if (!searchName.trim()) {
      setSearchResults([])
      return
    }

    const results = participants.filter((p) => p.name.toLowerCase().includes(searchName.toLowerCase()))

    if (results.length === 0) {
      showAlert("info", "해당 이름의 참석자를 찾을 수 없습니다.")
      setSearchResults([])
    } else {
      setSearchResults(results)
    }
  }

  const handleAttendanceCheck = (participant: Participant) => {
    if (participant.attended) {
      showAlert("error", "이미 출석완료한 참석자입니다.")
      return
    }

    const now = new Date().toLocaleString("ko-KR")
    setParticipants((prev) => prev.map((p) => (p === participant ? { ...p, attended: true, attendedAt: now } : p)))

    setSearchResults((prev) => prev.map((p) => (p === participant ? { ...p, attended: true, attendedAt: now } : p)))

    showAlert("success", `${participant.name}님의 출석이 완료되었습니다.`)
  }

  const downloadAttendanceFile = () => {
    const attendedParticipants = participants.filter((p) => p.attended)
    const csvContent = [
      "이름,소속,직급,이메일,전화번호,출석여부,출석시간",
      ...participants.map(
        (p) =>
          `${p.name},${p.organization},${p.position},${p.email},${p.phone},${p.attended ? "출석" : "미출석"},${p.attendedAt || ""}`,
      ),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${eventInfo.eventName}_출석체크_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showAlert("success", "출석체크 결과 파일이 다운로드되었습니다.")
  }

  const downloadBackupFile = () => {
    const csvContent = [
      "이름,소속,직급,이메일,전화번호",
      ...participants.map((p) => `${p.name},${p.organization},${p.position},${p.email},${p.phone}`),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${eventInfo.eventName}_원본백업_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showAlert("success", "원본 파일 백업이 다운로드되었습니다.")
  }

  const attendedCount = participants.filter((p) => p.attended).length
  const totalCount = participants.length

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{eventInfo.eventName}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  담당자: {eventInfo.managerName} ({eventInfo.organization})
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(eventInfo.eventDateTime).toLocaleString("ko-KR")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {attendedCount} / {totalCount}
              </div>
              <div className="text-sm text-gray-600">출석 완료</div>
            </div>
          </div>
        </div>

        {/* 알림 */}
        {alert && (
          <Alert
            className={`mb-6 ${
              alert.type === "success"
                ? "border-green-200 bg-green-50"
                : alert.type === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 파일 업로드 및 검색 */}
          <Card>
            <CardHeader>
              <CardTitle>참석자 명단 관리</CardTitle>
              <CardDescription>CSV 파일을 업로드하고 참석자를 검색하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isFileUploaded ? (
                <div>
                  <Label htmlFor="file-upload">참석자 명단 CSV 파일</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      CSV 파일 업로드
                    </Button>
                  </div>
                  <div className="mt-2">
                    <SampleGeneratorDialog
                      variant="ghost"
                      trigger={
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <FileSpreadsheet className="w-4 h-4 mr-1" />
                          샘플 CSV 파일 생성
                        </Button>
                      }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    CSV 형식: 이름, 소속, 직급, 이메일, 전화번호 (첫 줄은 헤더로 포함해야 합니다)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="search">참석자 이름 검색</Label>
                      <Input
                        id="search"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="이름을 입력하세요"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch} className="mt-6">
                      <Search className="w-4 h-4 mr-2" />
                      검색
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={downloadAttendanceFile} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      출석결과 다운로드
                    </Button>
                    <Button onClick={downloadBackupFile} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      원본백업 다운로드
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 검색 결과 */}
          <Card>
            <CardHeader>
              <CardTitle>검색 결과</CardTitle>
              <CardDescription>
                {searchResults.length > 0
                  ? `${searchResults.length}명의 참석자가 검색되었습니다`
                  : "이름을 검색하여 출석체크를 진행하세요"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((participant, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">{participant.name}</div>
                        <div className="flex items-center space-x-2">
                          {participant.attended ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              출석완료
                            </Badge>
                          ) : (
                            <Button onClick={() => handleAttendanceCheck(participant)} size="sm">
                              <Check className="w-4 h-4 mr-1" />
                              출석체크
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <strong>소속:</strong> {participant.organization}
                        </div>
                        <div>
                          <strong>직급:</strong> {participant.position}
                        </div>
                        <div>
                          <strong>이메일:</strong> {participant.email}
                        </div>
                        <div>
                          <strong>전화번호:</strong> {participant.phone}
                        </div>
                        {participant.attended && participant.attendedAt && (
                          <div>
                            <strong>출석시간:</strong> {participant.attendedAt}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isFileUploaded ? "참석자 이름을 검색해주세요" : "먼저 참석자 명단 CSV 파일을 업로드해주세요"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 통계 */}
        {isFileUploaded && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>출석 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                  <div className="text-sm text-gray-600">총 참석자</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{attendedCount}</div>
                  <div className="text-sm text-gray-600">출석완료</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalCount - attendedCount}</div>
                  <div className="text-sm text-gray-600">미출석</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">출석률</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
