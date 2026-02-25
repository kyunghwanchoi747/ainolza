import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "../../components/theme-provider";

export const metadata: Metadata = {
  title: "AI 놀자 - Director's Cut",
  description: "AI 시대, 당신은 '사용자'입니까, '디렉터'입니까?",
};

import { Header } from "../../components/layout/header";
import { SiteFooter } from "../../components/layout/site-footer";

import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-pretendard antialiased bg-background text-foreground flex flex-col min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </ThemeProvider>
    </div>
  );
}
