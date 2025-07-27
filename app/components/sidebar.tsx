"use client"

import { Button } from "@/components/ui/button"
import {
  Calendar,
  BarChart3,
  Home,
  ChevronRight,
  Archive,
  Sun,
  Moon,
  Users,
  UserPlus,
  Star,
  FileCheck,
  Mail,
  Database,
  FileSpreadsheet,
  Presentation,
  Package,
  User,
  LogOut,
  LogIn,
  UserRoundPlus,
} from "lucide-react"
import { useTheme } from "next-themes"
import type { EventInfo, UserInfo } from "../page"

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  currentEvent: EventInfo | null
  events: EventInfo[]
  isLoggedIn: boolean
  currentUser: UserInfo | null
  isAdmin: boolean
  onLoginClick: () => void
  onSignUpClick: () => void
  onLogout: () => void
  onAdminInquiryClick: () => void
  onFeedbackClick: () => void
}

export default function Sidebar({
  currentPage,
  setCurrentPage,
  currentEvent,
  events,
  isLoggedIn,
  currentUser,
  isAdmin,
  onLoginClick,
  onSignUpClick,
  onLogout,
  onAdminInquiryClick,
  onFeedbackClick,
}: SidebarProps) {
  const closedEventsCount = events.filter((e) => e.isClosed).length
  const { theme, setTheme } = useTheme()

  // Submenus are always open, no need for useState
  const customerMenuOpen = true
  const dataMenuOpen = true
  const analyticsMenuOpen = true // New: Analytics submenu always open

  const menuItems = [
    {
      id: "eventSelection",
      label: "이벤트 관리", // Changed label
      icon: Calendar,
      description: "이벤트 선택 및 생성",
      hasSubmenu: true,
    },
    {
      id: "customerManagement",
      label: "고객 관리",
      icon: Users,
      description: "고객 정보 및 연사 관리",
      hasSubmenu: true,
    },
    {
      id: "dataManagement",
      label: "데이터 관리",
      icon: Database,
      description: "CSV, 발표자료, 비품 관리",
      hasSubmenu: true,
    },
    {
      id: "analytics", // Moved to bottom
      label: "분석 대시보드",
      icon: BarChart3,
      description: "이벤트 및 고객 데이터 분석",
      hasSubmenu: true,
    },
  ]

  const customerSubMenuItems = [
    {
      id: "speakerManagement",
      label: "연사 관리",
      icon: UserPlus,
    },
    {
      id: "customerManagement",
      label: "고객 관리",
      icon: Users,
    },
    {
      id: "vipManagement",
      label: "VIP 관리",
      icon: Star,
    },
    {
      id: "certificateManagement",
      label: "참가확인증 발송",
      icon: FileCheck,
    },
    {
      id: "emailManagement",
      label: "메일 발송",
      icon: Mail,
    },
  ]

  const dataSubMenuItems = [
    {
      id: "csvManagement",
      label: "CSV 관리",
      icon: FileSpreadsheet,
    },
    {
      id: "presentationManagement",
      label: "발표자료 관리",
      icon: Presentation,
    },
    {
      id: "equipmentManagement",
      label: "이벤트 비품 관리",
      icon: Package,
    },
  ]

  const analyticsSubMenuItems = [
    {
      id: "eventAnalytics",
      label: "Event Analytics",
      icon: Calendar,
    },
    {
      id: "customerAnalytics",
      label: "Customer Analytics",
      icon: Users,
    },
    {
      id: "dataAnalytics",
      label: "Data Analytics",
      icon: Database,
    },
  ]

  const handleUserInfo = () => {
    alert("회원정보 페이지로 이동합니다.")
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-r dark:border-gray-800 flex flex-col min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6 flex-1 overflow-y-auto">
        {/* 헤더와 사용자 버튼들 */}
        <div className="mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">hiel's Checker</h2>
          <div className="flex items-center space-x-2 mt-2">
            {isLoggedIn ? (
              <>
                <Button
                  onClick={handleUserInfo}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                >
                  <User className="w-3 h-3 mr-1" />
                  회원정보
                </Button>
                <Button
                  onClick={onLogout}
                  size="sm"
                  variant="outline"
                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 px-2 py-1 text-xs"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Log-out
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onLoginClick}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs"
                >
                  <LogIn className="w-3 h-3 mr-1" />
                  로그인
                </Button>
                <Button
                  onClick={onSignUpClick}
                  size="sm"
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300 px-2 py-1 text-xs"
                >
                  <UserRoundPlus className="w-3 h-3 mr-1" />
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 로그인 정보 섹션 */}
        {isLoggedIn && currentUser && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">
              {currentUser.name}님, 환영합니다!
            </h3>
            <p className="text-blue-700 dark:text-blue-400 text-xs">{currentUser.email}</p>
            <p className="text-blue-700 dark:text-blue-400 text-xs">
              {currentUser.affiliation} / {currentUser.position}
            </p>
          </div>
        )}

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            const isEventSelection = item.id === "eventSelection"
            const isCustomerMenu = item.id === "customerManagement"
            const isDataMenu = item.id === "dataManagement"
            const isAnalyticsMenu = item.id === "analytics" // New: Analytics menu item

            return (
              <div key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        (isEventSelection && currentEvent) ||
                        (isCustomerMenu && customerMenuOpen) ||
                        (isDataMenu && dataMenuOpen) ||
                        (isAnalyticsMenu && analyticsMenuOpen)
                          ? "rotate-90"
                          : ""
                      }`}
                    />
                  )}
                </Button>

                {/* 이벤트 관리 하위 메뉴 */}
                {isEventSelection && (
                  <div className="ml-6 mt-1 space-y-1">
                    {currentEvent && (
                      <Button
                        variant={currentPage === "overview" ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => setCurrentPage("overview")}
                      >
                        <Home className="w-3 h-3 mr-2" />
                        Overview
                      </Button>
                    )}
                    <Button
                      variant={currentPage === "closedEvents" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => setCurrentPage("closedEvents")}
                    >
                      <Archive className="w-3 h-3 mr-2" />
                      <span>마감 이벤트</span>
                      {closedEventsCount > 0 && (
                        <span className="ml-auto bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                          {closedEventsCount}
                        </span>
                      )}
                    </Button>
                  </div>
                )}

                {/* 고객 관리 하위 메뉴 (항상 노출) */}
                {isCustomerMenu && customerMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {customerSubMenuItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = currentPage === subItem.id

                      return (
                        <Button
                          key={subItem.id}
                          variant={isSubActive ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => setCurrentPage(subItem.id)}
                        >
                          <SubIcon className="w-3 h-3 mr-2" />
                          {subItem.label}
                        </Button>
                      )
                    })}
                  </div>
                )}

                {/* 데이터 관리 하위 메뉴 (항상 노출) */}
                {isDataMenu && dataMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {dataSubMenuItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = currentPage === subItem.id

                      return (
                        <Button
                          key={subItem.id}
                          variant={isSubActive ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => setCurrentPage(subItem.id)}
                        >
                          <SubIcon className="w-3 h-3 mr-2" />
                          {subItem.label}
                        </Button>
                      )
                    })}
                  </div>
                )}

                {/* 분석 대시보드 하위 메뉴 (항상 노출) */}
                {isAnalyticsMenu && analyticsMenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {analyticsSubMenuItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = currentPage === subItem.id

                      return (
                        <Button
                          key={subItem.id}
                          variant={isSubActive ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm"
                          onClick={() => setCurrentPage(subItem.id)}
                        >
                          <SubIcon className="w-3 h-3 mr-2" />
                          {subItem.label}
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* 테마 토글 버튼 및 푸터 */}
      <div className="p-4 border-t dark:border-gray-800">
        <Button
          variant="outline"
          size="icon" // Changed to icon size
          className="justify-center w-10 h-10 bg-transparent" // Fixed size for icon button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <p>hiel made</p>
          <div className="flex justify-between mt-1">
            <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={onAdminInquiryClick}>
              관리자 문의
            </Button>
            <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={onFeedbackClick}>
              Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
