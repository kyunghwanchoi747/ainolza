'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Student = {
  id: number
  email: string
  name?: string
  orderCount: number
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetch('/api/manager/students', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = (await res.json()) as { students?: Student[] }
          setStudents(data.students || [])
        }
      } catch {
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [])

  const filteredStudents = students.filter((s) => {
    const emailMatch = s.email.toLowerCase().includes(searchEmail.toLowerCase())
    const nameMatch = (s.name || '').toLowerCase().includes(searchName.toLowerCase())
    return emailMatch && nameMatch
  })

  const withOrders = filteredStudents.filter((s) => s.orderCount > 0)
  const withoutOrders = filteredStudents.filter((s) => s.orderCount === 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">수강생 관리</h1>
        <p className="text-muted-foreground mt-1">
          전체 {students.length}명 · 결제 {withOrders.length}명 · 미결제 {withoutOrders.length}명
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>검색</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">이메일</label>
              <Input
                placeholder="이메일 검색..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">이름</label>
              <Input
                placeholder="이름 검색..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">로딩 중...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {withOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>결제 수강생 ({withOrders.length}명)</CardTitle>
                <CardDescription>
                  최소 1건 이상의 유료 주문이 있는 수강생
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2 font-medium">ID</th>
                        <th className="pb-2 font-medium">이메일</th>
                        <th className="pb-2 font-medium">이름</th>
                        <th className="pb-2 font-medium text-right">주문건수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withOrders.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 text-muted-foreground">{s.id}</td>
                          <td className="py-2">{s.email}</td>
                          <td className="py-2">{s.name || '-'}</td>
                          <td className="py-2 text-right">
                            <Badge variant="secondary">{s.orderCount}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {withoutOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>미결제 수강생 ({withoutOrders.length}명)</CardTitle>
                <CardDescription>가입은 했으나 구매 이력이 없는 수강생</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2 font-medium">ID</th>
                        <th className="pb-2 font-medium">이메일</th>
                        <th className="pb-2 font-medium">이름</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withoutOrders.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 text-muted-foreground">{s.id}</td>
                          <td className="py-2">{s.email}</td>
                          <td className="py-2">{s.name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
