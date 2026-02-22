'use client'

import type { Config } from '@puckeditor/core'
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
}

type FeatureItem = { title: string; description: string; color: string }
type FeaturesProps = { title: string; items: FeatureItem[] }

type TextSectionProps = {
  title: string
  body: string
  align: 'left' | 'center' | 'right'
  dark: 'dark' | 'light'
}

type CTABannerProps = {
  headline: string
  subheadline: string
  buttonLabel: string
  buttonHref: string
}

type ImageSectionProps = {
  src: string
  alt: string
  caption: string
  contained: boolean
}

type SpacerProps = { size: 'sm' | 'md' | 'lg' | 'xl'; dark: 'dark' | 'light' }

// ─── Common Styles ───────────────────────────────────────────────────────────

const S = {
  dark: { background: '#000' },
  light: { background: '#fff' },
  section: (dark: boolean): React.CSSProperties => ({
    background: dark ? '#000' : '#fff',
    padding: '80px 24px',
  }),
  container: { maxWidth: 1200, margin: '0 auto' } as React.CSSProperties,
  heading: (dark: boolean): React.CSSProperties => ({
    fontSize: 'clamp(28px,4vw,48px)',
    fontWeight: 900,
    color: dark ? '#fff' : '#111',
    margin: 0,
  }),
  body: (dark: boolean): React.CSSProperties => ({
    fontSize: 18,
    color: dark ? '#9ca3af' : '#6b7280',
    lineHeight: 1.8,
    marginTop: 16,
  }),
}

// ─── Puck Config ─────────────────────────────────────────────────────────────

export const puckConfig: Config = {
  categories: {
    섹션: { title: '섹션', components: ['Hero', 'Features', 'CTABanner'] },
    콘텐츠: { title: '콘텐츠', components: ['TextSection', 'ImageSection'] },
    레이아웃: { title: '레이아웃', components: ['Spacer'] },
  },

  components: {
    // ── Hero ──────────────────────────────────────────────────────────────
    Hero: {
      label: '히어로 섹션',
      fields: {
        badge: { type: 'text', label: '상단 배지 텍스트' },
        headline: { type: 'textarea', label: '메인 헤드라인' },
        subheadline: { type: 'textarea', label: '서브 헤드라인' },
        cta1Label: { type: 'text', label: '주 버튼 텍스트' },
        cta1Href: { type: 'text', label: '주 버튼 링크' },
        cta2Label: { type: 'text', label: '보조 버튼 텍스트' },
        cta2Href: { type: 'text', label: '보조 버튼 링크' },
      },
      defaultProps: {
        badge: 'AI와 함께하는 스마트한 성장',
        headline: 'AI 놀자에서\n미래를 앞서가세요',
        subheadline: '비전공자와 3060 세대를 위한 가장 쉬운 AI 실무 커뮤니티.',
        cta1Label: '무료 강의 시작하기',
        cta1Href: '/courses',
        cta2Label: '커뮤니티 둘러보기',
        cta2Href: '/community',
      },
      render: ({ badge, headline, subheadline, cta1Label, cta1Href, cta2Label, cta2Href }: any) => (
        <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '80px 24px', background: '#000' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(37,99,235,0.12), transparent)', zIndex: 0 }} />
          <div style={{ position: 'absolute', left: '50%', top: '40%', width: 480, height: 480, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'rgba(59,130,246,0.18)', filter: 'blur(100px)', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            {badge && (
              <span style={{ display: 'inline-block', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', padding: '4px 16px', fontSize: 14, color: '#60a5fa', marginBottom: 24 }}>
                {badge}
              </span>
            )}
            <h1 style={{ fontSize: 'clamp(40px,7vw,88px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, whiteSpace: 'pre-line' }}>
              {headline}
            </h1>
            <p style={{ marginTop: 28, fontSize: 20, color: '#9ca3af', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              {subheadline}
            </p>
            <div style={{ marginTop: 44, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
              {cta1Label && (
                <a href={cta1Href || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, background: '#2563eb', padding: '16px 36px', fontSize: 18, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
                  {cta1Label}
                </a>
              )}
              {cta2Label && (
                <a href={cta2Href || '#'} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', padding: '16px 36px', fontSize: 18, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
                  {cta2Label}
                </a>
              )}
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
        items: {
          type: 'array',
          label: '기능 항목',
          arrayFields: {
            title: { type: 'text', label: '제목' },
            description: { type: 'textarea', label: '설명' },
            color: {
              type: 'select',
              label: '포인트 색상',
              options: [
                { label: '파란색', value: '#2563eb' },
                { label: '보라색', value: '#7c3aed' },
                { label: '초록색', value: '#16a34a' },
                { label: '주황색', value: '#ea580c' },
                { label: '분홍색', value: '#db2777' },
              ],
            },
          },
        },
      },
      defaultProps: {
        title: '',
        items: [
          { title: '실무 중심 강의', description: '현업에서 바로 쓰이는 실전 AI 활용법을 배웁니다.', color: '#2563eb' },
          { title: '열린 커뮤니티', description: '서로 돕고 성장하는 따뜻한 AI 소통 공간입니다.', color: '#7c3aed' },
          { title: '검증된 리소스', description: '엄선된 AI 도구와 자료를 큐레이션하여 제공합니다.', color: '#16a34a' },
        ],
      },
      render: ({ title, items }: any) => (
        <section style={{ background: '#000', padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {title && <h2 style={{ ...S.heading(true), textAlign: 'center', marginBottom: 48 }}>{title}</h2>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
              {(items || []).map((item: any, i: number) => (
                <div key={i} style={{ borderRadius: 28, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: 32, transition: 'background 0.2s' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <div style={{ width: 22, height: 22, background: 'rgba(255,255,255,0.85)', borderRadius: 6 }} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{item.title}</h3>
                  <p style={{ marginTop: 10, color: '#9ca3af', lineHeight: 1.65, fontSize: 15 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    },

    // ── TextSection ───────────────────────────────────────────────────────
    TextSection: {
      label: '텍스트 섹션',
      fields: {
        title: { type: 'text', label: '제목' },
        body: { type: 'textarea', label: '본문' },
        align: {
          type: 'radio',
          label: '텍스트 정렬',
          options: [
            { label: '왼쪽', value: 'left' },
            { label: '가운데', value: 'center' },
            { label: '오른쪽', value: 'right' },
          ],
        },
        dark: {
          type: 'radio',
          label: '배경 테마',
          options: [
            { label: '어두운', value: 'dark' },
            { label: '밝은', value: 'light' },
          ],
        },
      },
      defaultProps: { title: '섹션 제목', body: '본문 내용을 입력하세요.', align: 'center', dark: 'dark' },
      render: ({ title, body, align, dark }: any) => (
        <section style={{ ...S.section(dark === 'dark'), textAlign: align }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {title && <h2 style={S.heading(dark === 'dark')}>{title}</h2>}
            {body && <p style={S.body(dark === 'dark')}>{body}</p>}
          </div>
        </section>
      ),
    },

    // ── CTABanner ─────────────────────────────────────────────────────────
    CTABanner: {
      label: 'CTA 배너',
      fields: {
        headline: { type: 'text', label: '헤드라인' },
        subheadline: { type: 'text', label: '서브 헤드라인' },
        buttonLabel: { type: 'text', label: '버튼 텍스트' },
        buttonHref: { type: 'text', label: '버튼 링크' },
        gradient: {
          type: 'select',
          label: '그라데이션',
          options: [
            { label: '파란-보라', value: 'linear-gradient(135deg,#2563eb,#7c3aed)' },
            { label: '초록-파랑', value: 'linear-gradient(135deg,#059669,#2563eb)' },
            { label: '주황-빨강', value: 'linear-gradient(135deg,#ea580c,#dc2626)' },
            { label: '분홍-보라', value: 'linear-gradient(135deg,#db2777,#7c3aed)' },
          ],
        },
      },
      defaultProps: {
        headline: '지금 바로 AI 전문가로 거듭나세요',
        subheadline: '망설이는 매 순간 기술은 앞서나갑니다. AI 놀자와 함께라면 두렵지 않습니다.',
        buttonLabel: '회원가입하고 혜택 받기',
        buttonHref: '/login',
        gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)',
      },
      render: ({ headline, subheadline, buttonLabel, buttonHref, gradient }: any) => (
        <section style={{ padding: '60px 24px', background: '#000' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 48, background: gradient, padding: '64px 40px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', margin: 0 }}>{headline}</h2>
            <p style={{ marginTop: 20, fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{subheadline}</p>
            {buttonLabel && (
              <a href={buttonHref || '#'} style={{ marginTop: 36, display: 'inline-block', borderRadius: 9999, background: '#fff', padding: '16px 40px', fontSize: 18, fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>
                {buttonLabel}
              </a>
            )}
          </div>
        </section>
      ),
    },

    // ── ImageSection ──────────────────────────────────────────────────────
    ImageSection: {
      label: '이미지',
      fields: {
        src: { type: 'text', label: '이미지 URL' },
        alt: { type: 'text', label: '대체 텍스트 (접근성)' },
        caption: { type: 'text', label: '캡션 (선택)' },
        contained: { type: 'radio', label: '너비', options: [{ label: '전체 폭', value: false as any }, { label: '컨테이너', value: true as any }] },
      },
      defaultProps: { src: '', alt: '이미지', caption: '', contained: false },
      render: ({ src, alt, caption, contained }: any) => (
        <section style={{ background: '#000', padding: contained ? '40px 24px' : '0' }}>
          <div style={{ maxWidth: contained ? 960 : '100%', margin: '0 auto' }}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: contained ? 24 : 0 }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: contained ? 24 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 14 }}>
                이미지 URL을 입력하세요
              </div>
            )}
            {caption && <p style={{ marginTop: 12, textAlign: 'center', color: '#6b7280', fontSize: 14, padding: '0 24px' }}>{caption}</p>}
          </div>
        </section>
      ),
    },

    // ── Spacer ────────────────────────────────────────────────────────────
    Spacer: {
      label: '여백',
      fields: {
        size: {
          type: 'select',
          label: '높이',
          options: [
            { label: '작게 (32px)', value: 'sm' },
            { label: '보통 (64px)', value: 'md' },
            { label: '크게 (96px)', value: 'lg' },
            { label: '매우 크게 (128px)', value: 'xl' },
          ],
        },
        dark: {
          type: 'radio',
          label: '배경',
          options: [
            { label: '어두운', value: 'dark' },
            { label: '밝은', value: 'light' },
          ],
        },
      },
      defaultProps: { size: 'md', dark: 'dark' },
      render: ({ size, dark }: any) => {
        const heights: Record<string, number> = { sm: 32, md: 64, lg: 96, xl: 128 }
        return <div style={{ height: heights[size] ?? 64, background: dark === 'dark' ? '#000' : '#fff' }} />
      },
    },
  },
}
