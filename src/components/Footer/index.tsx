import React from 'react'
import Link from 'next/link'
import { BrandLogo } from '../BrandLogo'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center space-x-3 group">
            <BrandLogo />
            <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              AI 놀자
            </span>
          </Link>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AI 놀자. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
