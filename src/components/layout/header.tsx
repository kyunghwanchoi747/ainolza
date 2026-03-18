"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2">
                    <img src="/android-chrome-192x192.png" alt="AI놀자" className="w-8 h-8 rounded-lg" />
                    <span className="text-lg font-bold tracking-tighter text-white">AI놀자</span>
                </Link>

                {/* 데스크탑 메뉴 */}
                <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/60">
                    <Link href="/programs" className="hover:text-white transition-colors">프로그램</Link>
                    <Link href="/community" className="hover:text-white transition-colors">커뮤니티</Link>
                    <Link href="/store" className="hover:text-white transition-colors">스토어</Link>
                    <Link href="#contact" className="hover:text-white transition-colors">문의하기</Link>
                </nav>

                {/* 우측 버튼 */}
                <div className="flex items-center gap-4">
                    <Link href="/manager" className="hidden md:block text-[13px] font-medium text-white/80 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link
                        href="/manager"
                        className="hidden md:block px-4 py-2 bg-white text-black text-[13px] font-bold rounded-lg hover:bg-white/90 transition-all"
                    >
                        시작하기
                    </Link>
                    <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 */}
            {isOpen && (
                <div className="md:hidden border-t border-white/5 bg-[#050505] px-6 py-4 flex flex-col gap-4">
                    <Link href="/programs" className="text-sm text-white/60 hover:text-white" onClick={() => setIsOpen(false)}>프로그램</Link>
                    <Link href="/community" className="text-sm text-white/60 hover:text-white" onClick={() => setIsOpen(false)}>커뮤니티</Link>
                    <Link href="/store" className="text-sm text-white/60 hover:text-white" onClick={() => setIsOpen(false)}>스토어</Link>
                    <Link href="#contact" className="text-sm text-white/60 hover:text-white" onClick={() => setIsOpen(false)}>문의하기</Link>
                    <Link href="/manager" className="text-sm font-bold text-white" onClick={() => setIsOpen(false)}>시작하기</Link>
                </div>
            )}
        </header>
    );
}
