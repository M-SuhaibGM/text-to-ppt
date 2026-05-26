"use client"
import { useCallback, useEffect, useState } from 'react'

export function useFullscreen(targetElementId: string) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(async () => {
    // 1. Safely handle SSR / Server environment
    if (typeof window === 'undefined') return

    const elem = document.getElementById(targetElementId)
    if (!elem) {
      console.warn(`useFullscreen: Element with ID "${targetElementId}" not found.`)
      return
    }

    try {
      // 2. If nothing is fullscreen, or the current fullscreen element isn't OUR element, request it
      if (document.fullscreenElement !== elem) {
        await elem.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error("Failed to change fullscreen mode:", error)
    }
  }, [targetElementId])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFullscreenChange = () => {
      const elem = document.getElementById(targetElementId)
      // 3. Ensure state only updates if OUR target element matches the active fullscreen element
      if (elem) {
        setIsFullscreen(document.fullscreenElement === elem)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    // Initial check in case it's already full-screened on mount
    handleFullscreenChange()

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [targetElementId]) // Added targetElementId as a dependency here

  return { isFullscreen, toggleFullscreen }
}