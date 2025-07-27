"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  AlertCircle,
} from "lucide-react"
import type { EventInfo, Visitor } from "../page"

interface EventSelectionProps {
  events: EventInfo[]
  setEvents: (events: EventInfo[]) => void
  onEventSelect: (event: EventInfo) => void
  setVisitors: (visitors: Visitor[]) => void
}

export default function EventSelection({ events, setEvents, onEventSelect, setVisitors }: EventSelectionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("")
  const [formData, setFormData] = useState<Partial<EventInfo>>({})
  const [uploadedVisitors, setUploadedVisitors] = useState<Visitor[]>([])
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
      const expectedHeaders = ["이름", "소속", "직급", "이메일", "연락처"]

      if (!expectedHeaders.every((header) => headers.includes(header))) {
        showAlert("error", "CSV 파일의 헤더가 올바르지 않습니다. (이름, 소속, 직급, 이메일, 연락처)")
        return
      }

      const parsedVisitors: Visitor[] = lines
        .slice(1)
        .map((line, index) => {
          const values = line.split(",").map((v) => v.trim())
          return {
            id: `csv-${index}`,
            name: values[headers.indexOf("이름")] || "",
            affiliation: values[headers.indexOf("소속")] || "",
            position: values[headers.indexOf("직급")] || "",
            email: values[headers.indexOf("이메일")] || "",
            contact: values[headers.indexOf("연락처")] || "",
            isCheckedIn: false,
            isOnSite: false,
          }
        })
        .filter((v) => v.name)

      setUploadedVisitors(parsedVisitors)
      showAlert("success", `${parsedVisitors.length}명의 참석자 정보가 업로드되었습니다.`)
    }

    reader.readAsText(file, "utf-8")
  }

  const downloadCSVTemplate = () => {
    const csvContent =
      "이름,소속,직급,이메일,연락처\n홍길동,마케팅팀,팀장,hong@example.com,010-1234-5678\n김영희,개발팀,사원,kim@example.com,010-8765-4321"
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "visitor_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateEvent = () => {
    if (!formData.managerName || !formData.eventDate || !formData.eventName) {
      alert("필수 항목을 모두 입력해주세요.")
      return
    }

    if (uploadedVisitors.length === 0) {
      alert("참석자 명단 CSV 파일을 업로드해주세요.")
      return
    }

    const newEvent: EventInfo = {
      id: Date.now().toString(),
      managerName: formData.managerName!,
      managerAffiliation: formData.managerAffiliation || "",
      eventDate: formData.eventDate!,
      startTime: formData.startTime || "",
      endTime: formData.endTime || "",
      eventLocation: formData.eventLocation || "",
      eventName: formData.eventName!,
      isClosed: false,
      createdAt: new Date(),
    }

    setEvents([...events, newEvent])

    // 업로드된 참석자 데이터가 있으면 설정
    if (uploadedVisitors.length > 0) {
      setVisitors(uploadedVisitors)
      localStorage.setItem(`event_${newEvent.id}_visitors`, JSON.stringify(uploadedVisitors))
    }

    setShowCreateModal(false)
    setFormData({})
    setSelectedCalendarDate("")
    setUploadedVisitors([])

    // 생성된 이벤트로 바로 이동
    onEventSelect(newEvent)
  }

  const handleShowCreateModal = () => {
    // 디폴트 값 설정
    setFormData({
      managerName: "이학인",
      managerAffiliation: "사업기획팀",
      eventDate: selectedCalendarDate || "", // 선택된 캘린더 날짜를 디폴트로 설정
    })
    setUploadedVisitors([])
    setShowCreateModal(true)
  }

  const getEventStatus = (event: EventInfo) => {
    const today = new Date().toISOString().split("T")[0]
    const eventDate = event.eventDate

    if (event.isClosed) return { status: "completed", label: "마감", color: "bg-red-500" }
    if (eventDate === today) return { status: "inProgress", label: "진행중", color: "bg-green-500" }
    if (eventDate > today) return { status: "upcoming", label: "예정", color: "bg-yellow-500" }
    return { status: "completed", label: "종료", color: "bg-red-500" }
  }

  // 캘린더 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter((event) => event.eventDate === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (dateStr: string) => {
    setSelectedCalendarDate(selectedCalendarDate === dateStr ? "" : dateStr)
  }

  const daysInMonth = getDaysInMonth(selectedDate)
  const firstDay = getFirstDayOfMonth(selectedDate)
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">이벤트 관리</h1> {/* Changed title */}
        <p className="text-gray-600 dark:text-gray-400 mt-2">관리할 이벤트를 선택하거나 새로운 이벤트를 생성하세요</p>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleShowCreateModal} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />새 이벤트 만들기
        </Button>
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

      {/* 캘린더 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">이벤트 캘린더</CardTitle> {/* Centered title */}
          <div className="flex items-center justify-center space-x-2 mt-2">
            {" "}
            {/* Centered month navigation */}
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[100px] text-center">
              {selectedDate.getFullYear()}년 {monthNames[selectedDate.getMonth()]}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* 빈 칸들 */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="p-2 h-20" />
            ))}
            {/* 날짜들 */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const dateStr = formatDate(selectedDate.getFullYear(), selectedDate.getMonth(), day)
              const dayEvents = getEventsForDate(dateStr)
              const isToday = dateStr === new Date().toISOString().split("T")[0]
              const isSelected = selectedCalendarDate === dateStr

              return (
                <div
                  key={day}
                  className={`p-1 h-20 border rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-200 dark:bg-blue-800 border-blue-400 dark:border-blue-600"
                      : isToday
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                        : "border-gray-200 dark:border-gray-700"
                  } hover:bg-gray-50 dark:hover:bg-gray-800`}
                  onClick={() => handleDateClick(dateStr)}
                >
                  <div
                    className={`text-sm ${
                      isSelected
                        ? "font-bold text-blue-800 dark:text-blue-200"
                        : isToday
                          ? "font-bold text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((event) => {
                      const status = getEventStatus(event)
                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded cursor-pointer truncate transition-all duration-200 hover:scale-105 ${
                            status.status === "upcoming"
                              ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                              : status.status === "inProgress"
                                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventSelect(event)
                          }}
                          title={event.eventName}
                        >
                          {event.eventName}
                        </div>
                      )
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2}개 더</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {selectedCalendarDate && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                선택된 날짜: <strong>{selectedCalendarDate}</strong>
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                새 이벤트 만들기를 클릭하면 이 날짜가 자동으로 설정됩니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 이벤트 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">전체 이벤트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">등록된 이벤트가 없습니다.</p>
              </div>
            ) : (
              events.map((event, index) => {
                const statusInfo = getEventStatus(event)

                return (
                  <Card
                    key={event.id}
                    className="hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1" onClick={() => onEventSelect(event)}>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${statusInfo.color} transition-all duration-300`} />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                              {event.eventName}
                            </h3>
                            <Badge variant="secondary" className="dark:bg-gray-700">
                              {statusInfo.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.eventDate}
                            </div>
                            {event.eventLocation && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {event.eventLocation}
                              </div>
                            )}
                            {(event.startTime || event.endTime) && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {event.startTime && event.endTime
                                  ? `${event.startTime} - ${event.endTime}`
                                  : event.startTime || event.endTime}
                              </div>
                            )}
                          </div>

                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            담당자: {event.managerName}
                            {event.managerAffiliation && ` (${event.managerAffiliation})`}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {/* 수정 버튼 - 마감된 이벤트는 삭제 */}
                          {!event.isClosed && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="transition-all duration-200 hover:scale-105 bg-transparent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {/* 삭제 버튼 - 마감된 이벤트는 삭제 */}
                          {!event.isClosed && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 hover:scale-105 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* 새 이벤트 생성 모달 */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center font-bold">새 이벤트 만들기</DialogTitle>
            <DialogDescription className="text-center">새로운 이벤트의 정보를 입력해주세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="managerName">담당자 이름 *</Label>
              <Input
                id="managerName"
                value={formData.managerName || ""}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="홍길동"
              />
            </div>

            <div>
              <Label htmlFor="managerAffiliation">담당자 소속</Label>
              <Input
                id="managerAffiliation"
                value={formData.managerAffiliation || ""}
                onChange={(e) => setFormData({ ...formData, managerAffiliation: e.target.value })}
                placeholder="마케팅팀"
              />
            </div>

            <div>
              <Label htmlFor="eventName">이벤트명 *</Label>
              <Input
                id="eventName"
                value={formData.eventName || ""}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                placeholder="2024년 신입사원 교육"
              />
            </div>

            <div>
              <Label htmlFor="eventDate">이벤트 날짜 *</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate || ""}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
              {selectedCalendarDate && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  캘린더에서 선택된 날짜: {selectedCalendarDate}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">시작 시간</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime || ""}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">종료 시간</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime || ""}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eventLocation">이벤트 장소</Label>
              <Input
                id="eventLocation"
                value={formData.eventLocation || ""}
                onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                placeholder="서울시 강남구 ..."
              />
            </div>

            {/* 참석자 명단 업로드 섹션 */}
            <div className="border-t pt-4">
              <Label htmlFor="file-upload" className="flex items-center">
                참석자 명단 CSV 파일 *<span className="text-red-500 ml-1">필수</span>
              </Label>
              <div className="mt-2 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  CSV 파일 업로드
                </Button>
                <Button type="button" onClick={downloadCSVTemplate} variant="ghost" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  CSV 양식 다운로드
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                CSV 형식: 이름, 소속, 직급, 이메일, 연락처
              </p>
              {uploadedVisitors.length > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  ✓ {uploadedVisitors.length}명의 참석자 정보가 업로드되었습니다.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              취소
            </Button>
            <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700">
              생성
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
