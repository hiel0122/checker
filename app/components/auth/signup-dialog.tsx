"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/app/supabaseClient";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignUpDialog({ open, onOpenChange }: SignUpDialogProps) {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } },
      });

      if (error) {
        showAlert("error", error.message);
        return;
      }

      showAlert("success", "회원가입 성공! 이메일을 확인하세요.");
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 1500);
    } catch (err) {
      console.error(err);
      showAlert("error", "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "" });
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
          <DialogTitle className="text-center">회원가입</DialogTitle>
          <DialogDescription className="text-center">이메일, 비밀번호, 이름을 입력하세요.</DialogDescription>
        </DialogHeader>

        {alert && (
          <Alert className={`mb-4 ${alert.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
            {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@abc.com" />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="비밀번호 입력" />
          </div>
          <div>
            <Label htmlFor="name">이름</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="홍길동" />
          </div>
          <Button onClick={handleSignUp} className="w-full" disabled={loading}>
            {loading ? "처리 중..." : "회원가입"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}