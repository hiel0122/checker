'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/app/supabaseClient" // ✅ Supabase Client 연결

interface SignUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SignUpDialog({ open, onOpenChange }: SignUpDialogProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    affiliation: "",
    position: "",
    email: "",
    contact: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  })
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  // ✅ 1단계 검증
  const validateStep1 = () => {
    const requiredFields = ["name", "affiliation", "position", "email", "contact"]
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        showAlert("error", "필수 정보를 모두 입력해주세요.")
        return false
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showAlert("error", "유효한 이메일 주소를 입력해주세요.")
      return false
    }
    return true
  }

  // ✅ 2단계 검증
  const validateStep2 = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
    if (!passwordRegex.test(formData.password)) {
      showAlert("error", "비밀번호는 문자, 숫자, 특수기호를 포함해야 합니다.")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      showAlert("error", "비밀번호가 일치하지 않습니다.")
      return false
    }
    return true
  }

  // ✅ 다음 단계
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      handleSignUp()
    }
  }

  // ✅ Supabase 회원가입 처리
  const handleSignUp = async () => {
    setLoading(true)

    try {
      // 1. Supabase Auth 가입
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        showAlert("error", `회원가입 실패: ${error.message}`)
        setLoading(false)
        return
      }

      // 2. users 테이블에 추가 정보 저장
      await supabase.from("users").insert([
        {
          name: formData.name,
          affiliation: formData.affiliation,
          position: formData.position,
          email: formData.email,
          contact: formData.contact,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
        },
      ])

      showAlert("success", "회원가입 성공! 이메일을 확인하세요.")
      setStep(3) // ✅ 인증 안내 단계
    } catch (err) {
      console.error(err)
      showAlert("error", "회원가입 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      name: "",
      affiliation: "",
      position: "",
      email: "",
      contact: "",
      gender: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    })
    setAlert(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) resetForm()
        onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">회원가입</DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 && "회원 정보를 입력해주세요."}
            {step === 2 && "비밀번호를 설정해주세요."}
            {step === 3 && "이메일 인증을 완료해주세요."}
          </DialogDescription>
        </DialogHeader>

        {alert && (
          <Alert className={`mb-4 ${alert.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
            {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="홍길동" />
            </div>
            <div>
              <Label htmlFor="affiliation">소속 *</Label>
              <Input id="affiliation" value={formData.affiliation} onChange={handleInputChange} placeholder="회사명" />
            </div>
            <div>
              <Label htmlFor="position">직급 *</Label>
              <Input id="position" value={formData.position} onChange={handleInputChange} placeholder="팀장" />
            </div>
            <div>
              <Label htmlFor="email">이메일 *</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@abc.com" />
            </div>
            <div>
              <Label htmlFor="contact">연락처 *</Label>
              <Input id="contact" value={formData.contact} onChange={handleInputChange} placeholder="010-1234-5678" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNextStep}>다음</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="password">비밀번호 *</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
              <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>이전</Button>
              <Button onClick={handleNextStep} disabled={loading}>
                {loading ? "처리 중..." : "회원가입"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-4 text-center">
            <p>가입이 완료되었습니다! 이메일을 확인하고 인증을 완료하세요.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}