'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  Globe,
  ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface NavItem {
  label: string
  path: string
  type: string
  customPageSlug?: string
  enabled: boolean
  order: number
}

interface Settings {
  id?: string
  siteName?: string
  homePath?: string
  navigation?: NavItem[]
}

const SECTION_TYPES = [
  { value: 'home', label: '홈페이지', internal: '/' },
  { value: 'store', label: '상품 목록', internal: '/store' },
  { value: 'community', label: '게시판', internal: '/community' },
  { value: 'programs', label: '프로그램 목록', internal: '/programs' },
  { value: 'custom', label: '커스텀 페이지', internal: '/p/{slug}' },
]

const DEFAULT_NAV: NavItem[] = [
  { label: '홈', path: '/home', type: 'home', enabled: true, order: 0 },
  { label: '스토어', path: '/store', type: 'store', enabled: true, order: 1 },
  { label: '커뮤니티', path: '/community', type: 'community', enabled: true, order: 2 },
  { label: '프로그램', path: '/programs', type: 'programs', enabled: true, order: 3 },
]

export function SettingsClient({ initialSettings }: { initialSettings: Settings | null }) {
  const [siteName, setSiteName] = useState(initialSettings?.siteName || 'AI 놀자')
  const [navigation, setNavigation] = useState<NavItem[]>(
    initialSettings?.navigation?.length ? initialSettings.navigation : DEFAULT_NAV,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const homePath = navigation.find((n) => n.type === 'home')?.path || '/home'

  const updateNav = (index: number, field: keyof NavItem, value: any) => {
    setNavigation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const addNavItem = () => {
    setNavigation((prev) => [
      ...prev,
      {
        label: '새 메뉴',
        path: '/new',
        type: 'custom',
        customPageSlug: '',
        enabled: true,
        order: prev.length,
      },
    ])
  }

  const removeNavItem = (index: number) => {
    setNavigation((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    // Validate paths
    for (const nav of navigation) {
      if (!nav.path.startsWith('/')) {
        toast.error(`"${nav.label}" 경로는 /로 시작해야 합니다`)
        return
      }
      if (nav.type === 'custom' && !nav.customPageSlug) {
        toast.error(`"${nav.label}" 커스텀 페이지의 슬러그를 입력해주세요`)
        return
      }
    }

    // Check for duplicate paths
    const paths = navigation.map((n) => n.path)
    const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i)
    if (duplicates.length > 0) {
      toast.error(`중복된 경로가 있습니다: ${duplicates.join(', ')}`)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/manager/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          homePath,
          navigation: navigation.map((n, i) => ({ ...n, order: i })),
        }),
      })

      if (res.ok) {
        toast.success('설정이 저장되었습니다')
      } else {
        const data: any = await res.json()
        toast.error(data.error || '저장 실패')
      }
    } catch {
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInternalRoute = (nav: NavItem) => {
    if (nav.type === 'custom') return `/p/${nav.customPageSlug || '...'}`
    const section = SECTION_TYPES.find((s) => s.value === nav.type)
    return section?.internal || '?'
  }

  const getSubRouteExample = (nav: NavItem) => {
    if (nav.type === 'store') return `${nav.path}/상품슬러그`
    if (nav.type === 'community') return `${nav.path}/123`
    if (nav.type === 'programs') return `${nav.path}/프로그램슬러그`
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">사이트 설정</h1>
        <p className="text-muted-foreground mt-1">
          사이트 이름과 URL 경로를 설정합니다. 저장 후 즉시 반영됩니다.
        </p>
      </div>

      {/* Site Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">사이트 이름</label>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="사이트 이름"
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation & URL Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">네비게이션 & URL 설정</CardTitle>
            <Button variant="outline" size="sm" onClick={addNavItem}>
              <Plus className="h-4 w-4 mr-1" />
              메뉴 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_140px_80px_40px] gap-2 text-xs font-medium text-muted-foreground px-1">
              <span>메뉴 이름</span>
              <span>URL 경로</span>
              <span>연결 섹션</span>
              <span>활성화</span>
              <span></span>
            </div>

            <Separator />

            {navigation.map((nav, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_140px_80px_40px] gap-2 items-center"
              >
                <div className="flex items-center gap-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={nav.label}
                    onChange={(e) => updateNav(index, 'label', e.target.value)}
                    placeholder="메뉴 이름"
                    className="h-8 text-sm"
                  />
                </div>
                <Input
                  value={nav.path}
                  onChange={(e) => updateNav(index, 'path', e.target.value)}
                  placeholder="/path"
                  className="h-8 text-sm font-mono"
                />
                <select
                  value={nav.type}
                  onChange={(e) => updateNav(index, 'type', e.target.value)}
                  className="h-8 text-sm rounded-md border border-input bg-background px-2"
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={nav.enabled}
                    onChange={(e) => updateNav(index, 'enabled', e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeNavItem(index)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}

            {/* Custom page slug input for custom items */}
            {navigation.some((n) => n.type === 'custom') && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    커스텀 페이지 슬러그 설정
                  </p>
                  {navigation.map(
                    (nav, index) =>
                      nav.type === 'custom' && (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline" className="shrink-0">
                            {nav.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">→ 페이지 슬러그:</span>
                          <Input
                            value={nav.customPageSlug || ''}
                            onChange={(e) =>
                              updateNav(index, 'customPageSlug', e.target.value)
                            }
                            placeholder="about, contact 등"
                            className="h-7 text-sm max-w-[200px]"
                          />
                        </div>
                      ),
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* URL Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-4 w-4" />
            URL 미리보기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-foreground">/</span>
              <ArrowRight className="h-3 w-3" />
              <span>→ {homePath} 으로 이동</span>
            </div>
            {navigation
              .filter((n) => n.enabled)
              .map((nav, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{nav.path}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{getInternalRoute(nav)}</span>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {nav.label}
                    </Badge>
                  </div>
                  {getSubRouteExample(nav) && (
                    <div className="flex items-center gap-2 ml-4 text-muted-foreground text-xs mt-0.5">
                      <span>{getSubRouteExample(nav)}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>하위 페이지 자동 매핑</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  )
}
