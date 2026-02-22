'use client'

import { useEffect } from 'react'

export function StatsTracker(): React.ReactNode {
  useEffect(() => {
    // Wait a bit after load to not interfere with initial page rendering
    const timer = setTimeout(() => {
      const track = async () => {
        try {
          await fetch('/api/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (err) {
          console.error('Failed to track stats:', err)
        }
      }
      track()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return null
}
