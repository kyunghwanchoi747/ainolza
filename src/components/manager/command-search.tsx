'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Palette,
  Plus,
  ExternalLink,
  Settings,
  ShoppingBag,
  MessageSquare,
  Download,
} from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

interface DesignPage {
  id: string
  title: string
  slug: string
  status: string
}

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const router = useRouter()
  const [pages, setPages] = useState<DesignPage[]>([])

  useEffect(() => {
    if (open) {
      fetch('/api/manager/pages')
        .then(res => res.json())
        .then((data: any) => setPages(data.docs || []))
        .catch(() => {})
    }
  }, [open])

  const runCommand = useCallback((command: () => void) => {
    onOpenChange(false)
    command()
  }, [onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="페이지, 메뉴, 기능을 검색하세요..." />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>

        <CommandGroup heading="빠른 이동">
          <CommandItem onSelect={() => runCommand(() => router.push('/manager'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            대시보드
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/design'))}>
            <FileText className="mr-2 h-4 w-4" />
            페이지 관리
            <CommandShortcut>G P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/design/editor/new'))}>
            <Plus className="mr-2 h-4 w-4" />
            새 페이지 만들기
            <CommandShortcut>G E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/products'))}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            상품 관리
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/posts'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            게시판 관리
            <CommandShortcut>G B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/programs'))}>
            <Download className="mr-2 h-4 w-4" />
            프로그램 관리
            <CommandShortcut>G R</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="새로 만들기">
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/products/new'))}>
            <Plus className="mr-2 h-4 w-4" />
            새 상품 등록
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/posts/new'))}>
            <Plus className="mr-2 h-4 w-4" />
            새 게시글 작성
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/manager/programs/new'))}>
            <Plus className="mr-2 h-4 w-4" />
            새 프로그램 등록
          </CommandItem>
        </CommandGroup>

        {pages.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="페이지">
              {pages.map(page => (
                <CommandItem
                  key={page.id}
                  onSelect={() => runCommand(() => router.push(`/manager/design/editor/${page.id}`))}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  <span>{page.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">/{page.slug}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="링크">
          <CommandItem onSelect={() => runCommand(() => window.open('/', '_blank'))}>
            <ExternalLink className="mr-2 h-4 w-4" />
            사이트 보기
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open('/admin', '_blank'))}>
            <Settings className="mr-2 h-4 w-4" />
            Payload 관리 패널
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
