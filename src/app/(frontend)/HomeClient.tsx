'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

export function HomeClient({ content }: { content: any }) {
  const getIcon = (name: string) => {
    // @ts-ignore
    return LucideIcons[name] || Zap
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-blue-400">
              {content?.badge || 'AI와 함께하는 스마트한 성장'}
            </span>
            <h1
              className="mt-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl"
              dangerouslySetInnerHTML={{
                __html: content?.headline || 'AI 놀자에서 <br /> 미래를 앞서가세요',
              }}
            />
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 sm:text-xl">
              {content?.subhead ||
                '비전공자와 3060 세대를 위한 가장 쉬운 AI 실무 커뮤니티. 최신 AI 트렌드부터 강의, 커뮤니티까지 한곳에서 경험하세요.'}
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105"
              >
                무료 강의 시작하기
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/community"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold transition-colors hover:bg-white/10"
              >
                커뮤니티 둘러보기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="bg-black py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {(
              content?.features || [
                {
                  title: '실무 중심 강의',
                  description: '현업에서 바로 쓰이는 실전 AI 활용법을 배웁니다.',
                  icon: 'Play',
                  color: 'bg-blue-500',
                },
                {
                  title: '열린 커뮤니티',
                  description: '서로 돕고 성장하는 따뜻한 AI 소통 공간입니다.',
                  icon: 'Zap',
                  color: 'bg-purple-500',
                },
                {
                  title: '검증된 리소스',
                  description: '엄선된 AI 도구와 자료를 큐레이션하여 제공합니다.',
                  icon: 'Shield',
                  color: 'bg-green-500',
                },
              ]
            ).map((feature: any, i: number) => {
              const Icon = getIcon(feature.icon)
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="rounded-[3rem] bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center md:p-20">
            <h2 className="text-4xl font-black text-white md:text-5xl">
              {content?.ctaHeadline || '지금 바로 AI 전문가로 거듭나세요'}
            </h2>
            <p className="mt-6 text-lg text-white/80">
              {content?.ctaSubhead ||
                '망설이는 매 순간 기술은 앞서나갑니다. AI 놀자와 함께라면 두렵지 않습니다.'}
            </p>
            <Link
              href="/login"
              className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-black text-blue-600 transition-transform hover:scale-105"
            >
              회원가입하고 혜택 받기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
