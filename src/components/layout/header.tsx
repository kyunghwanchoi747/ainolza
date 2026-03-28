"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    const navItems = [
        { href: '/programs', label: '프로그램' },
        { href: '/community', label: '커뮤니티' },
        { href: '/store', label: '스토어' },
    ];

    const isActive = (href: string) => pathname?.startsWith(href);

    return (
        <header className="fixed top-0 w-full z-[100] border-b border-foreground/5 bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2">
                    <img src="/android-chrome-192x192.png" alt="AI놀자" className="w-8 h-8 rounded-lg" />
                    <span className="text-lg font-bold tracking-tighter">AI놀자</span>
                </Link>

                {/* 데스크탑 메뉴 */}
                <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-foreground/60">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className={`hover:text-foreground transition-colors ${isActive(item.href) ? 'text-foreground font-bold' : ''}`}>
                            {item.label}
                        </Link>
                    ))}
                    <Link href="https://open.kakao.com/o/s7kkWTfh" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">문의하기</Link>
                </nav>

                {/* 우측 버튼 */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
                        aria-label="테마 변경"
                    >
                        <Sun className="h-4 w-4 hidden dark:block" />
                        <Moon className="h-4 w-4 block dark:hidden" />
                    </button>
                    <Link
                        href="/programs"
                        className="hidden md:block px-4 py-2 bg-foreground text-background text-[13px] font-bold rounded-lg hover:opacity-90 transition-all"
                    >
                        시작하기
                    </Link>
                    <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 */}
            {isOpen && (
                <div className="md:hidden border-t border-foreground/5 bg-background px-6 py-4 flex flex-col gap-4">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className={`text-sm hover:text-foreground ${isActive(item.href) ? 'text-foreground font-bold' : 'text-foreground/60'}`} onClick={() => setIsOpen(false)}>
                            {item.label}
                        </Link>
                    ))}
                    <Link href="https://open.kakao.com/o/s7kkWTfh" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground" onClick={() => setIsOpen(false)}>문의하기</Link>
                    <Link href="/programs" className="text-sm font-bold text-foreground" onClick={() => setIsOpen(false)}>시작하기</Link>
                </div>
            )}
        </header>
    );
}
