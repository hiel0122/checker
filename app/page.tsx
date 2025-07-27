"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginDialog from "./components/auth/login-dialog";
import SignUpDialog from "./components/auth/signup-dialog";
import { Button } from "@/components/ui/button";

export interface UserInfo {
  name: string;
  email: string;
  role?: string; // admin or user
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // ✅ 세션 유지 (Supabase Auth & 로컬스토리지)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        const email = data.session.user.email || "";
        setIsLoggedIn(true);
        setCurrentUser({
          name: data.session.user.user_metadata?.name || "사용자",
          email: email,
        });
        setIsAdmin(email === "admin@admin.com"); // 관리자 확인
      } else {
        // 로컬스토리지에서 확인 (관리자 로그인 시)
        const localLogin = localStorage.getItem("isLoggedIn");
        const localUser = localStorage.getItem("currentUser");
        const localAdmin = localStorage.getItem("isAdmin");

        if (localLogin && localUser) {
          setIsLoggedIn(true);
          setCurrentUser(JSON.parse(localUser));
          setIsAdmin(localAdmin === "true");
        }
      }
    };

    checkSession();

    // ✅ Supabase Auth 상태 변경 감지
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const email = session.user.email || "";
        setIsLoggedIn(true);
        setCurrentUser({
          name: session.user.user_metadata?.name || "사용자",
          email: email,
        });
        setIsAdmin(email === "admin@admin.com");
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ 로그아웃 기능
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const handleLoginSuccess = (user: UserInfo, admin: boolean) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setIsAdmin(admin);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">✔ Supabase Auth Demo</h1>

      {isLoggedIn ? (
        <div className="text-center">
          <p className="text-lg mb-2">안녕하세요, {currentUser?.name}님!</p>
          <p className="text-gray-600 mb-4">{currentUser?.email}</p>

          {isAdmin && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 font-bold">
              관리자 권한이 활성화되었습니다.
            </div>
          )}

          <Button
            onClick={handleLogout}
            className="bg-gray-800 text-white hover:bg-gray-700"
          >
            로그아웃
          </Button>
        </div>
      ) : (
        <div className="space-x-4">
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            로그인
          </Button>
          <Button
            onClick={() => setShowSignUp(true)}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            회원가입
          </Button>
        </div>
      )}

      {/* ✅ 모달 다이얼로그 */}
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignUpDialog open={showSignUp} onOpenChange={setShowSignUp} />
    </div>
  );
}