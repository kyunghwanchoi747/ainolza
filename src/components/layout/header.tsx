"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface NavItem {
    name: string;
    href: string;
}

const FALLBACK_NAV: NavItem[] = [
    { name: "커뮤니티", href: "/community" },
    { name: "스토어", href: "/store" },
    { name: "프로그램", href: "/programs" },
];

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [navItems, setNavItems] = React.useState<NavItem[]>(FALLBACK_NAV);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        fetch("/api/site-config")
            .then((res) => res.json())
            .then((data: any) => {
                if (data.navigation?.length) {
                    const items = data.navigation
                        .filter((n: any) => n.enabled && n.type !== "home")
                        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                        .map((n: any) => ({ name: n.label, href: n.path }));
                    if (items.length > 0) setNavItems(items);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    <span className="hidden font-bold sm:inline-block">AI 놀자</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`transition-colors hover:text-foreground/80 ${pathname === item.href || pathname.startsWith(item.href + "/") ? "text-foreground" : "text-foreground/60"}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                        <span className="sr-only">Toggle theme</span>
                        <div className="h-4 w-4 bg-current rounded-full" />
                    </button>

                    <Link
                        href="/manager"
                        className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        로그인
                    </Link>

                    <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

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
                                href="/manager"
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
