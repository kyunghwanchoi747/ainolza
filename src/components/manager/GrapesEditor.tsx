'use client'

import { useMemo, useCallback, useState, useRef } from 'react'
import grapesjs, { Editor } from 'grapesjs'
import GjsEditor from '@grapesjs/react'
import presetWebpage from 'grapesjs-preset-webpage'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

interface GrapesEditorProps {
  pageId?: string
  initialData?: Record<string, any>
  initialMeta?: { title: string; slug: string; status: string }
}

export default function GrapesEditor({ pageId, initialData, initialMeta }: GrapesEditorProps) {
  const router = useRouter()
  const editorRef = useRef<Editor | null>(null)
  const [title, setTitle] = useState(initialMeta?.title || '')
  const [slug, setSlug] = useState(initialMeta?.slug || '')
  const [status, setStatus] = useState(initialMeta?.status || 'draft')
  const [saving, setSaving] = useState(false)
  const [currentPageId, setCurrentPageId] = useState(pageId)

  const handleSave = useCallback(async () => {
    const editor = editorRef.current
    if (!editor) return

    const saveTitle = title.trim() || '제목 없음'
    const saveSlug = slug.trim() || `page-${Date.now()}`

    setSaving(true)
    try {
      const projectData = editor.getProjectData()
      const html = editor.getHtml()
      const css = editor.getCss()

      const response = await fetch('/api/manager/pages', {
        method: currentPageId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentPageId,
          title: saveTitle,
          slug: saveSlug,
          status,
          projectData,
          html,
          css,
        }),
      })

      if (response.ok) {
        const result: any = await response.json()
        if (!currentPageId && result.id) {
          // New page created - update state and URL
          setCurrentPageId(result.id)
          window.history.replaceState(null, '', `/manager/design/editor/${result.id}`)
        }
        toast.success('저장되었습니다!')
      } else {
        const err: any = await response.json().catch(() => ({}))
        toast.error(`저장 실패: ${err.error || '알 수 없는 오류'}`)
      }
    } catch (_err) {
      toast.error('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }, [title, slug, status, currentPageId])

  const onEditorReady = useCallback((editor: Editor) => {
    editorRef.current = editor

    // Register custom blocks
    const bm = editor.BlockManager

    bm.add('hero-section', {
      label: '히어로 섹션',
      category: '섹션',
      content: `
        <section style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #ffffff; padding: 80px 20px; text-align: center; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1 style="font-size: 48px; margin-bottom: 16px; font-weight: 800;">제목을 입력하세요</h1>
          <p style="font-size: 20px; max-width: 600px; margin-bottom: 32px; opacity: 0.8;">설명 텍스트를 입력하세요</p>
          <a href="#" style="background-color: #e94560; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 18px; display: inline-block;">버튼 텍스트</a>
        </section>
      `,
    })

    bm.add('image-gallery', {
      label: '이미지 갤러리',
      category: '섹션',
      content: `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 40px 20px;">
          <img src="https://placehold.co/400x300/1a1a2e/ffffff?text=Image+1" alt="Gallery 1" style="width:100%; border-radius:8px;" />
          <img src="https://placehold.co/400x300/16213e/ffffff?text=Image+2" alt="Gallery 2" style="width:100%; border-radius:8px;" />
          <img src="https://placehold.co/400x300/0f3460/ffffff?text=Image+3" alt="Gallery 3" style="width:100%; border-radius:8px;" />
        </div>
      `,
    })

    bm.add('feature-cards', {
      label: '피처 카드',
      category: '섹션',
      content: `
        <div style="display:flex; gap:24px; padding:40px 20px; flex-wrap:wrap; justify-content:center;">
          <div style="flex:1; min-width:250px; max-width:350px; padding:32px; background:#f8f9fa; border-radius:12px; text-align:center;">
            <h3 style="margin-bottom:12px; font-size:20px; font-weight:700;">기능 1</h3>
            <p style="color:#666;">기능 설명을 입력하세요.</p>
          </div>
          <div style="flex:1; min-width:250px; max-width:350px; padding:32px; background:#f8f9fa; border-radius:12px; text-align:center;">
            <h3 style="margin-bottom:12px; font-size:20px; font-weight:700;">기능 2</h3>
            <p style="color:#666;">기능 설명을 입력하세요.</p>
          </div>
          <div style="flex:1; min-width:250px; max-width:350px; padding:32px; background:#f8f9fa; border-radius:12px; text-align:center;">
            <h3 style="margin-bottom:12px; font-size:20px; font-weight:700;">기능 3</h3>
            <p style="color:#666;">기능 설명을 입력하세요.</p>
          </div>
        </div>
      `,
    })

    bm.add('text-section', {
      label: '텍스트 섹션',
      category: '기본',
      content: `
        <div style="padding: 40px 20px; max-width: 800px; margin: 0 auto;">
          <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">섹션 제목</h2>
          <p style="font-size: 16px; line-height: 1.8; color: #555;">텍스트 내용을 입력하세요. 여기에 원하는 내용을 자유롭게 작성할 수 있습니다.</p>
        </div>
      `,
    })

    bm.add('cta-banner', {
      label: 'CTA 배너',
      category: '섹션',
      content: `
        <div style="background: #e94560; color: white; padding: 60px 20px; text-align: center; border-radius: 12px; margin: 20px;">
          <h2 style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">지금 시작하세요</h2>
          <p style="font-size: 18px; margin-bottom: 24px; opacity: 0.9;">더 이상 기다리지 마세요.</p>
          <a href="#" style="background: white; color: #e94560; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 700; display: inline-block;">무료 체험</a>
        </div>
      `,
    })

    bm.add('video-embed', {
      label: '비디오',
      category: '미디어',
      content: `
        <div style="padding: 20px; text-align: center;">
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 800px; margin: 0 auto; border-radius: 12px;">
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
          </div>
        </div>
      `,
    })

    bm.add('divider', {
      label: '구분선',
      category: '기본',
      content: `<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 20px;" />`,
    })

    bm.add('spacer', {
      label: '여백',
      category: '기본',
      content: `<div style="height: 60px;"></div>`,
    })

    // Load existing data
    if (initialData) {
      editor.loadProjectData(initialData)
    }
  }, [initialData])

  const gjsOptions = useMemo(() => ({
    height: '100%',
    storageManager: false,
    plugins: [presetWebpage],
    pluginsOpts: {
      [presetWebpage as any]: {},
    },
    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800&display=swap',
      ],
    },
    assetManager: {
      upload: '/api/manager/pages/upload',
      uploadName: 'files',
      autoAdd: true,
    },
  }), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* Metadata bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: '#2d2d3d',
        borderBottom: '1px solid #3d3d4d',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="페이지 제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#1a1a2e',
            color: 'white',
            fontSize: '14px',
            width: '200px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#aaa', fontSize: '13px' }}>/</span>
          <input
            type="text"
            placeholder="slug (예: home)"
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #555',
              background: '#1a1a2e',
              color: 'white',
              fontSize: '14px',
              width: '160px',
            }}
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#1a1a2e',
            color: 'white',
            fontSize: '14px',
          }}
        >
          <option value="draft">임시저장</option>
          <option value="published">게시</option>
        </select>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '6px 20px',
            borderRadius: '4px',
            border: 'none',
            background: saving ? '#888' : '#e94560',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        <button
          onClick={() => router.push('/manager/design')}
          style={{
            padding: '6px 16px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: 'transparent',
            color: '#aaa',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          목록
        </button>
        {slug && (
          <a
            href={slug === 'home' ? '/' : `/p/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#8bc34a', fontSize: '13px', textDecoration: 'none' }}
          >
            미리보기 &rarr;
          </a>
        )}
      </div>

      {/* GrapeJS Editor */}
      <div style={{ flex: 1 }}>
        <GjsEditor
          grapesjs={grapesjs}
          grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
          options={gjsOptions}
          onEditor={onEditorReady}
        />
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
