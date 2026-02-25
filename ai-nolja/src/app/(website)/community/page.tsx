"use client";

import { MessageCircle, Youtube, Users } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
    return (
        <div className="container py-12 md:py-24 px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    The Network: <span className="text-primary">Community</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    혼자 고민하지 마세요. <br />
                    같은 곳을 바라보는 디렉터들과 함께 성장하세요.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {/* YouTube */}
                <Link
                    href="https://youtube.com/@gptpark"
                    target="_blank"
                    className="flex flex-col items-center p-8 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-red-500/50 hover:bg-red-500/5 hover:scale-105"
                >
                    <div className="rounded-full bg-red-100 p-4 mb-4 dark:bg-red-900/20">
                        <Youtube className="h-8 w-8 text-red-600 dark:text-red-500" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">GPT PARK 유튜브</h3>
                    <p className="text-center text-sm text-muted-foreground">
                        최신 AI 뉴스와 튜토리얼 영상을<br />가장 먼저 만나보세요.
                    </p>
                </Link>

                {/* KakaoTalk */}
                <Link
                    href="#"
                    className="flex flex-col items-center p-8 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-yellow-400/50 hover:bg-yellow-400/5 hover:scale-105"
                >
                    <div className="rounded-full bg-yellow-100 p-4 mb-4 dark:bg-yellow-900/20">
                        <MessageCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">오픈 채팅방</h3>
                    <p className="text-center text-sm text-muted-foreground">
                        실시간 질의응답과 정보 공유.<br />함께 공부하는 동료들을 만나세요.
                    </p>
                </Link>

                {/* Discord / Board */}
                <Link
                    href="#"
                    className="flex flex-col items-center p-8 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:scale-105"
                >
                    <div className="rounded-full bg-indigo-100 p-4 mb-4 dark:bg-indigo-900/20">
                        <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">멤버십 커뮤니티</h3>
                    <p className="text-center text-sm text-muted-foreground">
                        수강생 전용 과제 제출 및<br />심화 토론 게시판 (준비중)
                    </p>
                </Link>
            </div>
        </div>
    );
}
