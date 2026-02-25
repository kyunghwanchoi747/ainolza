"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { urlFor } from "../../sanity/lib/image";
import Image from "next/image";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

interface HeroProps {
    data?: {
        headline: string;
        subhead: string;
        backgroundImage: any;
    } | null;
}

export function HeroSection({ data }: HeroProps) {
    // Default content if no data is provided
    const headline = data?.headline || "AI 시대, 당신은 '사용자'입니까, '디렉터'입니까?";
    const subhead = data?.subhead || "Chat GPT 출시 5일차부터 시작된 3년의 기록. 《불편한 AI》 저자 최경환이 전하는 '생존을 넘어선 지휘'의 기술.";

    return (
        <section className="relative overflow-hidden py-24 md:py-32 bg-background">
            <div className="container px-4 md:px-6 relative z-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center text-center space-y-8"
                >
                    {/* Badge */}
                    <motion.div variants={item}>
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            Connecting Dots <ArrowRight className="ml-1 h-4 w-4" />
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={item}
                        className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl"
                    >
                        {headline.split('\n').map((line, i) => (
                            <span key={i}>
                                {line}
                                {i < headline.split('\n').length - 1 && <br />}
                            </span>
                        ))}
                    </motion.h1>

                    {/* Subhead */}
                    <motion.p
                        variants={item}
                        className="max-w-[700px] text-lg text-muted-foreground md:text-xl font-light"
                    >
                        {subhead}
                    </motion.p>

                    {/* Social Proof Grid */}
                    <motion.div
                        variants={item}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 w-full max-w-3xl border-t border-border mt-8"
                    >
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-3xl font-bold">3+ Years</span>
                            <span className="text-sm text-muted-foreground">Practical Experience</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-3xl font-bold">1,200+</span>
                            <span className="text-sm text-muted-foreground">Certified Graduates</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-3xl font-bold">150+</span>
                            <span className="text-sm text-muted-foreground">Offline Lectures</span>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={item} className="pt-8">
                        <Link
                            href="/lectures"
                            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            커리큘럼 확인하기
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl -z-10 pointer-events-none opacity-20 dark:opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-[100px] rounded-full mix-blend-multiply filter opacity-50 animate-blob" />
            </div>

            {/* Background Image from Sanity (if available) */}
            {data?.backgroundImage && (
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <Image
                        src={urlFor(data.backgroundImage).url()}
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </section>
    );
}
