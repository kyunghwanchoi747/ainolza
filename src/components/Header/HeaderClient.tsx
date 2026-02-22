'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, Rocket, ShoppingCart, LogOut } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BrandLogo } from '../BrandLogo'
import { useCart } from '@/components/CartProvider'

export function HeaderClient({ navItems }: { navItems: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const { user, count, refreshUser } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return
    const handler = () => setUserMenuOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [userMenuOpen])

  const getIcon = (iconName: string) => {
    // @ts-ignore
    return LucideIcons[iconName] || Rocket
  }

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    await refreshUser()
    router.push('/')
    router.refresh()
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
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center rounded-full w-10 h-10 border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setUserMenuOpen(!userMenuOpen)
                }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {user.nickname || user.email}
                </span>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md p-2 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href="/my-page"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      마이페이지
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/5"
                    >
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-lg font-medium text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  로그아웃
                </button>
              ) : (
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
