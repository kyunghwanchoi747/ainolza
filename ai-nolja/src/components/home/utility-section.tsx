"use client";

import { motion } from "framer-motion";
import { Sparkles, Command, ArrowRight } from "lucide-react";
import Link from "next/link";

export function UtilitySection() {
    return (
        <section className="py-24 bg-secondary/30 relative">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    {/* Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            경험이 곧 확신이 됩니다.
                            <br />
                            <span className="text-primary">AI 놀자 도구함</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-[600px]">
                            복잡한 프롬프트 작성, 이제 '클릭'으로 해결하세요.
                            <br />
                            강의에서 다루는 실전 도구들을 지금 바로 무료로 체험해보세요.
                        </p>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link
                                href="/tools"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                도구함 전체보기
                            </Link>
                        </div>
                    </div>

                    {/* Interactive Demo (Mockup) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="rounded-xl border bg-background text-card-foreground shadow-sm w-full max-w-md mx-auto lg:mr-0"
                    >
                        <div className="p-6">
                            <div className="flex items-center space-x-2 border-b pb-4 mb-4">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">AI 놀자 Clipper (Demo)</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Video URL</label>
                                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                                        https://youtube.com/watch?v=...
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Style</label>
                                    <div className="flex gap-2">
                                        <div className="rounded-md bg-secondary px-3 py-1 text-xs font-medium">
                                            Summary
                                        </div>
                                        <div className="rounded-md bg-primary/20 text-primary px-3 py-1 text-xs font-medium border border-primary/20">
                                            Blog Post
                                        </div>
                                        <div className="rounded-md bg-secondary px-3 py-1 text-xs font-medium">
                                            Shorts Script
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full inline-flex items-center justify-center rounded-md bg-primary h-9 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                                        <Command className="mr-2 h-4 w-4" />
                                        Generate Content
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-secondary/50 p-4 text-xs text-center text-muted-foreground rounded-b-xl border-t">
                            로그인 후 무제한으로 사용해보세요.
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
