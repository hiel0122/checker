"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, FileText, Award } from "lucide-react"

export default function EmailManagement() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">메일 발송</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">고객에게 메일을 발송합니다</p>
      </div>

      <Tabs defaultValue="preRegistration" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="preRegistration">사전예약 안내</TabsTrigger>
          <TabsTrigger value="presentationRequest">발표자료 요청</TabsTrigger>
          <TabsTrigger value="certificateSend">참가확인증 발송</TabsTrigger>
        </TabsList>

        <TabsContent value="preRegistration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                사전예약 안내 메일
              </CardTitle>
              <CardDescription>이벤트 사전예약 안내 메일을 발송합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pre-subject">메일 제목</Label>
                  <Input
                    id="pre-subject"
                    placeholder="[ABC 주식회사] 2024 기술 컨퍼런스 사전예약 안내"
                    defaultValue="[ABC 주식회사] 2024 기술 컨퍼런스 사전예약 안내"
                  />
                </div>
                <div>
                  <Label htmlFor="pre-sender">발송자</Label>
                  <Input id="pre-sender" placeholder="이학인 <hakein@abc.com>" defaultValue="이학인 <hakein@abc.com>" />
                </div>
              </div>

              <div>
                <Label htmlFor="pre-content">메일 내용</Label>
                <Textarea
                  id="pre-content"
                  rows={10}
                  placeholder="메일 내용을 입력하세요..."
                  defaultValue={`안녕하세요.

ABC 주식회사에서 주최하는 2024 기술 컨퍼런스에 대한 사전예약 안내를 드립니다.

■ 행사 개요
- 일시: 2024년 6월 8일(토) 오후 2시 ~ 6시
- 장소: ABC 컨벤션센터 대강당
- 주제: 미래 기술 트렌드와 혁신

■ 사전예약 방법
아래 링크를 통해 사전예약을 진행해주시기 바랍니다.
예약 링크: https://abc.com/register

■ 문의사항
이메일: hakein@abc.com
전화: 02-1234-5678

감사합니다.

ABC 주식회사 사업기획팀
이학인`}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">미리보기</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  발송
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presentationRequest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                발표자료 요청 메일
              </CardTitle>
              <CardDescription>연사에게 발표자료를 요청하는 메일을 발송합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pres-subject">메일 제목</Label>
                  <Input
                    id="pres-subject"
                    placeholder="[ABC 주식회사] 발표자료 제출 요청"
                    defaultValue="[ABC 주식회사] 발표자료 제출 요청"
                  />
                </div>
                <div>
                  <Label htmlFor="pres-sender">발송자</Label>
                  <Input
                    id="pres-sender"
                    placeholder="이학인 <hakein@abc.com>"
                    defaultValue="이학인 <hakein@abc.com>"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pres-content">메일 내용</Label>
                <Textarea
                  id="pres-content"
                  rows={10}
                  placeholder="메일 내용을 입력하세요..."
                  defaultValue={`안녕하세요.

2024 기술 컨퍼런스 연사로 참여해주셔서 감사합니다.

발표자료 제출과 관련하여 안내드립니다.

■ 제출 기한: 2024년 6월 1일(토) 오후 6시까지
■ 제출 방법: 이메일 첨부 또는 클라우드 링크 공유
■ 파일 형식: PPT, PDF (권장)
■ 발표 시간: 30분 (질의응답 10분 포함)

■ 발표자료 가이드라인
- 슬라이드 수: 20~30장 권장
- 폰트 크기: 최소 24pt 이상
- 회사 로고 및 연락처 포함

발표자료 제출 시 아래 정보도 함께 보내주시기 바랍니다.
- 연사 프로필 (약력, 사진)
- 발표 요약문 (200자 내외)

문의사항이 있으시면 언제든 연락주시기 바랍니다.

감사합니다.

ABC 주식회사 사업기획팀
이학인`}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">미리보기</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  발송
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificateSend">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                참가확인증 발송
              </CardTitle>
              <CardDescription className="text-center">참가확인증 발송 상태를 관리하고 모니터링하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">발송 대기</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">0</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">발송 완료</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">0</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">발송 실패</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cert-subject">메일 제목</Label>
                  <Input
                    id="cert-subject"
                    placeholder="[ABC 주식회사] 참가확인증 발송"
                    defaultValue="[ABC 주식회사] 참가확인증 발송"
                  />
                </div>
                <div>
                  <Label htmlFor="cert-sender">발송자</Label>
                  <Input
                    id="cert-sender"
                    placeholder="이학인 <hakein@abc.com>"
                    defaultValue="이학인 <hakein@abc.com>"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cert-content">메일 내용</Label>
                <Textarea
                  id="cert-content"
                  rows={8}
                  placeholder="메일 내용을 입력하세요..."
                  defaultValue={`안녕하세요.

2024 기술 컨퍼런스에 참석해주셔서 감사합니다.

첨부된 파일은 귀하의 참가확인증입니다.
필요시 출력하여 사용하시기 바랍니다.

추후 저희가 주최하는 행사에도 많은 관심과 참여 부탁드립니다.

감사합니다.

ABC 주식회사 사업기획팀
이학인`}
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline">미리보기</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  일괄 발송
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center py-8">
                <Award className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center">아직 발송 내역이 없습니다.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  참가자 목록을 업로드하고 확인증을 발송하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
