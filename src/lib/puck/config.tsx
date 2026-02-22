'use client'

import type { Config } from '@puckeditor/core'
import { DropZone } from '@puckeditor/core'
import React from 'react'

// ─── Type Definitions ───────────────────────────────────────────────────────

type HeroProps = {
  badge: string
  headline: string
  subheadline: string
  cta1Label: string
  cta1Href: string
  cta2Label: string
  cta2Href: string
  headlineSize: string
  headlineColor: string
  subheadlineColor: string
  cta1BgColor: string
  cta1TextColor: string
  cta1BtnSize: 'sm' | 'md' | 'lg'
}

type FeatureItem = { title: string; description: string; color: string }
type FeaturesProps = {
  title: string
  items: FeatureItem[]
  dark: 'dark' | 'light'
  titleColor: string
}

type TextSectionProps = {
  title: string
  body: string
  align: 'left' | 'center' | 'right'
  dark: 'dark' | 'light'
  titleSize: string
  titleColor: string
  bodyColor: string
}

type CTABannerProps = {
  headline: string
  subheadline: string
  buttonLabel: string
  buttonHref: string
  gradient: string
  buttonBgColor: string
  buttonTextColor: string
  buttonSize: 'sm' | 'md' | 'lg'
}

type ImageSectionProps = {
  src: string
  alt: string
  caption: string
  contained: boolean
}

type SpacerProps = { size: 'sm' | 'md' | 'lg' | 'xl'; dark: 'dark' | 'light' }

// ── 신규 원자 컴포넌트 타입 ──────────────────────────────────────────────────

type HeadingProps = {
  text: string
  level: 'h1' | 'h2' | 'h3' | 'h4'
  size: string
  color: string
  align: 'left' | 'center' | 'right'
  dark: 'dark' | 'light'
  paddingY: 'none' | 'sm' | 'md' | 'lg'
}

type RichTextProps = {
  text: string
  size: string
  color: string
  align: 'left' | 'center' | 'right'
  dark: 'dark' | 'light'
  lineHeight: string
  paddingY: 'none' | 'sm' | 'md' | 'lg'
}

type StandaloneButtonProps = {
  label: string
  href: string
  bgColor: string
  textColor: string
  size: 'sm' | 'md' | 'lg'
  align: 'left' | 'center' | 'right'
  dark: 'dark' | 'light'
  rounded: 'md' | 'lg' | 'full'
  paddingY: 'none' | 'sm' | 'md' | 'lg'
}

type StandaloneImageProps = {
  src: string
  alt: string
  caption: string
  width: 'full' | 'large' | 'medium' | 'small'
  align: 'left' | 'center' | 'right'
  rounded: boolean
  dark: 'dark' | 'light'
}

type DividerProps = {
  color: string
  thickness: number
  marginY: 'sm' | 'md' | 'lg'
  dark: 'dark' | 'light'
}

type ColorBlockProps = {
  bgColor: string
  paddingY: 'sm' | 'md' | 'lg' | 'xl'
  maxWidth: 'full' | 'container' | 'narrow'
}

type TwoColumnProps = {
  distribution: '50-50' | '60-40' | '40-60' | '67-33' | '33-67'
  gap: 'sm' | 'md' | 'lg'
  dark: 'dark' | 'light'
  paddingY: 'none' | 'sm' | 'md' | 'lg'
  align: 'start' | 'center' | 'end'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const colorField = (label: string) => ({
  type: 'custom' as const,
  label,
  render: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 44, height: 28, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', padding: 2, background: 'none' }}
      />
      <span style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{value || '#ffffff'}</span>
    </div>
  ),
})

const btnPadding: Record<string, string> = { sm: '10px 24px', md: '16px 36px', lg: '20px 48px' }
const btnFontSize: Record<string, number> = { sm: 14, md: 18, lg: 22 }
const paddingYMap: Record<string, string> = { none: '0', sm: '16px 24px', md: '40px 24px', lg: '80px 24px' }
const marginYMap: Record<string, string> = { sm: '16px', md: '40px', lg: '80px' }
const colDist: Record<string, string> = {
  '50-50': '1fr 1fr',
  '60-40': '3fr 2fr',
  '40-60': '2fr 3fr',
  '67-33': '2fr 1fr',
  '33-67': '1fr 2fr',
}
const imgWidthMap: Record<string, string> = { full: '100%', large: '80%', medium: '60%', small: '40%' }

// ─── Puck Config ─────────────────────────────────────────────────────────────

export const puckConfig: Config = {
  categories: {
    섹션: { title: '섹션', components: ['Hero', 'Features', 'CTABanner'] },
    콘텐츠: { title: '콘텐츠', components: ['TextSection', 'ImageSection'] },
    '텍스트·버튼': { title: '텍스트·버튼', components: ['Heading', 'RichText', 'StandaloneButton'] },
    '이미지·구분': { title: '이미지·구분', components: ['StandaloneImage', 'Divider'] },
    레이아웃: { title: '레이아웃', components: ['TwoColumn', 'ColorBlock', 'Spacer'] },
  },

  components: {
    // ── Hero ──────────────────────────────────────────────────────────────
    Hero: {
      label: '히어로 섹션',
      fields: {
        badge: { type: 'text', label: '상단 배지 텍스트' },
        headline: { type: 'textarea', label: '메인 헤드라인' },
        headlineSize: {
          type: 'select', label: '헤드라인 크기',
          options: [
            { label: '매우 크게 (88px)', value: 'clamp(48px,7vw,88px)' },
            { label: '크게 (64px)', value: 'clamp(36px,5vw,64px)' },
            { label: '보통 (48px)', value: 'clamp(28px,4vw,48px)' },
            { label: '작게 (36px)', value: 'clamp(22px,3vw,36px)' },
          ],
        },
        headlineColor: colorField('헤드라인 색상'),
        subheadline: { type: 'textarea', label: '서브 헤드라인' },
        subheadlineColor: colorField('서브 헤드라인 색상'),
        cta1Label: { type: 'text', label: '주 버튼 텍스트' },
        cta1Href: { type: 'text', label: '주 버튼 링크' },
        cta1BgColor: colorField('주 버튼 배경색'),
        cta1TextColor: colorField('주 버튼 글씨색'),
        cta1BtnSize: {
          type: 'radio', label: '주 버튼 크기',
          options: [{ label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }],
        },
        cta2Label: { type: 'text', label: '보조 버튼 텍스트' },
        cta2Href: { type: 'text', label: '보조 버튼 링크' },
      },
      defaultProps: {
        badge: 'AI와 함께하는 스마트한 성장',
        headline: 'AI 놀자에서\n미래를 앞서가세요',
        headlineSize: 'clamp(48px,7vw,88px)',
        headlineColor: '#ffffff',
        subheadline: '비전공자와 3060 세대를 위한 가장 쉬운 AI 실무 커뮤니티.',
        subheadlineColor: '#9ca3af',
        cta1Label: '무료 강의 시작하기',
        cta1Href: '/courses',
        cta1BgColor: '#2563eb',
        cta1TextColor: '#ffffff',
        cta1BtnSize: 'md',
        cta2Label: '커뮤니티 둘러보기',
        cta2Href: '/community',
      },
      render: ({ badge, headline, headlineSize, headlineColor, subheadline, subheadlineColor, cta1Label, cta1Href, cta1BgColor, cta1TextColor, cta1BtnSize, cta2Label, cta2Href }: any) => (
        <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '80px 24px', background: '#000' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(37,99,235,0.12), transparent)', zIndex: 0 }} />
          <div style={{ position: 'absolute', left: '50%', top: '40%', width: 480, height: 480, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'rgba(59,130,246,0.18)', filter: 'blur(100px)', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            {badge && <span style={{ display: 'inline-block', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', padding: '4px 16px', fontSize: 14, color: '#60a5fa', marginBottom: 24 }}>{badge}</span>}
            <h1 style={{ fontSize: headlineSize || 'clamp(48px,7vw,88px)', fontWeight: 900, color: headlineColor || '#fff', lineHeight: 1.1, margin: 0, whiteSpace: 'pre-line' }}>{headline}</h1>
            <p style={{ marginTop: 28, fontSize: 20, color: subheadlineColor || '#9ca3af', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>{subheadline}</p>
            <div style={{ marginTop: 44, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
              {cta1Label && <a href={cta1Href || '#'} style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 9999, background: cta1BgColor || '#2563eb', padding: btnPadding[cta1BtnSize] || btnPadding.md, fontSize: btnFontSize[cta1BtnSize] || 18, fontWeight: 700, color: cta1TextColor || '#fff', textDecoration: 'none' }}>{cta1Label}</a>}
              {cta2Label && <a href={cta2Href || '#'} style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', padding: btnPadding[cta1BtnSize] || btnPadding.md, fontSize: btnFontSize[cta1BtnSize] || 18, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>{cta2Label}</a>}
            </div>
          </div>
        </section>
      ),
    },

    // ── Features ──────────────────────────────────────────────────────────
    Features: {
      label: '기능 그리드',
      fields: {
        title: { type: 'text', label: '섹션 제목 (선택)' },
        titleColor: colorField('제목 색상'),
        dark: { type: 'radio', label: '배경 테마', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
        items: {
          type: 'array', label: '기능 항목',
          arrayFields: {
            title: { type: 'text', label: '제목' },
            description: { type: 'textarea', label: '설명' },
            color: {
              type: 'select', label: '포인트 색상',
              options: [
                { label: '파란색', value: '#2563eb' }, { label: '보라색', value: '#7c3aed' },
                { label: '초록색', value: '#16a34a' }, { label: '주황색', value: '#ea580c' },
                { label: '분홍색', value: '#db2777' }, { label: '빨간색', value: '#dc2626' },
                { label: '하늘색', value: '#0ea5e9' }, { label: '노란색', value: '#ca8a04' },
              ],
            },
          },
        },
      },
      defaultProps: {
        title: '', titleColor: '#ffffff', dark: 'dark',
        items: [
          { title: '실무 중심 강의', description: '현업에서 바로 쓰이는 실전 AI 활용법을 배웁니다.', color: '#2563eb' },
          { title: '열린 커뮤니티', description: '서로 돕고 성장하는 따뜻한 AI 소통 공간입니다.', color: '#7c3aed' },
          { title: '검증된 리소스', description: '엄선된 AI 도구와 자료를 큐레이션하여 제공합니다.', color: '#16a34a' },
        ],
      },
      render: ({ title, titleColor, dark, items }: any) => {
        const isDark = dark !== 'light'
        return (
          <section style={{ background: isDark ? '#000' : '#f9fafb', padding: '80px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              {title && <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: titleColor || (isDark ? '#fff' : '#111'), textAlign: 'center', marginBottom: 48, marginTop: 0 }}>{title}</h2>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
                {(items || []).map((item: any, i: number) => (
                  <div key={i} style={{ borderRadius: 28, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', padding: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                      <div style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.85)', borderRadius: 6 }} />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: isDark ? '#fff' : '#111', margin: 0 }}>{item.title}</h3>
                    <p style={{ marginTop: 10, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.65, fontSize: 15 }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    // ── TextSection ───────────────────────────────────────────────────────
    TextSection: {
      label: '텍스트 섹션',
      fields: {
        title: { type: 'text', label: '제목' },
        titleSize: {
          type: 'select', label: '제목 크기',
          options: [
            { label: '매우 크게 (48px)', value: 'clamp(28px,4vw,48px)' },
            { label: '크게 (36px)', value: 'clamp(22px,3vw,36px)' },
            { label: '보통 (28px)', value: 'clamp(18px,2.5vw,28px)' },
            { label: '작게 (22px)', value: '22px' },
          ],
        },
        titleColor: colorField('제목 색상'),
        body: { type: 'textarea', label: '본문' },
        bodyColor: colorField('본문 색상'),
        align: { type: 'radio', label: '텍스트 정렬', options: [{ label: '왼쪽', value: 'left' }, { label: '가운데', value: 'center' }, { label: '오른쪽', value: 'right' }] },
        dark: { type: 'radio', label: '배경 테마', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
      },
      defaultProps: { title: '섹션 제목', titleSize: 'clamp(28px,4vw,48px)', titleColor: '#ffffff', body: '본문 내용을 입력하세요.', bodyColor: '#9ca3af', align: 'center', dark: 'dark' },
      render: ({ title, titleSize, titleColor, body, bodyColor, align, dark }: any) => {
        const isDark = dark !== 'light'
        return (
          <section style={{ background: isDark ? '#000' : '#fff', padding: '80px 24px', textAlign: align }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {title && <h2 style={{ fontSize: titleSize || 'clamp(28px,4vw,48px)', fontWeight: 900, color: titleColor || (isDark ? '#fff' : '#111'), margin: 0 }}>{title}</h2>}
              {body && <p style={{ fontSize: 18, color: bodyColor || (isDark ? '#9ca3af' : '#6b7280'), lineHeight: 1.8, marginTop: 16 }}>{body}</p>}
            </div>
          </section>
        )
      },
    },

    // ── CTABanner ─────────────────────────────────────────────────────────
    CTABanner: {
      label: 'CTA 배너',
      fields: {
        headline: { type: 'text', label: '헤드라인' },
        subheadline: { type: 'text', label: '서브 헤드라인' },
        buttonLabel: { type: 'text', label: '버튼 텍스트' },
        buttonHref: { type: 'text', label: '버튼 링크' },
        buttonBgColor: colorField('버튼 배경색'),
        buttonTextColor: colorField('버튼 글씨색'),
        buttonSize: { type: 'radio', label: '버튼 크기', options: [{ label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
        gradient: {
          type: 'select', label: '배너 그라데이션',
          options: [
            { label: '파란-보라', value: 'linear-gradient(135deg,#2563eb,#7c3aed)' },
            { label: '초록-파랑', value: 'linear-gradient(135deg,#059669,#2563eb)' },
            { label: '주황-빨강', value: 'linear-gradient(135deg,#ea580c,#dc2626)' },
            { label: '분홍-보라', value: 'linear-gradient(135deg,#db2777,#7c3aed)' },
            { label: '진한 파랑', value: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
            { label: '하늘-초록', value: 'linear-gradient(135deg,#0ea5e9,#059669)' },
          ],
        },
      },
      defaultProps: { headline: '지금 바로 AI 전문가로 거듭나세요', subheadline: '망설이는 매 순간 기술은 앞서나갑니다.', buttonLabel: '회원가입하고 혜택 받기', buttonHref: '/login', buttonBgColor: '#ffffff', buttonTextColor: '#2563eb', buttonSize: 'md', gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)' },
      render: ({ headline, subheadline, buttonLabel, buttonHref, buttonBgColor, buttonTextColor, buttonSize, gradient }: any) => (
        <section style={{ padding: '60px 24px', background: '#000' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 48, background: gradient, padding: '64px 40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', margin: 0 }}>{headline}</h2>
            <p style={{ marginTop: 20, fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{subheadline}</p>
            {buttonLabel && (
              <a href={buttonHref || '#'} style={{ marginTop: 36, display: 'inline-block', borderRadius: 9999, background: buttonBgColor || '#fff', padding: btnPadding[buttonSize] || btnPadding.md, fontSize: btnFontSize[buttonSize] || 18, fontWeight: 900, color: buttonTextColor || '#2563eb', textDecoration: 'none' }}>
                {buttonLabel}
              </a>
            )}
          </div>
        </section>
      ),
    },

    // ── ImageSection ──────────────────────────────────────────────────────
    ImageSection: {
      label: '이미지 섹션',
      fields: {
        src: { type: 'text', label: '이미지 URL' },
        alt: { type: 'text', label: '대체 텍스트' },
        caption: { type: 'text', label: '캡션 (선택)' },
        contained: { type: 'radio', label: '너비', options: [{ label: '전체 폭', value: false as any }, { label: '컨테이너', value: true as any }] },
      },
      defaultProps: { src: '', alt: '이미지', caption: '', contained: false },
      render: ({ src, alt, caption, contained }: any) => (
        <section style={{ background: '#000', padding: contained ? '40px 24px' : '0' }}>
          <div style={{ maxWidth: contained ? 960 : '100%', margin: '0 auto' }}>
            {src
              ? <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: contained ? 24 : 0 }} /> // eslint-disable-line @next/next/no-img-element
              : <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: contained ? 24 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 14 }}>이미지 URL을 입력하세요</div>
            }
            {caption && <p style={{ marginTop: 12, textAlign: 'center', color: '#6b7280', fontSize: 14, padding: '0 24px' }}>{caption}</p>}
          </div>
        </section>
      ),
    },

    // ── Spacer ────────────────────────────────────────────────────────────
    Spacer: {
      label: '여백',
      fields: {
        size: { type: 'select', label: '높이', options: [{ label: '작게 (32px)', value: 'sm' }, { label: '보통 (64px)', value: 'md' }, { label: '크게 (96px)', value: 'lg' }, { label: '매우 크게 (128px)', value: 'xl' }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
      },
      defaultProps: { size: 'md', dark: 'dark' },
      render: ({ size, dark }: any) => {
        const heights: Record<string, number> = { sm: 32, md: 64, lg: 96, xl: 128 }
        return <div style={{ height: heights[size] ?? 64, background: dark === 'dark' ? '#000' : '#fff' }} />
      },
    },

    // ════════════════════════════════════════════════════════════════════════
    // ── 신규: 원자 컴포넌트 ───────────────────────────────────────────────
    // ════════════════════════════════════════════════════════════════════════

    // ── Heading (독립 제목) ────────────────────────────────────────────────
    Heading: {
      label: '제목 텍스트',
      fields: {
        text: { type: 'textarea', label: '제목 내용' },
        level: { type: 'select', label: '제목 태그', options: [{ label: 'H1 (가장 큼)', value: 'h1' }, { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' }, { label: 'H4 (가장 작음)', value: 'h4' }] },
        size: {
          type: 'select', label: '글씨 크기',
          options: [
            { label: '매우 크게 (72px)', value: '72px' },
            { label: '크게 (56px)', value: '56px' },
            { label: '보통 (40px)', value: '40px' },
            { label: '작게 (28px)', value: '28px' },
            { label: '매우 작게 (20px)', value: '20px' },
          ],
        },
        color: colorField('글씨 색상'),
        align: { type: 'radio', label: '정렬', options: [{ label: '왼쪽', value: 'left' }, { label: '가운데', value: 'center' }, { label: '오른쪽', value: 'right' }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
        paddingY: { type: 'select', label: '상하 여백', options: [{ label: '없음', value: 'none' }, { label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
      },
      defaultProps: { text: '제목을 입력하세요', level: 'h2', size: '40px', color: '#ffffff', align: 'left', dark: 'dark', paddingY: 'sm' },
      render: ({ text, level: Tag, size, color, align, dark, paddingY }: any) => (
        <div style={{ background: dark === 'dark' ? '#000' : '#fff', padding: paddingYMap[paddingY] || '16px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Tag style={{ fontSize: size, fontWeight: 900, color: color || (dark === 'dark' ? '#fff' : '#111'), textAlign: align, margin: 0, whiteSpace: 'pre-line', lineHeight: 1.2 }}>
              {text}
            </Tag>
          </div>
        </div>
      ),
    },

    // ── RichText (독립 본문 텍스트) ───────────────────────────────────────
    RichText: {
      label: '본문 텍스트',
      fields: {
        text: { type: 'textarea', label: '내용' },
        size: {
          type: 'select', label: '글씨 크기',
          options: [
            { label: '크게 (24px)', value: '24px' },
            { label: '보통 (18px)', value: '18px' },
            { label: '작게 (15px)', value: '15px' },
            { label: '매우 작게 (13px)', value: '13px' },
          ],
        },
        color: colorField('글씨 색상'),
        align: { type: 'radio', label: '정렬', options: [{ label: '왼쪽', value: 'left' }, { label: '가운데', value: 'center' }, { label: '오른쪽', value: 'right' }] },
        lineHeight: { type: 'select', label: '줄 간격', options: [{ label: '좁게 (1.4)', value: '1.4' }, { label: '보통 (1.7)', value: '1.7' }, { label: '넓게 (2.0)', value: '2.0' }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
        paddingY: { type: 'select', label: '상하 여백', options: [{ label: '없음', value: 'none' }, { label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
      },
      defaultProps: { text: '본문 내용을 입력하세요.', size: '18px', color: '#9ca3af', align: 'left', lineHeight: '1.7', dark: 'dark', paddingY: 'sm' },
      render: ({ text, size, color, align, lineHeight, dark, paddingY }: any) => (
        <div style={{ background: dark === 'dark' ? '#000' : '#fff', padding: paddingYMap[paddingY] || '16px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ fontSize: size, color: color || '#9ca3af', textAlign: align, lineHeight: lineHeight || 1.7, margin: 0, whiteSpace: 'pre-line' }}>
              {text}
            </p>
          </div>
        </div>
      ),
    },

    // ── StandaloneButton (독립 버튼) ──────────────────────────────────────
    StandaloneButton: {
      label: '버튼',
      fields: {
        label: { type: 'text', label: '버튼 텍스트' },
        href: { type: 'text', label: '링크 URL' },
        bgColor: colorField('배경색'),
        textColor: colorField('글씨색'),
        size: { type: 'radio', label: '버튼 크기', options: [{ label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
        rounded: { type: 'select', label: '모서리 형태', options: [{ label: '약간 둥글게', value: 'md' }, { label: '많이 둥글게', value: 'lg' }, { label: '완전 둥글게', value: 'full' }] },
        align: { type: 'radio', label: '버튼 위치', options: [{ label: '왼쪽', value: 'left' }, { label: '가운데', value: 'center' }, { label: '오른쪽', value: 'right' }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
        paddingY: { type: 'select', label: '상하 여백', options: [{ label: '없음', value: 'none' }, { label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
      },
      defaultProps: { label: '버튼', href: '#', bgColor: '#2563eb', textColor: '#ffffff', size: 'md', rounded: 'full', align: 'center', dark: 'dark', paddingY: 'sm' },
      render: ({ label, href, bgColor, textColor, size, rounded, align, dark, paddingY }: any) => {
        const borderRadius: Record<string, string> = { md: '8px', lg: '16px', full: '9999px' }
        return (
          <div style={{ background: dark === 'dark' ? '#000' : '#fff', padding: paddingYMap[paddingY] || '16px 24px', textAlign: align }}>
            <a
              href={href || '#'}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius[rounded] || '9999px', background: bgColor || '#2563eb', padding: btnPadding[size] || btnPadding.md, fontSize: btnFontSize[size] || 18, fontWeight: 700, color: textColor || '#fff', textDecoration: 'none', cursor: 'pointer' }}
            >
              {label}
            </a>
          </div>
        )
      },
    },

    // ── StandaloneImage (독립 이미지) ──────────────────────────────────────
    StandaloneImage: {
      label: '이미지',
      fields: {
        src: { type: 'text', label: '이미지 URL' },
        alt: { type: 'text', label: '대체 텍스트' },
        caption: { type: 'text', label: '캡션 (선택)' },
        width: { type: 'select', label: '이미지 너비', options: [{ label: '전체 (100%)', value: 'full' }, { label: '크게 (80%)', value: 'large' }, { label: '보통 (60%)', value: 'medium' }, { label: '작게 (40%)', value: 'small' }] },
        align: { type: 'radio', label: '정렬', options: [{ label: '왼쪽', value: 'left' }, { label: '가운데', value: 'center' }, { label: '오른쪽', value: 'right' }] },
        rounded: { type: 'radio', label: '모서리', options: [{ label: '직각', value: false as any }, { label: '둥글게', value: true as any }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
      },
      defaultProps: { src: '', alt: '이미지', caption: '', width: 'full', align: 'center', rounded: false, dark: 'dark' },
      render: ({ src, alt, caption, width, align, rounded, dark }: any) => {
        const flexAlign: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }
        return (
          <div style={{ background: dark === 'dark' ? '#000' : '#fff', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: flexAlign[align] || 'center' }}>
              <div style={{ width: imgWidthMap[width] || '100%' }}>
                {src
                  ? <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: rounded ? 20 : 0 }} /> // eslint-disable-line @next/next/no-img-element
                  : <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: rounded ? 20 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 14 }}>이미지 URL을 입력하세요</div>
                }
                {caption && <p style={{ marginTop: 8, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>{caption}</p>}
              </div>
            </div>
          </div>
        )
      },
    },

    // ── Divider (구분선) ──────────────────────────────────────────────────
    Divider: {
      label: '구분선',
      fields: {
        color: colorField('선 색상'),
        thickness: { type: 'select', label: '선 두께', options: [{ label: '얇게 (1px)', value: 1 as any }, { label: '보통 (2px)', value: 2 as any }, { label: '두껍게 (4px)', value: 4 as any }] },
        marginY: { type: 'select', label: '상하 여백', options: [{ label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
      },
      defaultProps: { color: 'rgba(255,255,255,0.12)', thickness: 1, marginY: 'md', dark: 'dark' },
      render: ({ color, thickness, marginY, dark }: any) => (
        <div style={{ background: dark === 'dark' ? '#000' : '#fff', padding: `0 24px` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <hr style={{ border: 'none', borderTop: `${thickness}px solid ${color || 'rgba(255,255,255,0.12)'}`, margin: `${marginYMap[marginY] || '40px'} 0` }} />
          </div>
        </div>
      ),
    },

    // ── ColorBlock (배경색 구역 + 자유 배치) ──────────────────────────────
    ColorBlock: {
      label: '색상 구역',
      fields: {
        bgColor: colorField('배경색'),
        paddingY: { type: 'select', label: '상하 여백', options: [{ label: '작게 (16px)', value: 'sm' }, { label: '보통 (40px)', value: 'md' }, { label: '크게 (80px)', value: 'lg' }, { label: '매우 크게 (120px)', value: 'xl' }] },
        maxWidth: { type: 'select', label: '내용 최대 너비', options: [{ label: '전체 폭', value: 'full' }, { label: '컨테이너 (1200px)', value: 'container' }, { label: '좁게 (800px)', value: 'narrow' }] },
      },
      defaultProps: { bgColor: '#111827', paddingY: 'md', maxWidth: 'container' },
      render: ({ bgColor, paddingY, maxWidth }: any) => {
        const maxWidthMap: Record<string, string> = { full: '100%', container: '1200px', narrow: '800px' }
        const pyMap: Record<string, string> = { sm: '16px', md: '40px', lg: '80px', xl: '120px' }
        return (
          <div style={{ background: bgColor || '#111827', padding: `${pyMap[paddingY] || '40px'} 24px` }}>
            <div style={{ maxWidth: maxWidthMap[maxWidth] || '1200px', margin: '0 auto' }}>
              <DropZone zone="content" />
            </div>
          </div>
        )
      },
    },

    // ── TwoColumn (2단 레이아웃) ──────────────────────────────────────────
    TwoColumn: {
      label: '2단 레이아웃',
      fields: {
        distribution: {
          type: 'select', label: '비율',
          options: [
            { label: '50 : 50 (균등)', value: '50-50' },
            { label: '60 : 40', value: '60-40' },
            { label: '40 : 60', value: '40-60' },
            { label: '67 : 33 (2:1)', value: '67-33' },
            { label: '33 : 67 (1:2)', value: '33-67' },
          ],
        },
        gap: { type: 'select', label: '사이 간격', options: [{ label: '좁게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '넓게', value: 'lg' }] },
        align: { type: 'select', label: '수직 정렬', options: [{ label: '위쪽', value: 'start' }, { label: '가운데', value: 'center' }, { label: '아래쪽', value: 'end' }] },
        dark: { type: 'radio', label: '배경', options: [{ label: '어두운', value: 'dark' }, { label: '밝은', value: 'light' }] },
        paddingY: { type: 'select', label: '상하 여백', options: [{ label: '없음', value: 'none' }, { label: '작게', value: 'sm' }, { label: '보통', value: 'md' }, { label: '크게', value: 'lg' }] },
      },
      defaultProps: { distribution: '50-50', gap: 'md', align: 'start', dark: 'dark', paddingY: 'md' },
      render: ({ distribution, gap, align, dark, paddingY }: any) => {
        const gapMap: Record<string, string> = { sm: '16px', md: '32px', lg: '64px' }
        return (
          <div style={{ background: dark === 'dark' ? '#000' : '#fff', padding: paddingYMap[paddingY] || '40px 24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: colDist[distribution] || '1fr 1fr', gap: gapMap[gap] || '32px', alignItems: align || 'start' }}>
              <DropZone zone="left" />
              <DropZone zone="right" />
            </div>
          </div>
        )
      },
    },
  },
}
