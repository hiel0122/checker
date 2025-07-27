"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Calendar, Users } from "lucide-react"
import type { EventInfo, Visitor } from "../page"

interface AnalyticsProps {
  events: EventInfo[]
  allVisitors: Visitor[]
  currentEvent: EventInfo | null
}

export default function Analytics({ events, allVisitors, currentEvent }: AnalyticsProps) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [animationTrigger, setAnimationTrigger] = useState(0)

  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  // 페이지 진입 시 애니메이션 트리거
  useEffect(() => {
    setAnimationTrigger((prev) => prev + 1)
  }, [])

  // 월별 필터 변경 시 애니메이션 트리거
  const handleMonthFilter = (month: number | null) => {
    setSelectedMonth(month)
    setAnimationTrigger((prev) => prev + 1)
  }

  const analytics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]

    const getEventStatus = (event: EventInfo) => {
      if (event.isClosed) return "completed"
      if (event.eventDate === today) return "inProgress"
      if (event.eventDate > today) return "upcoming"
      return "completed"
    }

    const monthlyData = months.map((_, index) => {
      const month = index + 1
      const monthEvents = events
        .filter((event) => {
          const eventMonth = Number.parseInt(event.eventDate.split("-")[1], 10)
          return selectedMonth ? eventMonth === selectedMonth : true
        })
        .filter((event) => {
          const eventMonth = Number.parseInt(event.eventDate.split("-")[1], 10)
          return eventMonth === month
        })

      const statusCounts = {
        upcoming: monthEvents.filter((e) => getEventStatus(e) === "upcoming").length,
        inProgress: monthEvents.filter((e) => getEventStatus(e) === "inProgress").length,
        completed: monthEvents.filter((e) => getEventStatus(e) === "completed").length,
      }

      return {
        month: month,
        monthName: months[index],
        total: monthEvents.length,
        ...statusCounts,
      }
    })

    const totalStats = {
      totalEvents: events.length,
      upcomingEvents: events.filter((e) => getEventStatus(e) === "upcoming").length,
      inProgressEvents: events.filter((e) => getEventStatus(e) === "inProgress").length,
      completedEvents: events.filter((e) => getEventStatus(e) === "completed").length,
    }

    // 방문자 통계 (현재 이벤트 기준)
    const visitorStats = {
      totalVisitors: allVisitors.length,
      preRegistered: allVisitors.filter((v) => !v.isOnSite).length,
      checkedIn: allVisitors.filter((v) => v.isCheckedIn && !v.isOnSite).length,
      onSiteRegistered: allVisitors.filter((v) => v.isOnSite).length,
    }

    return { monthlyData, totalStats, visitorStats }
  }, [events, selectedMonth, allVisitors])

  const maxEvents = Math.max(...analytics.monthlyData.map((d) => d.total), 1) * 1.2 // 여백을 위해 1.2배
  const maxVisitors =
    Math.max(
      analytics.visitorStats.totalVisitors,
      analytics.visitorStats.checkedIn,
      analytics.visitorStats.onSiteRegistered,
      1,
    ) * 1.2 // 여백을 위해 1.2배

  const filteredEvents = selectedMonth
    ? events.filter((event) => {
        const eventMonth = Number.parseInt(event.eventDate.split("-")[1], 10)
        return eventMonth === selectedMonth
      })
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 text-center">분석 대시보드</h1>
        <p className="text-gray-600 mt-2 text-center">이벤트 현황과 통계를 확인하세요</p>
      </div>

      {/* 월별 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">월별 필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedMonth === null ? "default" : "outline"}
              onClick={() => handleMonthFilter(null)}
              size="sm"
            >
              전체
            </Button>
            {months.map((month, index) => (
              <Button
                key={month}
                variant={selectedMonth === index + 1 ? "default" : "outline"}
                onClick={() => handleMonthFilter(index + 1)}
                size="sm"
              >
                {month}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 이벤트</p>
                <p
                  className="text-2xl font-bold text-gray-900 transition-all duration-1000 ease-out transform"
                  key={`total-${animationTrigger}`}
                  style={{
                    animation: `countUp 1s ease-out`,
                    animationFillMode: "both",
                  }}
                >
                  {analytics.totalStats.totalEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">예정</p>
                <p
                  className="text-2xl font-bold text-gray-900 transition-all duration-1000 ease-out transform"
                  key={`upcoming-${animationTrigger}`}
                  style={{
                    animation: `countUp 1s ease-out 0.2s`,
                    animationFillMode: "both",
                  }}
                >
                  {analytics.totalStats.upcomingEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">진행중</p>
                <p
                  className="text-2xl font-bold text-gray-900 transition-all duration-1000 ease-out transform"
                  key={`progress-${animationTrigger}`}
                  style={{
                    animation: `countUp 1s ease-out 0.4s`,
                    animationFillMode: "both",
                  }}
                >
                  {analytics.totalStats.inProgressEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">완료</p>
                <p
                  className="text-2xl font-bold text-gray-900 transition-all duration-1000 ease-out transform"
                  key={`completed-${animationTrigger}`}
                  style={{
                    animation: `countUp 1s ease-out 0.6s`,
                    animationFillMode: "both",
                  }}
                >
                  {analytics.totalStats.completedEvents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 월별 차트 - 전체 선택 시에만 표시 */}
      {selectedMonth === null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-bold">월별 이벤트 현황</CardTitle>
            <CardDescription className="text-center">전체 월별 이벤트 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-around h-64 bg-gray-50 rounded-lg p-4">
              {analytics.monthlyData.map((data, index) => {
                const height = (data.total / maxEvents) * 200
                return (
                  <div key={data.month} className="flex flex-col items-center">
                    <div className="flex flex-col-reverse items-center mb-2">
                      {data.completed > 0 && (
                        <div
                          className="w-8 bg-red-500 rounded-t transition-all duration-1000 ease-out"
                          style={{
                            height: `${(data.completed / data.total) * height}px`,
                            animationDelay: `${index * 100 + 800}ms`,
                            transform: `scaleY(0)`,
                            transformOrigin: "bottom",
                            animation: `slideUp 1s ease-out ${index * 100 + 800}ms forwards`,
                          }}
                          title={`완료: ${data.completed}`}
                          key={`completed-${data.month}-${animationTrigger}`}
                        />
                      )}
                      {data.inProgress > 0 && (
                        <div
                          className="w-8 bg-green-500 transition-all duration-1000 ease-out"
                          style={{
                            height: `${(data.inProgress / data.total) * height}px`,
                            animationDelay: `${index * 100 + 800}ms`,
                            transform: `scaleY(0)`,
                            transformOrigin: "bottom",
                            animation: `slideUp 1s ease-out ${index * 100 + 800}ms forwards`,
                          }}
                          title={`진행중: ${data.inProgress}`}
                          key={`progress-${data.month}-${animationTrigger}`}
                        />
                      )}
                      {data.upcoming > 0 && (
                        <div
                          className="w-8 bg-yellow-500 rounded-b transition-all duration-1000 ease-out"
                          style={{
                            height: `${(data.upcoming / data.total) * height}px`,
                            animationDelay: `${index * 100 + 800}ms`,
                            transform: `scaleY(0)`,
                            transformOrigin: "bottom",
                            animation: `slideUp 1s ease-out ${index * 100 + 800}ms forwards`,
                          }}
                          title={`예정: ${data.upcoming}`}
                          key={`upcoming-${data.month}-${animationTrigger}`}
                        />
                      )}
                      {data.total === 0 && <div className="w-8 h-2 bg-gray-300 rounded" />}
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      <div>{data.monthName}</div>
                      <div className="font-semibold">{data.total}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
                <span className="text-sm text-gray-600">예정</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                <span className="text-sm text-gray-600">진행중</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2" />
                <span className="text-sm text-gray-600">완료</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 방문자 집계 */}
      {currentEvent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-bold">방문자 집계</CardTitle>
            <CardDescription className="text-center">
              {selectedMonth ? `${months[selectedMonth - 1]} 방문자 현황` : "현재 선택된 이벤트의 방문자 현황"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-around h-64 bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-blue-500 rounded-lg mb-2 transition-all duration-1500 ease-out"
                  style={{
                    height: `${(analytics.visitorStats.totalVisitors / maxVisitors) * 200}px`,
                    animationDelay: "1200ms",
                    transform: `scaleY(0)`,
                    transformOrigin: "bottom",
                    animation: `slideUp 1.5s ease-out 1200ms forwards`,
                  }}
                  key={`total-visitors-${animationTrigger}`}
                />
                <div className="text-xs text-gray-600 text-center">
                  <div>전체 사전예약</div>
                  <div className="font-semibold">{analytics.visitorStats.totalVisitors}</div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-green-500 rounded-lg mb-2 transition-all duration-1500 ease-out"
                  style={{
                    height: `${(analytics.visitorStats.checkedIn / maxVisitors) * 200}px`,
                    animationDelay: "1400ms",
                    transform: `scaleY(0)`,
                    transformOrigin: "bottom",
                    animation: `slideUp 1.5s ease-out 1400ms forwards`,
                  }}
                  key={`checked-in-${animationTrigger}`}
                />
                <div className="text-xs text-gray-600 text-center">
                  <div>참석완료</div>
                  <div className="font-semibold">{analytics.visitorStats.checkedIn}</div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-yellow-500 rounded-lg mb-2 transition-all duration-1500 ease-out"
                  style={{
                    height: `${(analytics.visitorStats.onSiteRegistered / maxVisitors) * 200}px`,
                    animationDelay: "1600ms",
                    transform: `scaleY(0)`,
                    transformOrigin: "bottom",
                    animation: `slideUp 1.5s ease-out 1600ms forwards`,
                  }}
                  key={`onsite-${animationTrigger}`}
                />
                <div className="text-xs text-gray-600 text-center">
                  <div>현장등록</div>
                  <div className="font-semibold">{analytics.visitorStats.onSiteRegistered}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                <span className="text-sm text-gray-600">전체 사전예약</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                <span className="text-sm text-gray-600">참석완료</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
                <span className="text-sm text-gray-600">현장등록</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 선택된 월의 이벤트 목록 */}
      {selectedMonth && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center font-bold">{months[selectedMonth - 1]} 이벤트 목록</CardTitle>
            <CardDescription className="text-center">{filteredEvents.length}개의 이벤트</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">해당 월에 이벤트가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event) => {
                  const today = new Date().toISOString().split("T")[0]
                  let status = "completed"
                  let statusColor = "bg-red-500"
                  let statusLabel = "완료"

                  if (event.isClosed) {
                    status = "completed"
                    statusColor = "bg-red-500"
                    statusLabel = "마감"
                  } else if (event.eventDate === today) {
                    status = "inProgress"
                    statusColor = "bg-green-500"
                    statusLabel = "진행중"
                  } else if (event.eventDate > today) {
                    status = "upcoming"
                    statusColor = "bg-yellow-500"
                    statusLabel = "예정"
                  }

                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                        <div>
                          <h3 className="font-semibold">{event.eventName}</h3>
                          <p className="text-sm text-gray-600">{event.eventDate}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{statusLabel}</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes countUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}
