"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "../theme-provider"; // Ensure this import is correct or use next-themes directly if we just need hook
import { useTheme } from "next-themes";

const navItems = [
    { name: "최신 AI 트렌드", href: "/trends" },
    { name: "Gemini 튜토리얼", href: "/gemini" },
    { name: "바이브 코딩", href: "/vibe-coding" },
    { name: "프롬프트", href: "/prompt" },
    { name: "커뮤니티", href: "/community" },
    { name: "스토어", href: "/store" },
];

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    <span className="hidden font-bold sm:inline-block">AI 놀자</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`transition-colors hover:text-foreground/80 ${pathname === item.href ? "text-foreground" : "text-foreground/60"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Side (Auth + Theme + Mobile Menu) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                        <span className="sr-only">Toggle theme</span>
                        {/* Simple sun/moon icon logic or use lucide icons */}
                        <div className="h-4 w-4 bg-current rounded-full" />
                    </button>

                    <Link
                        href="/login"
                        className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        로그인
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b border-border/40 bg-background"
                    >
                        <div className="container py-4 flex flex-col gap-4 px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                onClick={() => setIsOpen(false)}
                            >
                                로그인
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
