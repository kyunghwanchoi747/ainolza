"use client";

import { Lock, PlayCircle, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../../lib/utils";

interface LectureCardProps {
    title: string;
    description: string;
    thumbnail?: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    price: string;
    isLocked?: boolean;
    href: string;
}

export function LectureCard({
    title,
    description,
    thumbnail,
    level,
    duration,
    price,
    isLocked = false,
    href,
}: LectureCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
            {/* Thumbnail Area */}
            <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {thumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-secondary/50">
                        <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                )}

                {/* Lock Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                        <div className="rounded-full bg-background/80 p-3 shadow-sm border border-border">
                            <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full border",
                        level === "Beginner" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        level === "Intermediate" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                        level === "Advanced" && "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                        {level}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" /> {duration}
                    </span>
                </div>

                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <span className="font-bold text-lg">
                        {price === "Free" ? "Free" : `₩${price}`}
                    </span>
                    <Link
                        href={isLocked ? "/pricing" : href}
                        className={cn(
                            "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                            isLocked
                                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        {isLocked ? "Unlock Access" : "Start Learning"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
