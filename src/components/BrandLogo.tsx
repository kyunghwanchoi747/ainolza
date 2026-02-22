import React from 'react'
import Image from 'next/image'

export function BrandLogo() {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
      <Image src="/logo.png" alt="AI 놀자 로고" fill className="object-contain" />
    </div>
  )
}
