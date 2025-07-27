"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, Calendar } from "lucide-react"
import type { EventInfo } from "../page"

interface VisitorAnalyticsProps {
  events: EventInfo[]
}

export default function VisitorAnalytics({ events }: VisitorAnalyticsProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [downloadStatus, setDownloadStatus] = useState<string>("")

  // 사용 가능한 월 목록 생성
  const availableMonths = Array.from(
    new Set(events.filter((event) => event.isClosed).map((event) => event.eventDate.substring(0, 7))),
  )
    .sort()
    .reverse()

  const handleDownload = async () => {
    if (!selectedMonth) {
      alert("다운로드할 월을 선택해주세요.")
      return
    }

    setDownloadStatus("데이터를 수집 중입니다...")

    try {
      // 선택된 월의 마감된 행사들 필터링
      const targetEvents = events.filter((event) => event.isClosed && event.eventDate.startsWith(selectedMonth))

      if (targetEvents.length === 0) {
        setDownloadStatus("")
        alert(`${selectedMonth}월에는 마감된 행사가 없습니다.`)
        return
      }

      // 실제 구현에서는 각 행사의 방문자 데이터를 가져와야 함
      // 여기서는 샘플 데이터로 시뮬레이션
      const sampleVisitorData = targetEvents.flatMap((event) => [
        {
          eventName: event.eventName,
          name: "김민준",
          affiliation: "마케팅부",
          position: "팀장",
          email: "minjun@example.com",
          contact: "010-1234-5678",
          isCheckedIn: true,
          isOnSite: false,
        },
        {
          eventName: event.eventName,
          name: "이서연",
          affiliation: "개발팀",
          position: "사원",
          email: "seoyeon@example.com",
          contact: "010-8765-4321",
          isCheckedIn: false,
          isOnSite: false,
        },
      ])

      // CSV 생성
      const csvHeader = "행사명,이름,소속,직급,이메일,연락처,참석여부,비고\n"
      const csvRows = sampleVisitorData
        .map((visitor) => {
          const eventName = `"${visitor.eventName}"`
          const name = `"${visitor.name}"`
          const affiliation = `"${visitor.affiliation}"`
          const position = `"${visitor.position}"`
          const email = `"${visitor.email}"`
          const contact = `"${visitor.contact}"`
          const attendance = visitor.isCheckedIn ? "참석" : "미참석"
          const notes = visitor.isOnSite ? "현장등록" : ""

          return [eventName, name, affiliation, position, email, contact, attendance, notes].join(",")
        })
        .join("\n")

      const csvContent = csvHeader + csvRows
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `visitor_data_${selectedMonth}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setDownloadStatus("다운로드가 완료되었습니다.")

      // 3초 후 상태 메시지 제거
      setTimeout(() => setDownloadStatus(""), 3000)
    } catch (error) {
      console.error("Download error:", error)
      setDownloadStatus("오류 발생: 다운로드에 실패했습니다.")
      setTimeout(() => setDownloadStatus(""), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">방문자 데이터 다운로드</h1>
        <p className="text-gray-600 mt-2">마감된 행사의 방문자 데이터를 월별로 다운로드할 수 있습니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            월별 방문자 데이터 다운로드
          </CardTitle>
          <CardDescription>
            분석하고 싶은 월을 선택하고 '다운로드' 버튼을 클릭하세요. 선택한 월에 '마감' 처리된 모든 이벤트의 방문자
            데이터가 CSV 파일로 생성됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.length === 0 ? (
                    <SelectItem value="" disabled>
                      마감된 행사가 없습니다
                    </SelectItem>
                  ) : (
                    availableMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleDownload}
              disabled={!selectedMonth || availableMonths.length === 0}
              className="flex-shrink-0"
            >
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
          </div>

          {downloadStatus && <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{downloadStatus}</div>}
        </CardContent>
      </Card>

      {/* 사용 가능한 데이터 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            다운로드 가능한 데이터 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableMonths.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">아직 마감된 행사가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">행사를 마감하면 해당 월의 데이터를 다운로드할 수 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableMonths.map((month) => {
                const monthEvents = events.filter((event) => event.isClosed && event.eventDate.startsWith(month))

                return (
                  <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{month}</h3>
                      <p className="text-sm text-gray-600">{monthEvents.length}개의 마감된 행사</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">다운로드 가능</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 다운로드 파일 형식 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>다운로드 파일 형식</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>CSV 파일 형식:</strong>
            </p>
            <code className="text-xs bg-white p-2 rounded border block">
              행사명,이름,소속,직급,이메일,연락처,참석여부,비고
            </code>
            <ul className="text-sm text-gray-600 mt-3 space-y-1">
              <li>• 참석여부: "참석" 또는 "미참석"</li>
              <li>• 비고: 현장등록자의 경우 "현장등록" 표시</li>
              <li>• 인코딩: UTF-8 (한글 지원)</li>
              <li>• 파일명: visitor_data_YYYY-MM.csv</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
