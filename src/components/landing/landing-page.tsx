"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground/20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center pt-20">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-[80px] font-medium leading-[1.05] tracking-tight mb-6">
              Play with AI,<br />
              <span className="text-foreground/30">Create the</span><br />
              Future
            </h1>
            <p className="text-xl text-foreground/50 mb-10 font-light">
              인공지능과 함께하는 새로운 교육의 시작.<br />
              상상을 현실로 만드는 AI 교육 플랫폼입니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/manager"
                className="px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:scale-105 transition-all text-sm"
              >
                무료 체험 신청
              </Link>
              <button className="px-8 py-4 bg-foreground/5 border border-foreground/10 font-bold rounded-xl hover:bg-foreground/10 transition-all text-sm flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" /> 영상 보기
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[600px] w-full"
          >
            <iframe
              src="https://my.spline.design/genkubgreetingrobot-BP4W5XoFVqOUjHRhuGq2j0VL/"
              frameBorder="0"
              width="100%"
              height="100%"
              title="AI놀자 3D Robot"
            />
          </motion.div>

        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-foreground/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xl text-foreground/40 mb-12 uppercase tracking-[0.2em] font-medium">
            강연 및 교육 수강생 1,000+명
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 contrast-125">
            <div className="text-2xl font-bold italic">바이브 코딩 클래스</div>
            <div className="text-2xl font-bold italic">AI 관련 도서 2권 출판</div>
            <div className="text-2xl font-bold italic">방송 출연</div>
            <div className="text-2xl font-bold italic">신문사 칼럼</div>
            <div className="text-2xl font-bold italic">자서전 작업</div>
          </div>
        </div>
      </section>

      {/* 프로그램 섹션 */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm text-foreground/40 uppercase tracking-[0.2em] mb-3">Programs</p>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">현재 운영중인 프로그램</h2>
            </div>
            <Link href="/programs" className="text-sm text-foreground/50 hover:text-foreground transition-colors border border-foreground/10 px-4 py-2 rounded-lg">
              전체 보기 →
            </Link>
          </div>
          <Link href="/programs" className="group block rounded-2xl overflow-hidden border border-foreground/10 hover:border-foreground/30 transition-all">
            <div className="aspect-video overflow-hidden">
              <Image
                src="/programs/바이브코딩상세1.png"
                alt="바이브 코딩 클래스"
                width={1200}
                height={675}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* AI 실험실 */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm text-foreground/40 uppercase tracking-[0.2em] mb-3">AI Lab</p>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">놀면서 배우는 AI 실험실</h2>
            </div>
            <Image src="/mascot.png" alt="AI놀자 마스코트" width={80} height={80} className="object-contain" />
          </div>
          <p className="text-foreground/40 mb-12 max-w-xl">직접 체험하며 AI를 이해하는 인터랙티브 미니 프로그램.<br />게임처럼 즐기면서 AI의 원리를 배워보세요.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/labs/prompt-challenge.html" className="group relative p-8 rounded-3xl bg-foreground/5 border border-foreground/10 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all flex flex-col gap-4 min-h-[280px]">
              <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-400 text-black text-[10px] font-bold rounded-bl-2xl rounded-tr-3xl">NEW</div>
              <div>
                <h3 className="text-xl font-bold mb-2">프롬프트 챌린지</h3>
                <p className="text-sm text-foreground/50">이미지를 보고 AI처럼 묘사해보세요. 프롬프트 작성 실력을 키울 수 있어요.</p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-yellow-400 text-sm font-medium">
                시작하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="group relative p-8 rounded-3xl bg-foreground/5 border border-foreground/10 flex flex-col gap-4 min-h-[280px] opacity-60">
              <div className="absolute top-0 right-0 px-3 py-1 bg-foreground/10 text-foreground/50 text-[10px] font-bold rounded-bl-2xl rounded-tr-3xl">SOON</div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI vs 나</h3>
                <p className="text-sm text-foreground/50">같은 질문에 AI와 내가 함께 답변. 사고방식의 차이를 발견해보세요.</p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-violet-400 text-sm font-medium">
                준비중 <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-foreground/5 border border-foreground/10 flex flex-col gap-4 min-h-[280px] opacity-60">
              <div className="absolute top-0 right-0 px-3 py-1 bg-foreground/10 text-foreground/50 text-[10px] font-bold rounded-bl-2xl rounded-tr-3xl">SOON</div>
              <div>
                <h3 className="text-xl font-bold mb-2">프롬프트 빌더</h3>
                <p className="text-sm text-foreground/50">요소를 조합해서 완성도 높은 프롬프트를 만들어보세요.</p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-emerald-400 text-sm font-medium">
                준비중 <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="group relative p-8 rounded-3xl bg-foreground/5 border border-foreground/10 flex flex-col gap-4 min-h-[280px] opacity-60">
              <div className="absolute top-0 right-0 px-3 py-1 bg-foreground/10 text-foreground/50 text-[10px] font-bold rounded-bl-2xl rounded-tr-3xl">SOON</div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI 직업 탐색기</h3>
                <p className="text-sm text-foreground/50">내 관심사를 입력하면 AI가 미래 직업과 활용법을 제안해줘요.</p>
              </div>
              <div className="mt-auto flex items-center gap-2 text-sky-400 text-sm font-medium">
                준비중 <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm text-foreground/40 uppercase tracking-[0.2em] mb-4">About</p>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight mb-8">
              AI놀자와 함께<br />미래를 만들어가세요.
            </h2>
            <div className="space-y-4 text-foreground/50 leading-relaxed">
              <p>AI놀자는 인공지능을 놀이처럼 배울 수 있는 교육 플랫폼입니다.</p>
              <p>코딩 경험이 전혀 없는 분들도 AI의 원리를 이해하고, 실제로 활용할 수 있는 실력을 키울 수 있도록 설계했습니다.</p>
              <p>바이브 코딩, 프롬프트 엔지니어링, AI 자동화까지 — 단계별 커리큘럼으로 누구나 AI 시대를 준비할 수 있습니다.</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Image src="/mascot.png" alt="AI놀자 마스코트" width={300} height={300} className="object-contain" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-60 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foreground/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative group"
          >
            <div className="absolute -inset-1 bg-foreground/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link
              href="/manager"
              className="relative inline-block px-12 py-6 bg-foreground text-background text-xl font-bold rounded-2xl shadow-2xl shadow-foreground/10"
            >
              지금 시작하기
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
