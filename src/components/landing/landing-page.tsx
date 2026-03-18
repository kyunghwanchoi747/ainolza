"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Cpu,
  Sparkles,
  Play,
  ArrowRight,
  ChevronRight,
  Users,
  Zap,
  Layout,
  Globe,
  Shield,
  Search,
} from "lucide-react";

const testimonials = [
  { name: "김민수", role: "초등학교 교사", text: "아이들이 AI를 이렇게 즐겁게 배울 수 있을 줄 몰랐습니다. 커리큘럼이 정말 체계적이에요." },
  { name: "이영희", role: "학부모", text: "단순한 코딩 교육을 넘어 사고력을 키워주는 방식이 마음에 듭니다. 아이가 매일 AI놀자 시간만 기다려요." },
  { name: "박지성", role: "교육 공학자", text: "최신 AI 트렌드를 가장 빠르게 반영하는 플랫폼입니다. 기술적 완성도가 매우 높습니다." },
  { name: "최유진", role: "중학생", text: "어렵게만 느껴졌던 인공지능이 이제는 제 가장 친한 친구가 되었어요. 직접 프로젝트를 만드는 게 너무 재밌어요!" },
  { name: "정우성", role: "IT 기업 인사담당자", text: "AI놀자 출신 학생들의 포트폴리오를 보고 깜짝 놀랐습니다. 실무 역량이 대단하더군요." },
  { name: "한소희", role: "방과후 강사", text: "수업 준비가 훨씬 수월해졌습니다. 제공되는 교안과 툴들이 정말 혁신적입니다." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 overflow-x-hidden">
      {/* 1. Navigation */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Cpu className="text-black w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tighter">AI놀자</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/60">
            <Link href="/programs" className="hover:text-white transition-colors">프로그램</Link>
            <Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link>
            <Link href="/store" className="hover:text-white transition-colors">스토어</Link>
            <Link href="#contact" className="hover:text-white transition-colors">문의하기</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/manager" className="text-[13px] font-medium text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/manager"
              className="px-4 py-2 bg-white text-black text-[13px] font-bold rounded-lg hover:bg-white/90 transition-all"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-40 pb-20 flex flex-col items-center text-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white/5 to-transparent blur-3xl -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-[100px] font-medium leading-[1.05] tracking-tight mb-8">
            Every great future <br /> starts with AI놀자
          </h1>
          <p className="text-xl md:text-2xl text-white/50 mb-12 font-light">
            인공지능과 함께하는 새로운 교육의 시작. <br className="hidden md:block" />
            상상을 현실로 만드는 AI 교육 플랫폼입니다.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Link
              href="/manager"
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all text-sm"
            >
              무료 체험 신청
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all text-sm flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> 영상 보기
            </button>
          </div>
        </motion.div>

        {/* Spline 3D Robot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-6xl aspect-video rounded-[32px] border border-white/10 bg-black/40 overflow-hidden relative shadow-2xl shadow-white/5"
        >
          <div className="absolute top-0 w-full h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-2 z-10">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="ml-4 px-3 py-1 bg-white/5 rounded-md text-[10px] text-white/30 border border-white/5">
              ainolza.pages.dev
            </div>
          </div>
          <iframe
            src="https://my.spline.design/genkubgreetingrobot-sjuzDgdM6kAGKTcjnEYJNH5Z/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="pt-12"
            title="AI놀자 3D Robot"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* 3. Social Proof */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-white/40 mb-12 uppercase tracking-[0.2em] font-medium">
            500개 이상의 학교와 기관이 선택한 AI 교육 플랫폼
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-30 grayscale contrast-125">
            <div className="text-2xl font-bold italic">서울대학교</div>
            <div className="text-2xl font-bold italic">KAIST</div>
            <div className="text-2xl font-bold italic">Google Edu</div>
            <div className="text-2xl font-bold italic">Microsoft</div>
            <div className="text-2xl font-bold italic">Apple School</div>
          </div>
        </div>
      </section>

      {/* 4. Feature Intro */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-medium leading-tight tracking-tight">
              아이디어 하나로 <br /> AI 프로젝트를 <br /> 시작하세요.
            </h2>
          </div>
          <div className="relative">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between group cursor-text">
              <div className="flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                <span className="text-white/40 font-light">AI 교육 과정을 설계하고 싶어요...</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <ArrowRight className="text-black w-4 h-4" />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md text-xs font-medium animate-bounce">
              ✨ 커리큘럼 자동 생성 중
            </div>
          </div>
        </div>
      </section>

      {/* 5. Detailed Features */}
      <section className="py-40 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div className="lg:sticky lg:top-40 h-fit">
            <h2 className="text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-8">
              AI놀자와 함께 <br /> 미래를 <br /> 만들어가세요.
            </h2>
            <p className="text-xl text-white/40 font-light max-w-md">
              복잡한 코딩 없이도 인공지능의 원리를 이해하고, 나만의 AI 프로젝트를 완성할 수 있는 혁신적인 도구들을 경험하세요.
            </p>
          </div>

          <div className="space-y-8">
            <div className="aspect-[4/5] rounded-[40px] bg-white/5 border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-12 h-full flex flex-col justify-end">
                <h3 className="text-3xl font-medium mb-4">AI 기초 놀이터</h3>
                <p className="text-white/50 leading-relaxed">
                  게임처럼 즐기는 AI 기초 학습. 데이터의 흐름을 눈으로 직접 확인하며 인공지능의 사고 방식을 배웁니다.
                </p>
              </div>
              <div className="absolute top-12 right-12 w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
                <Brain className="w-12 h-12 text-white/20" />
              </div>
            </div>

            <div className="aspect-[4/5] rounded-[40px] bg-white/5 border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-12 h-full flex flex-col justify-end">
                <h3 className="text-3xl font-medium mb-4">실전 프로젝트 마스터</h3>
                <p className="text-white/50 leading-relaxed">
                  단순한 이론을 넘어 실제 작동하는 AI 모델을 구축합니다. 나만의 창의적인 아이디어를 AI로 구현해보세요.
                </p>
              </div>
              <div className="absolute top-12 right-12 flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-24 bg-white/10 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature Grid */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <h2 className="text-5xl md:text-7xl font-medium leading-[0.9] tracking-tight">
              교육을 위해 만들었고, <br /> 놀이처럼 느껴집니다.
            </h2>
            <p className="text-lg text-white/40 max-w-sm font-light">
              AI놀자는 교육의 효율성과 즐거움을 동시에 추구합니다. 전문가들이 설계한 최적의 학습 환경을 만나보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="p-12 rounded-[40px] bg-white/5 border border-white/10 h-[500px] flex flex-col justify-between group hover:bg-white/[0.07] transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-3xl font-medium mb-4">초고속 학습 엔진</h4>
                <p className="text-white/50">최신 LLM 기술을 활용하여 학습자의 수준에 맞는 맞춤형 피드백을 실시간으로 제공합니다.</p>
              </div>
            </div>
            <div className="p-12 rounded-[40px] bg-white/5 border border-white/10 h-[500px] flex flex-col justify-between group hover:bg-white/[0.07] transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <Layout className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-3xl font-medium mb-4">스마트 캔버스</h4>
                <p className="text-white/50">드래그 앤 드롭 방식으로 AI 모델의 구조를 설계하고 시뮬레이션할 수 있는 직관적인 인터페이스입니다.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/5">
            <div className="space-y-4">
              <Globe className="w-6 h-6 text-white/40" />
              <h5 className="font-medium">글로벌 커뮤니티</h5>
              <p className="text-sm text-white/40">전 세계 학습자들과 프로젝트를 공유하고 협업하세요.</p>
            </div>
            <div className="space-y-4">
              <Shield className="w-6 h-6 text-white/40" />
              <h5 className="font-medium">안전한 학습 환경</h5>
              <p className="text-sm text-white/40">데이터 보안과 윤리적 AI 사용을 최우선으로 합니다.</p>
            </div>
            <div className="space-y-4">
              <Users className="w-6 h-6 text-white/40" />
              <h5 className="font-medium">실시간 협업</h5>
              <p className="text-sm text-white/40">팀원들과 실시간으로 AI 모델을 함께 수정하고 테스트하세요.</p>
            </div>
            <div className="space-y-4">
              <Zap className="w-6 h-6 text-white/40" />
              <h5 className="font-medium">원클릭 배포</h5>
              <p className="text-sm text-white/40">완성된 AI 프로젝트를 웹이나 앱으로 즉시 배포할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Widget/Showcase */}
      <section className="py-40 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-6 inline-block">
              Widgets
            </span>
            <h2 className="text-5xl md:text-7xl font-medium leading-tight tracking-tight">
              완벽한 결과물을 만드는 <span className="text-white/40">픽셀 퍼펙트 위젯.</span>
            </h2>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-12" style={{ scrollbarWidth: 'none' }}>
            {[
              { icon: <Brain className="w-20 h-20 text-white/10" />, title: "AI 학습 분석", desc: "학습자 데이터를 실시간으로 분석하여 맞춤 피드백을 제공합니다." },
              { icon: <Search className="w-20 h-20 text-white/10" />, title: "스마트 검색", desc: "자연어로 교육 자료를 검색하고 추천받을 수 있습니다." },
              { icon: <Zap className="w-20 h-20 text-white/10" />, title: "실시간 시뮬레이션", desc: "AI 모델의 작동 원리를 시각적으로 확인할 수 있습니다." },
            ].map((widget, i) => (
              <div key={i} className="min-w-[400px] aspect-[4/3] rounded-[32px] bg-black border border-white/10 p-8 flex flex-col justify-between group hover:border-white/30 transition-all">
                <div className="w-full h-48 bg-white/5 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {widget.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-medium mb-2">{widget.title}</h4>
                  <p className="text-sm text-white/40">{widget.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">
            교육 전문가와 학생들이 <br /> 사랑하는 플랫폼.
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-10 rounded-[32px] bg-white/5 border border-white/10 flex flex-col justify-between hover:bg-white/[0.08] transition-colors">
              <p className="text-lg font-light leading-relaxed mb-12 text-white/80 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
                <div>
                  <h5 className="font-bold text-sm">{t.name}</h5>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CTA */}
      <section id="contact" className="py-60 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative group"
          >
            <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link
              href="/manager"
              className="relative inline-block px-12 py-6 bg-white text-black text-xl font-bold rounded-2xl shadow-2xl shadow-white/10"
            >
              지금 시작하기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="pt-40 pb-20 px-6 relative border-t border-white/5 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[25vw] font-black text-white/[0.02] leading-none select-none pointer-events-none whitespace-nowrap">
          AI놀자
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-40">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Cpu className="text-black w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tighter">AI놀자</span>
              </Link>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                미래를 여는 AI 교육의 시작. <br />
                우리는 모든 아이들이 AI와 함께 꿈꾸는 세상을 만듭니다.
              </p>
            </div>

            <div className="space-y-6">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">서비스</h6>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="/programs" className="hover:text-white transition-colors">프로그램</Link></li>
                <li><Link href="/store" className="hover:text-white transition-colors">스토어</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">회사</h6>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">소개</a></li>
                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">문의</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">소셜</h6>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h6 className="text-xs font-bold uppercase tracking-widest text-white/40">법적 고지</h6>
              <ul className="space-y-4 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-[10px] uppercase tracking-widest text-white/20 font-bold">
            <p>&copy; 2026 AI놀자. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
