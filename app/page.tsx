'use client'

import { useState, useEffect } from "react"
import EventSelection from "./components/event-selection"
import EventOverview from "./components/event-overview"
import EventAnalytics from "./components/event-analytics"
import ClosedEvents from "./components/closed-events"
import Sidebar from "./components/sidebar"
import CustomerManagement from "./components/customer-management"
import SpeakerManagement from "./components/speaker-management"
import VipManagement from "./components/vip-management"
import CertificateManagement from "./components/certificate-management"
import EmailManagement from "./components/email-management"
import CsvManagement from "./components/csv-management"
import PresentationManagement from "./components/presentation-management"
import EquipmentManagement from "./components/equipment-management"
import CustomerAnalytics from "./components/customer-analytics"
import DataAnalytics from "./components/data-analytics"
import SignUpDialog from "./components/auth/signup-dialog"
import LoginDialog from "./components/auth/login-dialog"
import InquiryDialog from "./components/inquiry-dialog"
import { supabase } from './supabaseClient'  // ✅ Supabase 추가

// 인터페이스 정의
export interface EventInfo {
  id?: string
  managerName: string
  managerAffiliation: string
  eventDate: string
  startTime: string
  endTime: string
  eventLocation: string
  eventName: string
  isClosed?: boolean
  createdAt?: Date
}

export interface Visitor {
  id?: string
  name: string
  affiliation: string
  position: string
  email: string
  contact: string
  isCheckedIn: boolean
  isOnSite: boolean
  checkedInAt?: Date
  memo?: string
  category?: string
}

export interface UserInfo {
  name: string
  affiliation: string
  position: string
  email: string
  contact: string
  gender?: string
  dateOfBirth?: string
}

type PageType =
  | "eventSelection"
  | "overview"
  | "eventAnalytics"
  | "customerAnalytics"
  | "dataAnalytics"
  | "closedEvents"
  | "customerManagement"
  | "speakerManagement"
  | "vipManagement"
  | "certificateManagement"
  | "emailManagement"
  | "csvManagement"
  | "presentationManagement"
  | "equipmentManagement"
  | "signup"
  | "login"
  | "adminInquiry"
  | "feedback"

export default function AttendanceManagementSystem() {
  // ✅ 기존 상태
  const [currentPage, setCurrentPage] = useState<PageType>("eventSelection")
  const [currentEvent, setCurrentEvent] = useState<EventInfo | null>(null)
  const [events, setEvents] = useState<EventInfo[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAdminInquiryModal, setShowAdminInquiryModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  // ✅ Supabase 상태
  const [users, setUsers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // ✅ Supabase 데이터 불러오기
  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
      console.error('Error fetching users:', error)
    } else {
      setUsers(data || [])
    }
  }

  async function addUser() {
    if (!name || !email) {
      alert('이름과 이메일을 입력하세요!')
      return
    }
    const { error } = await supabase.from('users').insert([{ name, email }])
    if (error) {
      console.error('추가 실패:', error)
    } else {
      alert('사용자가 추가되었습니다!')
      setName('')
      setEmail('')
      fetchUsers()
    }
  }

  // ✅ 기존 로직 유지 (이벤트 관리 등)
  // localStorage 관리 useEffect는 그대로 두세요 (생략)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "eventSelection":
        return (
          <EventSelection
            events={events}
            setEvents={setEvents}
            onEventSelect={(event) => setCurrentEvent(event)}
            setVisitors={setVisitors}
          />
        )
      case "overview":
        return currentEvent ? (
          <EventOverview
            event={currentEvent}
            visitors={visitors}
            setVisitors={setVisitors}
            onEventUpdate={(updatedEvent) => setCurrentEvent(updatedEvent)}
          />
        ) : null
      case "eventAnalytics":
        return <EventAnalytics events={events} allVisitors={visitors} currentEvent={currentEvent} />
      case "customerAnalytics":
        return <CustomerAnalytics />
      case "dataAnalytics":
        return <DataAnalytics />
      case "closedEvents":
        return <ClosedEvents events={events.filter((e) => e.isClosed)} onEventSelect={setCurrentEvent} />
      case "customerManagement":
        return <CustomerManagement />
      case "speakerManagement":
        return <SpeakerManagement />
      case "vipManagement":
        return <VipManagement />
      case "certificateManagement":
        return <CertificateManagement />
      case "emailManagement":
        return <EmailManagement />
      case "csvManagement":
        return <CsvManagement />
      case "presentationManagement":
        return <PresentationManagement />
      case "equipmentManagement":
        return <EquipmentManagement />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage as (page: string) => void}
        currentEvent={currentEvent}
        events={events}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLoginModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        onLogout={() => alert("로그아웃 구현 필요")}
        onAdminInquiryClick={() => setShowAdminInquiryModal(true)}
        onFeedbackClick={() => setShowFeedbackModal(true)}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto mt-4">
          {renderCurrentPage()}

          {/* ✅ Supabase 테스트 UI */}
          <div style={{ marginTop: 40, padding: 20, backgroundColor: '#fff', borderRadius: 8 }}>
            <h2>✅ Supabase Users</h2>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginRight: 10 }}
              />
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginRight: 10 }}
              />
              <button onClick={addUser}>추가</button>
            </div>
            {users.length === 0 ? (
              <p>등록된 사용자가 없습니다.</p>
            ) : (
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SignUpDialog open={showSignUpModal} onOpenChange={setShowSignUpModal} />
      <LoginDialog open={showLoginModal} onOpenChange={setShowLoginModal} onLoginSuccess={() => {}} />
      <InquiryDialog open={showAdminInquiryModal} onOpenChange={setShowAdminInquiryModal} type="admin" />
      <InquiryDialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal} type="feedback" />
    </div>
  )
}