"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import LoginDialog from "./components/auth/login-dialog";
import SignUpDialog from "./components/auth/signup-dialog";

export interface UserInfo {
  name: string;
  email: string;
  affiliation?: string;
  position?: string;
  contact?: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setCurrentUser({
          name: session.user.user_metadata?.name || "사용자",
          email: session.user.email!,
        });
        setIsAdmin(session.user.email === "hiel@admin.com");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Supabase Auth Demo</h1>
      {isLoggedIn ? (
        <>
          <p className="mt-2">안녕하세요, {currentUser?.name}님!</p>
          {isAdmin && <p className="text-red-500 font-bold">관리자 권한</p>}
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">
            로그아웃
          </button>
        </>
      ) : (
        <div className="mt-4 space-x-4">
          <button onClick={() => setShowLogin(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
            로그인
          </button>
          <button onClick={() => setShowSignUp(true)} className="px-4 py-2 bg-green-500 text-white rounded">
            회원가입
          </button>
        </div>
      )}

      <LoginDialog open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={handleLoginSuccess} />
      <SignUpDialog open={showSignUp} onOpenChange={setShowSignUp} />
    </div>
  );
}