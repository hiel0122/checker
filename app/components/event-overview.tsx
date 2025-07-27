"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Download,
  Check,
  AlertCircle,
  Users,
  Calendar,
  MapPin,
  Clock,
  X,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { EventInfo, Visitor } from "../page"

interface EventOverviewProps {
  event: EventInfo
  visitors: Visitor[]
  setVisitors: (visitors: Visitor[]) => void
  onEventUpdate: (event: EventInfo) => void
}

export default function EventOverview({ event, visitors, setVisitors, onEventUpdate }: EventOverviewProps) {
  const [searchName, setSearchName] = useState("")
  const [searchResults, setSearchResults] = useState<Visitor[]>([])
  const [showOnSiteModal, setShowOnSiteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [onSiteForm, setOnSiteForm] = useState<Partial<Visitor & { category: string }>>({})
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info" | "onsite"; message: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 9 // 3행 × 3명
  const checkedInVisitors = visitors.filter((v) => v.isCheckedIn)
  const totalPages = Math.ceil(checkedInVisitors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVisitors = checkedInVisitors.slice(startIndex, endIndex)

  const showAlert = (type: "success" | "error" | "info" | "onsite", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  // 날짜 포맷팅 함수
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    const ampm = hours >= 12 ? "오후" : "오전"
    const displayHours = hours % 12 || 12

    return `${year}-${month}-${day} ${ampm} ${String(displayHours).padStart(2, "0")}:${minutes}:${seconds}`
  }

  const handleSearch = () => {
    if (!searchName.trim()) {
      showAlert("error", "이름을 입력하세요.")
      return
    }

    // 현재 체크인되지 않은 방문자 중에서만 검색 (삭제된 현장 등록자 제외)
    const results = visitors
      .filter((v) => !v.isCheckedIn)
      .filter((v) => v.name.toLowerCase().includes(searchName.toLowerCase()))

    // 이미 체크인된 방문자 중에서도 검색 (이미 등록된 참석자 검색 시 현장 등록 팝업 방지)
    const checkedInResults = visitors
      .filter((v) => v.isCheckedIn)
      .filter((v) => v.name.toLowerCase().includes(searchName.toLowerCase()))

    if (results.length === 0 && checkedInResults.length === 0) {
      setShowOnSiteModal(true)
      setOnSiteForm({ name: searchName.trim(), category: "일반" })
    } else {
      // 체크인되지 않은 방문자와 이미 체크인된 방문자 모두 결과에 표시
      setSearchResults([...results, ...checkedInResults])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // 기본 동작 방지 (중복 입력 방지)
      handleSearch()
    }
  }

  const handleCheckIn = (visitor: Visitor) => {
    if (visitor.isCheckedIn) {
      showAlert("error", "이미 참석완료한 참석자입니다.")
      return
    }

    const updatedVisitors = visitors.map((v) =>
      v.id === visitor.id ? { ...v, isCheckedIn: true, checkedInAt: new Date() } : v,
    )
    setVisitors(updatedVisitors)
    setSearchResults(
      searchResults.map((v) => (v.id === visitor.id ? { ...v, isCheckedIn: true, checkedInAt: new Date() } : v)),
    )
    showAlert("success", `${visitor.name}님의 참석이 완료되었습니다.`)
    setSearchName("") // Clear search input after attendance check
    setSearchResults([]) // Clear search results
  }

  const handleOnSiteRegistration = () => {
    if (
      !onSiteForm.name ||
      !onSiteForm.affiliation ||
      !onSiteForm.position ||
      !onSiteForm.email ||
      !onSiteForm.contact
    ) {
      showAlert("error", "모든 필드를 입력해주세요.")
      return
    }

    const newVisitor: Visitor = {
      id: `onsite-${Date.now()}`,
      name: onSiteForm.name,
      affiliation: onSiteForm.affiliation,
      position: onSiteForm.position,
      email: onSiteForm.email,
      contact: onSiteForm.contact,
      isCheckedIn: true,
      isOnSite: true,
      checkedInAt: new Date(),
      category: onSiteForm.category || "일반",
    }

    setVisitors([...visitors, newVisitor])
    setShowOnSiteModal(false)
    setOnSiteForm({})
    setSearchName("")
    setSearchResults([])
    showAlert("onsite", `${newVisitor.name}님의 현장 등록이 완료되었습니다.`)
  }

  const handleEditVisitor = (visitor: Visitor) => {
    setEditingVisitor({ ...visitor, category: visitor.category || "일반" })
    setShowEditModal(true)
  }

  const handleUpdateVisitor = () => {
    if (!editingVisitor) return

    if (
      !editingVisitor.name ||
      !editingVisitor.affiliation ||
      !editingVisitor.position ||
      !editingVisitor.email ||
      !editingVisitor.contact
    ) {
      showAlert("error", "모든 필드를 입력해주세요.")
      return
    }

    const updatedVisitors = visitors.map((v) => (v.id === editingVisitor.id ? editingVisitor : v))
    setVisitors(updatedVisitors)
    setShowEditModal(false)
    setEditingVisitor(null)
    showAlert("success", `${editingVisitor.name}님의 정보가 수정되었습니다.`)
  }

  const handleDeleteVisitor = (visitor: Visitor) => {
    if (confirm(`${visitor.name}님의 참석을 취소하시겠습니까?`)) {
      if (visitor.isOnSite) {
        // 현장 등록자는 완전히 삭제
        const updatedVisitors = visitors.filter((v) => v.id !== visitor.id)
        setVisitors(updatedVisitors)
      } else {
        // 사전 등록자는 체크인만 취소
        const updatedVisitors = visitors.map((v) =>
          v.id === visitor.id ? { ...v, isCheckedIn: false, checkedInAt: undefined } : v,
        )
        setVisitors(updatedVisitors)
      }
      showAlert("error", `${visitor.name}님의 참석이 취소되었습니다.`)
    }
  }

  const handleCloseEvent = () => {
    if (confirm("해당 이벤트를 마감하시겠습니까?\n이벤트 마감 시, 수정이 불가합니다.")) {
      const updatedEvent = { ...event, isClosed: true }
      onEventUpdate(updatedEvent)
      showAlert("success", "이벤트가 마감되었습니다.")
    }
  }

  const downloadAttendanceReport = () => {
    const csvContent = [
      "이름,소속,직급,이메일,연락처,참석여부,참석시간,메모",
      ...visitors.map(
        (v) =>
          `${v.name},${v.affiliation},${v.position},${v.email},${v.contact},${v.isCheckedIn ? "참석" : "미참석"},${v.checkedInAt ? formatDateTime(v.checkedInAt) : ""},${v.memo || ""}`,
      ),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${event.eventName}_참석체크_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = {
    total: visitors.length,
    checkedIn: visitors.filter((v) => v.isCheckedIn && !v.isOnSite).length,
    onSite: visitors.filter((v) => v.isOnSite).length,
    allCheckedIn: visitors.filter((v) => v.isCheckedIn).length,
  }

  // 참석자 구성 비율 계산
  const getAttendanceRatio = () => {
    if (stats.allCheckedIn === 0) return { preRegistered: 0, onSite: 0 }
    return {
      preRegistered: Math.round((stats.checkedIn / stats.allCheckedIn) * 100),
      onSite: Math.round((stats.onSite / stats.allCheckedIn) * 100),
    }
  }

  const ratio = getAttendanceRatio()

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800"
      case "error":
        return "border-red-200 bg-red-50 text-red-800"
      case "onsite":
        return "border-yellow-200 bg-yellow-50 text-yellow-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 - 왼쪽 정렬 */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{event.eventName}</h1>
          <div className="flex flex-col space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              담당자: {event.managerName} {event.managerAffiliation && `(${event.managerAffiliation})`}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {event.eventDate}
            </div>
            {event.eventLocation && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {event.eventLocation}
              </div>
            )}
            {(event.startTime || event.endTime) && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {event.startTime && event.endTime
                  ? `${event.startTime} - ${event.endTime}`
                  : event.startTime || event.endTime}
              </div>
            )}
          </div>
        </div>
        {!event.isClosed && (
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => alert("고객데이터 변경 기능이 준비 중입니다.")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              고객데이터 변경
            </Button>
            <Button onClick={handleCloseEvent} variant="destructive">
              이벤트 마감
            </Button>
          </div>
        )}
      </div>

      {event.isClosed && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>이 이벤트는 마감되어 더 이상 수정할 수 없습니다.</AlertDescription>
        </Alert>
      )}

      {/* 참석현황과 그래프를 좌우로 배치 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 참석현황 - 좌측 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-bold">참석 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">사전예약</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.checkedIn}</div>
                <div className="text-sm text-green-700 dark:text-green-300">참석</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.onSite}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">현장등록</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.allCheckedIn}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">총 참석</div>
              </div>
            </div>

            <Button onClick={downloadAttendanceReport} className="w-full bg-green-600 hover:bg-green-700 mt-4">
              <Download className="w-4 h-4 mr-2" />
              참석 결과 다운로드
            </Button>
          </CardContent>
        </Card>

        {/* 참석자 구성 비율 그래프 - 우측 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-bold">참석자 구성 비율</CardTitle>
          </CardHeader>
          <CardContent>
            {visitors.length > 0 && stats.allCheckedIn > 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative w-32 h-32 mb-6">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${ratio.preRegistered}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray={`${ratio.onSite}, 100`}
                      strokeDashoffset={`-${ratio.preRegistered}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">{stats.allCheckedIn}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>
                      사전등록 {stats.checkedIn}명 ({ratio.preRegistered}%)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span>
                      현장등록 {stats.onSite}명 ({ratio.onSite}%)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full py-12">
                <p className="text-gray-500 dark:text-gray-400">참석자 데이터가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 참석자 목록 - 검색 기능을 상단으로 이동 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">참석자 목록</CardTitle>
          {/* 검색 기능을 참석자 목록 상단으로 이동 */}
          <div className="space-y-2 pt-4">
            <Label htmlFor="search">참석자 이름 검색</Label>
            <div className="flex space-x-2">
              <Input
                id="search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="이름을 입력하세요"
                disabled={event.isClosed}
              />
              <Button onClick={handleSearch} disabled={event.isClosed}>
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 검색 결과 - 참석자 목록 내부로 이동 */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-3">검색 결과</h3>
              <div className="space-y-3">
                {searchResults.map((visitor) => (
                  <div key={visitor.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-lg">{visitor.name}</div>
                      <div className="flex items-center space-x-2">
                        {visitor.isCheckedIn ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          >
                            참석완료
                          </Badge>
                        ) : (
                          <Button onClick={() => handleCheckIn(visitor)} size="sm" disabled={event.isClosed}>
                            <Check className="w-4 h-4 mr-1" />
                            참석체크
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>
                        <strong>소속:</strong> {visitor.affiliation}
                      </div>
                      <div>
                        <strong>직급:</strong> {visitor.position}
                      </div>
                      <div>
                        <strong>이메일:</strong> {visitor.email}
                      </div>
                      <div>
                        <strong>연락처:</strong> {visitor.contact}
                      </div>
                      {visitor.checkedInAt && (
                        <div>
                          <strong>참석시간:</strong> {formatDateTime(visitor.checkedInAt)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 알림 메시지 - 참석자 목록 내부로 이동 */}
          {alert && (
            <Alert className={`mb-6 ${getAlertStyles(alert.type)}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* 참석자 목록 */}
          <div>
            <h3 className="font-medium text-lg mb-3">참석자 목록</h3>
            {checkedInVisitors.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">아직 참석한 참석자가 없습니다.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentVisitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      className={`border rounded-lg p-4 ${
                        visitor.isOnSite
                          ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-lg flex items-center">
                            {visitor.name}
                            {visitor.isOnSite && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
                              >
                                현장등록
                              </Badge>
                            )}
                          </div>
                          {!event.isClosed && (
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border-green-300 dark:border-green-700 bg-transparent"
                                onClick={() => handleEditVisitor(visitor)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-red-300 dark:border-red-700 bg-transparent"
                                onClick={() => handleDeleteVisitor(visitor)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div>
                            {visitor.affiliation} / {visitor.position}
                          </div>
                          <div>
                            {visitor.email} / {visitor.contact}
                          </div>
                          <div>참석시간: {visitor.checkedInAt ? formatDateTime(visitor.checkedInAt) : ""}</div>
                          {visitor.memo && (
                            <div className="text-gray-700 dark:text-gray-500 font-bold italic">
                              메모: {visitor.memo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  총 {checkedInVisitors.length}명 중 {startIndex + 1}-{Math.min(endIndex, checkedInVisitors.length)}명
                  표시
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 현장 등록 모달 */}
      <Dialog open={showOnSiteModal} onOpenChange={setShowOnSiteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>현장 방문자 등록</DialogTitle>
            <DialogDescription>검색 결과가 없습니다. 현장에서 새로 등록하시겠습니까?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="onsite-category">참가자 구분 *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["일반", "Speaker", "초대", "기타"].map((category) => (
                  <Button
                    key={category}
                    variant={onSiteForm.category === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOnSiteForm({ ...onSiteForm, category })}
                    disabled={event.isClosed}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="onsite-name">이름 *</Label>
              <Input
                id="onsite-name"
                value={onSiteForm.name || ""}
                onChange={(e) => setOnSiteForm({ ...onSiteForm, name: e.target.value })}
                placeholder="이름을 입력하세요"
                disabled={event.isClosed}
                required
              />
            </div>

            <div>
              <Label htmlFor="onsite-affiliation">소속 *</Label>
              <Input
                id="onsite-affiliation"
                value={onSiteForm.affiliation || ""}
                onChange={(e) => setOnSiteForm({ ...onSiteForm, affiliation: e.target.value })}
                placeholder="소속을 입력하세요"
                disabled={event.isClosed}
                required
              />
            </div>

            <div>
              <Label htmlFor="onsite-position">직급 *</Label>
              <Input
                id="onsite-position"
                value={onSiteForm.position || ""}
                onChange={(e) => setOnSiteForm({ ...onSiteForm, position: e.target.value })}
                placeholder="직급을 입력하세요"
                disabled={event.isClosed}
                required
              />
            </div>

            <div>
              <Label htmlFor="onsite-email">이메일 *</Label>
              <Input
                id="onsite-email"
                type="email"
                value={onSiteForm.email || ""}
                onChange={(e) => setOnSiteForm({ ...onSiteForm, email: e.target.value })}
                placeholder="이메일을 입력하세요"
                disabled={event.isClosed}
                required
              />
            </div>

            <div>
              <Label htmlFor="onsite-contact">연락처 *</Label>
              <Input
                id="onsite-contact"
                value={onSiteForm.contact || ""}
                onChange={(e) => setOnSiteForm({ ...onSiteForm, contact: e.target.value })}
                placeholder="연락처를 입력하세요"
                disabled={event.isClosed}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowOnSiteModal(false)}>
              취소
            </Button>
            <Button
              onClick={handleOnSiteRegistration}
              className="bg-green-600 hover:bg-green-700"
              disabled={event.isClosed}
            >
              현장 등록
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 수정 모달 - 현장 등록 모달과 동일한 형태 */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>참석자 정보 수정</DialogTitle>
            <DialogDescription>참석자 정보를 수정합니다.</DialogDescription>
          </DialogHeader>

          {editingVisitor && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-category">참가자 구분 *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["일반", "Speaker", "초대", "기타"].map((category) => (
                    <Button
                      key={category}
                      variant={editingVisitor.category === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditingVisitor({ ...editingVisitor, category })}
                      disabled={event.isClosed}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-name">이름 *</Label>
                <Input
                  id="edit-name"
                  value={editingVisitor.name}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, name: e.target.value })}
                  disabled={event.isClosed}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-affiliation">소속 *</Label>
                <Input
                  id="edit-affiliation"
                  value={editingVisitor.affiliation}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, affiliation: e.target.value })}
                  disabled={event.isClosed}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-position">직급 *</Label>
                <Input
                  id="edit-position"
                  value={editingVisitor.position}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, position: e.target.value })}
                  disabled={event.isClosed}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-email">이메일 *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingVisitor.email}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, email: e.target.value })}
                  disabled={event.isClosed}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-contact">연락처 *</Label>
                <Input
                  id="edit-contact"
                  value={editingVisitor.contact}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, contact: e.target.value })}
                  disabled={event.isClosed}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-memo">메모</Label>
                <Textarea
                  id="edit-memo"
                  value={editingVisitor.memo || ""}
                  onChange={(e) => setEditingVisitor({ ...editingVisitor, memo: e.target.value })}
                  placeholder="메모를 입력하세요"
                  disabled={event.isClosed}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateVisitor} className="bg-green-600 hover:bg-green-700" disabled={event.isClosed}>
              수정 완료
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
