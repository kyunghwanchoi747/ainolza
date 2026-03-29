"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
    { href: '/store', label: '강의/전자책' },
    { href: '/labs', label: 'AI실험실' },
    { href: '/community', label: '후기' },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isActive = (href: string) => pathname?.startsWith(href);

    return (
        <header className="sticky top-0 z-[100] bg-white border-b border-[#e5e5e5]">
            <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-[#D4756E]">
                        AI놀자
                    </Link>

                    {/* 데스크탑 메뉴 */}
                    <nav className="hidden md:flex items-center gap-6 text-[15px]">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${isActive(item.href) ? 'text-[#D4756E] font-semibold' : 'text-[#333] hover:text-[#D4756E]'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 우측 */}
                <div className="flex items-center gap-4">
                    <Link href="/programs" className="hidden md:block text-[14px] text-[#666] hover:text-[#333] transition-colors">
                        로그인
                    </Link>
                    <span className="hidden md:block text-[#e5e5e5]">|</span>
                    <Link href="/programs" className="hidden md:block text-[14px] text-[#666] hover:text-[#333] transition-colors">
                        회원가입
                    </Link>
                    <button className="md:hidden p-2 text-[#333]" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 */}
            {isOpen && (
                <div className="md:hidden border-t border-[#e5e5e5] bg-white px-4 py-3 flex flex-col gap-3">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-[15px] ${isActive(item.href) ? 'text-[#D4756E] font-semibold' : 'text-[#333]'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="flex gap-4 pt-2 border-t border-[#e5e5e5] text-[14px] text-[#666]">
                        <Link href="/programs" onClick={() => setIsOpen(false)}>로그인</Link>
                        <Link href="/programs" onClick={() => setIsOpen(false)}>회원가입</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
