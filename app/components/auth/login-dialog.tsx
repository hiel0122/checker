"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/app/supabaseClient"; // ✅ Supabase 연결

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (user: any, isAdmin: boolean) => void;
}

export default function LoginDialog({
  open,
  onOpenChange,
  onLoginSuccess,
}: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_PASSWORD = "dlqkdn4591!@";

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        showAlert("error", "로그인 실패: " + error.message);
        return;
      }
  
      if (data.session) {
        const user = data.session.user;
        const isAdmin = user.email === "admin@admin.kr";
  
        onLoginSuccess(
          {
            name: user.user_metadata?.name || "사용자",
            email: user.email,
          },
          isAdmin
        );
  
        showAlert("success", "로그인 성공!");
        
        // ✅ 모달 닫기 추가
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "알 수 없는 오류가 발생했습니다.");
    }
  };

      // ✅ 일반 사용자 로그인 (Supabase)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showAlert("error", "이메일 또는 비밀번호가 잘못되었습니다.");
        return;
      }

      if (data.user) {
        const userInfo = {
          id: data.user.id,
          email: data.user.email,
        };
        // ✅ 로컬 스토리지에 세션 저장
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
        localStorage.setItem("isAdmin", "false");
        showAlert("success", "로그인 성공!");
        setTimeout(() => {
          onLoginSuccess(userInfo, false);
          resetForm();
        }, 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("error", "로그인 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setAlert(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) resetForm();
        onOpenChange(o);
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
            className={`mb-4 ${
              alert.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소 또는 관리자 ID"
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
          <Button onClick={handleLogin} className="w-full">
            로그인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}