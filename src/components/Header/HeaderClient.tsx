'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Rocket } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BrandLogo } from '../BrandLogo'

export function HeaderClient({
  user,
  navItems,
}: {
  user?: { nickname?: string; email: string }
  navItems: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getIcon = (iconName: string) => {
    // @ts-ignore
    return LucideIcons[iconName] || Rocket
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-black/80 backdrop-blur-md py-3'
          : 'bg-transparent py-5',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <BrandLogo />
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            AI 놀자
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-colors hover:text-white',
                pathname === item.href ? 'text-white' : 'text-gray-400',
              )}
            >
              {item.name}
              {pathname === item.href && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-500" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/my-page"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline-block">{user.nickname || user.email}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-white px-6 py-2 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95"
            >
              로그인
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 top-full w-full border-b border-white/10 bg-black/95 px-6 py-6 lg:hidden"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = getIcon(item.icon)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 text-lg font-medium transition-colors',
                      pathname === item.href ? 'text-blue-500' : 'text-gray-400 hover:text-white',
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              {!user && (
                <Link
                  href="/login"
                  className="w-full rounded-xl bg-blue-600 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  로그인하기
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
