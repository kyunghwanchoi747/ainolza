"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
    { href: '/store', label: '강의/책' },
    { href: '/labs', label: 'AI실험실' },
    { href: '/tools', label: '도구' },
    { href: '/contact', label: '문의' },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
    const pathname = usePathname();
    const isActive = (href: string) => pathname?.startsWith(href);

    useEffect(() => {
        fetch('/api/users/me', { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then((data: any) => {
                if (data?.user) setUser(data.user);
            })
            .catch(() => {});
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-[100] bg-white border-b border-line">
            <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-brand">
                        AI놀자
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-[15px]">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${isActive(item.href) ? 'text-brand font-semibold' : 'text-ink hover:text-brand'}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link href="/mypage" className="hidden md:flex items-center gap-1.5 text-[14px] text-ink hover:text-brand transition-colors">
                                <User className="w-4 h-4" />
                                {user.name || user.email.split('@')[0]}
                            </Link>
                            <button
                                onClick={handleLogout}
                                type="button"
                                className="hidden md:block text-[14px] text-sub hover:text-brand transition-colors cursor-pointer"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hidden md:block text-[14px] text-body hover:text-ink transition-colors">
                                로그인
                            </Link>
                            <span className="hidden md:block text-[#e5e5e5]">|</span>
                            <Link href="/signup" className="hidden md:block text-[14px] text-body hover:text-ink transition-colors">
                                회원가입
                            </Link>
                        </>
                    )}
                    <button type="button" className="md:hidden p-2 text-ink cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden border-t border-line bg-white px-4 py-3 flex flex-col gap-3">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-[15px] ${isActive(item.href) ? 'text-brand font-semibold' : 'text-ink'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-line text-[14px]">
                        {user ? (
                            <div className="space-y-2">
                                <Link href="/mypage" className="text-ink flex items-center gap-1.5" onClick={() => setIsOpen(false)}>
                                    <User className="w-4 h-4" />
                                    {user.name || user.email.split('@')[0]}
                                </Link>
                                <button type="button" onClick={handleLogout} className="text-sub text-sm cursor-pointer hover:text-brand transition-colors">로그아웃</button>
                            </div>
                        ) : (
                            <div className="flex gap-4 text-body">
                                <Link href="/login" onClick={() => setIsOpen(false)}>로그인</Link>
                                <Link href="/signup" onClick={() => setIsOpen(false)}>회원가입</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
