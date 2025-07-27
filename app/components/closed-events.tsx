"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Archive } from "lucide-react"
import type { EventInfo } from "../page"

interface ClosedEventsProps {
  events: EventInfo[]
  onEventSelect: (event: EventInfo) => void
}

export default function ClosedEvents({ events, onEventSelect }: ClosedEventsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">마감된 이벤트</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">마감 처리된 이벤트들을 확인할 수 있습니다</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center font-bold">마감 이벤트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Archive className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">마감된 이벤트가 없습니다.</p>
              </div>
            ) : (
              events.map((event, index) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => onEventSelect(event)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{event.eventName}</h3>
                          <Badge
                            variant="secondary"
                            className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                          >
                            마감
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.eventDate}
                          </div>
                          {event.eventLocation && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.eventLocation}
                            </div>
                          )}
                          {(event.startTime || event.endTime) && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.startTime && event.endTime
                                ? `${event.startTime} - ${event.endTime}`
                                : event.startTime || event.endTime}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          담당자: {event.managerName}
                          {event.managerAffiliation && ` (${event.managerAffiliation})`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
