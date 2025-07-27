'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { UserInfo } from "../../page"
import { supabase } from "@/app/supabaseClient" // ✅ Supabase 연결 추가

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: (user: UserInfo, isAdmin: boolean) => void
}

export default function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  // ✅ 로그인 처리
  const handleLogin = async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        showAlert("error", "이메일 또는 비밀번호가 올바르지 않습니다.")
        setLoading(false)
        return
      }

      // ✅ 로그인 성공 → 사용자 정보 가져오기
      const user = data.user

      // ✅ 관리자 여부 확인 (email 기준 or Role 컬럼 기준)
      const isAdmin = user?.email === "hiel@example.com"

      // ✅ 추가 사용자 정보 가져오기 (users 테이블)
      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      const userInfo: UserInfo = {
        name: profileData?.name || "사용자",
        affiliation: profileData?.affiliation || "",
        position: profileData?.position || "",
        email: user?.email || email,
        contact: profileData?.contact || "",
      }

      showAlert("success", "로그인 성공!")
      onLoginSuccess(userInfo, isAdmin)
      resetForm()
      setTimeout(() => onOpenChange(false), 1000)
    } catch (err) {
      console.error(err)
      showAlert("error", "로그인 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">로그인</DialogTitle>
          <DialogDescription className="text-center">
            이메일과 비밀번호를 입력하여 로그인하세요.
          </DialogDescription>
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
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </div>
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}