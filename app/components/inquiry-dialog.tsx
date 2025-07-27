"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { UserInfo } from "../page"

interface InquiryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "admin" | "feedback"
  currentUser: UserInfo | null
}

export default function InquiryDialog({ open, onOpenChange, type, currentUser }: InquiryDialogProps) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    affiliation: currentUser?.affiliation || "",
    position: currentUser?.position || "",
    email: currentUser?.email || "",
    content: "",
  })
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        affiliation: currentUser.affiliation,
        position: currentUser.position,
        email: currentUser.email,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        affiliation: "",
        position: "",
        email: "",
      }))
    }
  }, [currentUser, open]) // Reset when currentUser changes or dialog opens

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.content) {
      showAlert("error", "이름, 이메일, 내용을 모두 입력해주세요.")
      return
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showAlert("error", "유효한 이메일 주소를 입력해주세요.")
      return
    }

    // Simulate sending inquiry
    console.log(`[SIMULATED INQUIRY] Type: ${type === "admin" ? "Admin Inquiry" : "Feedback"}`)
    console.log("From:", formData)
    console.log("Content:", formData.content)

    showAlert("success", `${type === "admin" ? "문의" : "피드백"}가 성공적으로 접수되었습니다.`)
    setFormData((prev) => ({ ...prev, content: "" })) // Clear content after submission
    if (currentUser) {
      // If logged in, keep user info, just clear content
      setFormData({
        name: currentUser.name,
        affiliation: currentUser.affiliation,
        position: currentUser.position,
        email: currentUser.email,
        content: "",
      })
    } else {
      // If not logged in, clear all fields
      setFormData({
        name: "",
        affiliation: "",
        position: "",
        email: "",
        content: "",
      })
    }
    setTimeout(() => onOpenChange(false), 1500) // Close dialog after a short delay
  }

  const dialogTitle = type === "admin" ? "관리자 문의" : "Feedback"
  const dialogDescription =
    type === "admin" ? "관리자에게 문의사항을 보냅니다." : "서비스 개선을 위한 소중한 의견을 남겨주세요."
  const submitButtonText = type === "admin" ? "문의하기" : "피드백 보내기"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-center">{dialogDescription}</DialogDescription>
        </DialogHeader>

        {alert && (
          <Alert
            className={`mb-4 ${alert.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}
          >
            {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          {type === "admin" && (
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center">답변은 등록된 메일로 발송됩니다.</p>
          )}
          <div>
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름"
              required
              disabled={!!currentUser}
            />
          </div>
          <div>
            <Label htmlFor="affiliation">소속</Label>
            <Input
              id="affiliation"
              value={formData.affiliation}
              onChange={handleInputChange}
              placeholder="소속"
              disabled={!!currentUser}
            />
          </div>
          <div>
            <Label htmlFor="position">직급</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="직급"
              disabled={!!currentUser}
            />
          </div>
          <div>
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일"
              required
              disabled={!!currentUser}
            />
          </div>
          <div>
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="내용을 입력하세요..."
              rows={6}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            {submitButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
