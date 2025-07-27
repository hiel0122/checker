"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { FileCheck, Upload, Eye, Stamp, Calendar, Users, Trash2 } from "lucide-react"

interface CertificateTemplate {
  id: string
  name: string
  fileName: string
  uploadDate: Date
  previewUrl?: string
}

interface SealFile {
  id: string
  name: string
  fileName: string
  uploadDate: Date
  previewUrl?: string
}

interface ClosedEvent {
  id: string
  eventName: string
  eventDate: string
  participantCount: number
}

export default function CertificateManagement() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [seals, setSeals] = useState<SealFile[]>([])
  const [previewData, setPreviewData] = useState({
    name: "홍길동",
    company: "ABC 주식회사",
    event: "2024 기술 컨퍼런스",
    date: "2024년 6월 8일",
  })
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [participantFile, setParticipantFile] = useState<File | null>(null)

  const templateFileRef = useRef<HTMLInputElement>(null)
  const sealFileRef = useRef<HTMLInputElement>(null)
  const participantFileRef = useRef<HTMLInputElement>(null)

  // 샘플 마감된 이벤트 데이터
  const closedEvents: ClosedEvent[] = [
    { id: "1", eventName: "2024 신입사원 교육", eventDate: "2024-03-15", participantCount: 45 },
    { id: "2", eventName: "기술 세미나", eventDate: "2024-04-20", participantCount: 32 },
    { id: "3", eventName: "분기별 회의", eventDate: "2024-05-10", participantCount: 28 },
  ]

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newTemplate: CertificateTemplate = {
      id: Date.now().toString(),
      name: file.name.split(".")[0],
      fileName: file.name,
      uploadDate: new Date(),
      previewUrl: URL.createObjectURL(file),
    }

    setTemplates([...templates, newTemplate])
  }

  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newSeal: SealFile = {
      id: Date.now().toString(),
      name: file.name.split(".")[0],
      fileName: file.name,
      uploadDate: new Date(),
      previewUrl: URL.createObjectURL(file),
    }

    setSeals([...seals, newSeal])
  }

  const handleParticipantUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      alert("CSV 파일만 업로드 가능합니다.")
      return
    }

    setParticipantFile(file)
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm("템플릿을 삭제하시겠습니까?")) {
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const handleDeleteSeal = (id: string) => {
    if (confirm("도장 파일을 삭제하시겠습니까?")) {
      setSeals(seals.filter((s) => s.id !== id))
    }
  }

  const handleEventSelection = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const handleLoadEventData = () => {
    if (selectedEvents.length === 0) {
      alert("불러올 이벤트를 선택해주세요.")
      return
    }

    // 실제로는 선택된 이벤트들의 데이터를 로드하는 로직
    console.log("Loading data for events:", selectedEvents)
    setShowEventModal(false)
    alert(`${selectedEvents.length}개 이벤트의 데이터를 불러왔습니다.`)
  }

  const handlePreviewDataChange = (field: string, value: string) => {
    setPreviewData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">참가확인증 발송</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">참가확인증 템플릿을 관리하고 자동으로 발송합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 업로드 섹션 */}
        <div className="space-y-6">
          {/* 회사 도장 직인 파일 관리 - 상단으로 이동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stamp className="w-5 h-5 mr-2" />
                회사 도장 직인 관리
              </CardTitle>
              <CardDescription>확인증에 사용할 회사 도장 이미지를 업로드하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={sealFileRef}
                  className="hidden"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleSealUpload}
                />
                <Stamp className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <Button onClick={() => sealFileRef.current?.click()} variant="outline">
                  도장 파일 선택
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">PNG, JPG 이미지 파일만 지원</p>
              </div>
            </CardContent>
          </Card>

          {/* 템플릿 업로드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="w-5 h-5 mr-2" />
                확인증 템플릿 업로드
              </CardTitle>
              <CardDescription>참가확인증 템플릿 파일을 업로드하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={templateFileRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleTemplateUpload}
                />
                <Upload className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <Button onClick={() => templateFileRef.current?.click()} variant="outline">
                  템플릿 파일 선택
                </Button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">PDF, Word, 이미지 파일 지원</p>
              </div>

              {/* 미리보기 섹션 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">미리보기</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(previewData).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={`preview-${key}`} className="text-sm">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={`preview-${key}`}
                        value={value}
                        onChange={(e) => handlePreviewDataChange(key, e.target.value)}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 min-h-[200px] flex flex-col items-center justify-center">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm w-full max-w-sm">
                    <h3 className="font-bold text-lg text-center mb-4">참가 확인증</h3>
                    <div className="space-y-2 text-center text-sm">
                      <p>
                        이름: <span className="font-bold">{previewData.name}</span>
                      </p>
                      <p>
                        소속: <span className="font-bold">{previewData.company}</span>
                      </p>
                      <p>
                        이벤트: <span className="font-bold">{previewData.event}</span>
                      </p>
                      <p>
                        날짜: <span className="font-bold">{previewData.date}</span>
                      </p>
                    </div>
                    <div className="mt-6 text-center text-xs">
                      <p>위 사람은 상기 행사에 참가하였음을 확인합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 참가자 목록 업로드 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>참가자 목록 업로드</CardTitle>
              <CardDescription>행사 완료 후 다운받은 CSV 파일을 업로드하여 참가확인증을 발송하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={participantFileRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleParticipantUpload}
                  />
                  <Users className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                  <Button onClick={() => participantFileRef.current?.click()} variant="outline">
                    {participantFile ? participantFile.name : "참가자 CSV 파일 선택"}
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    행사 완료 후 다운받은 CSV 파일만 업로드 가능
                  </p>
                </div>
                {participantFile && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      ✓ {participantFile.name} 파일이 선택되었습니다.
                    </p>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button onClick={() => setShowEventModal(true)}>
                    <Calendar className="w-4 h-4 mr-2" />
                    이벤트 불러오기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 업로드된 파일 목록 */}
        <div className="space-y-6">
          {/* 업로드된 도장 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>업로드된 도장</CardTitle>
            </CardHeader>
            <CardContent>
              {seals.length === 0 ? (
                <div className="text-center py-8">
                  <Stamp className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">업로드된 도장이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {seals.map((seal) => (
                    <div key={seal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Stamp className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">{seal.name}</p>
                          <p className="text-sm text-gray-500">{seal.uploadDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSeal(seal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 업로드된 템플릿 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>업로드된 템플릿</CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">업로드된 템플릿이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileCheck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-500">{template.uploadDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 이벤트 불러오기 모달 */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>이벤트 데이터 불러오기</DialogTitle>
            <DialogDescription>
              마감된 이벤트의 데이터를 불러와서 참가확인증 발송에 사용할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>불러올 이벤트 선택</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {closedEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => handleEventSelection(event.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`event-${event.id}`} className="font-medium cursor-pointer">
                        {event.eventName}
                      </Label>
                      <div className="text-sm text-gray-500">
                        {event.eventDate} • {event.participantCount}명 참석
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedEvents.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {selectedEvents.length}개 이벤트가 선택되었습니다.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              취소
            </Button>
            <Button onClick={handleLoadEventData}>데이터 불러오기</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
