'use client'
import React, { useRef, useEffect } from 'react'
import styles from './style/VHSEffect.module.css'

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const VHSEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snowCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    const snowCanvas = snowCanvasRef.current

    if (!canvas || !snowCanvas) return

    const ctx = canvas.getContext('2d')
    const snowCtx = snowCanvas.getContext('2d')

    if (!ctx || !snowCtx) return

    // Set canvas dimensions
    const updateSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        const width = parent.clientWidth
        const height = parent.clientHeight

        if (width > 0 && height > 0) {
          canvas.width = width
          canvas.height = height
          snowCanvas.width = width / 2
          snowCanvas.height = height / 2
        }
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    // VCR tracking noise effect
    const renderTrackingNoise = () => {
      const width = canvas.width
      const height = canvas.height

      if (width === 0 || height === 0) return

      const radius = 1
      const num = 20
      let posy1 = 0
      const posy2 = height
      let posy3 = 0

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#000'
      ctx.beginPath()

      for (let i = 0; i <= num; i++) {
        const x = Math.random() * width
        const y1 = getRandomInt((posy1 += 3), posy2)
        const y2 = getRandomInt(0, (posy3 -= 3))

        ctx.fillRect(x, y1, radius, radius)
        ctx.fillRect(x, y2, radius, radius)

        // Add tail effect
        const tail = 10
        ctx.fillRect(x + radius, y1, tail, radius / 5)
        ctx.fillRect(x + radius, y2, tail, radius / 5)
      }

      ctx.closePath()
    }

    // Snow effect
    const generateSnow = () => {
      const w = snowCanvas.width
      const h = snowCanvas.height

      if (w === 0 || h === 0) return

      const imageData = snowCtx.createImageData(w, h)
      const buffer = new Uint32Array(imageData.data.buffer)
      const len = buffer.length

      for (let i = 0; i < len; i++) {
        buffer[i] = ((255 * Math.random()) | 0) << 24
      }

      snowCtx.putImageData(imageData, 0, 0)
    }

    // Animate snow
    const animateSnow = () => {
      generateSnow()
      animationFrameRef.current = requestAnimationFrame(animateSnow)
    }

    // Wait a bit for dimensions to be set before starting animations
    const startAnimations = setTimeout(() => {
      // Start VCR noise at 30 fps
      intervalRef.current = setInterval(renderTrackingNoise, 1000 / 30)

      // Start snow animation
      animateSnow()
    }, 100)

    return () => {
      clearTimeout(startAnimations)
      window.removeEventListener('resize', updateSize)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <div className={styles.vhsWrapper}>
      <canvas ref={snowCanvasRef} className={styles.snow} />
      <canvas ref={canvasRef} className={styles.vcr} />
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
    </div>
  )
}
