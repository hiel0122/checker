"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react"

interface Speaker {
  id: string
  name: string
  affiliation: string
  position: string
  email: string
  contact: string
  createdAt: Date
}

export default function SpeakerManagement() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    affiliation: "",
    position: "",
    email: "",
    contact: "",
  })

  const handleAddSpeaker = () => {
    if (!formData.name || !formData.affiliation || !formData.position || !formData.email || !formData.contact) {
      alert("모든 필드를 입력해주세요.")
      return
    }

    const newSpeaker: Speaker = {
      id: Date.now().toString(),
      name: formData.name,
      affiliation: formData.affiliation,
      position: formData.position,
      email: formData.email,
      contact: formData.contact,
      createdAt: new Date(),
    }

    setSpeakers([...speakers, newSpeaker])
    setShowAddModal(false)
    setFormData({
      name: "",
      affiliation: "",
      position: "",
      email: "",
      contact: "",
    })
  }

  const handleDeleteSpeaker = (id: string) => {
    if (confirm("연사를 삭제하시겠습니까?")) {
      setSpeakers(speakers.filter((speaker) => speaker.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">연사 관리</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">이벤트 연사 정보를 관리합니다</p>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 font-bold">
          <UserPlus className="w-4 h-4 mr-2" />
          연사 추가
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">연사 목록</CardTitle>
          <CardDescription className="text-center">등록된 연사들의 정보를 확인하고 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          {speakers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserPlus className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-center">등록된 연사가 없습니다.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                연사 추가 버튼을 클릭하여 새로운 연사를 등록하세요.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {speakers.map((speaker) => (
                <Card key={speaker.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{speaker.name}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <strong>소속:</strong> {speaker.affiliation}
                          </div>
                          <div>
                            <strong>직급/직책:</strong> {speaker.position}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {speaker.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {speaker.contact}
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          등록일: {speaker.createdAt.toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 hover:scale-105"
                          onClick={() => handleDeleteSpeaker(speaker.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 연사 추가 모달 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>연사 정보 입력</DialogTitle>
            <DialogDescription>새로운 연사의 정보를 입력해주세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
              />
            </div>

            <div>
              <Label htmlFor="affiliation">소속 *</Label>
              <Input
                id="affiliation"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                placeholder="ABC 주식회사"
              />
            </div>

            <div>
              <Label htmlFor="position">직급/직책 *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="대표이사"
              />
            </div>

            <div>
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="hong@example.com"
              />
            </div>

            <div>
              <Label htmlFor="contact">연락처 *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              취소
            </Button>
            <Button onClick={handleAddSpeaker} className="bg-green-600 hover:bg-green-700">
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
