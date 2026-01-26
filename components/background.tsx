'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './style/TimeBasedGradient.module.css'

interface GradientConfig {
  name: string
  gradients: string[][]
}

interface GradientConfigs {
  earlyMorning: GradientConfig
  morning: GradientConfig
  afternoon: GradientConfig
  evening: GradientConfig
  night: GradientConfig
}

interface PerlinNoise {
  gradients: Record<string, { x: number; y: number }>
  memory: Record<string, number>
  rand_vect(): { x: number; y: number }
  dot_prod_grid(x: number, y: number, vx: number, vy: number): number
  smootherstep(x: number): number
  interp(x: number, a: number, b: number): number
  seed(): void
  get(x: number, y: number): number
}

interface GranimOptions {
  states: {
    'default-state': {
      gradients: string[][]
    }
  }
}

export default function TimeBasedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)
  const granimRef = useRef<any>(null)
  const [currentPeriod, setCurrentPeriod] = useState<string>('')
  const [noiseSpeed, setNoiseSpeed] = useState<number>(20)
  const [isMounted, setIsMounted] = useState(false)

  // Time-based gradient configurations
  const gradientConfigs: GradientConfigs = {
    earlyMorning: {
      name: 'Early Morning',
      gradients: [
        ['#FFE5B4', '#FFB997'],
        ['#FFDAB9', '#FFA07A'],
        ['#FFE4E1', '#FFC0CB'],
      ],
    },
    morning: {
      name: 'Morning',
      gradients: [
        ['#87CEEB', '#4A90E2'],
        ['#B0E0E6', '#5F9EA0'],
        ['#ADD8E6', '#4682B4'],
      ],
    },
    afternoon: {
      name: 'Afternoon',
      gradients: [
        ['#FFD700', '#dd6300'],
        ['#FFEB3B', '#be044b'],
        ['#FFF59D', '#b114a4'],
      ],
    },
    evening: {
      name: 'Evening',
      gradients: [
        ['#FF6B6B', '#C44569'],
        ['#F7971E', '#FFD200'],
        ['#FC466B', '#3F5EFB'],
      ],
    },
    night: {
      name: 'Night',
      gradients: [
        ['#1e3c72', '#2a5298'],
        ['#2C3E50', '#4CA1AF'],
        ['#0f2027', '#203a43'],
      ],
    },
  }

  const getTimeBasedGradient = (): GradientConfig => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 8) return gradientConfigs.earlyMorning
    if (hour >= 8 && hour < 12) return gradientConfigs.morning
    if (hour >= 12 && hour < 17) return gradientConfigs.afternoon
    if (hour >= 17 && hour < 20) return gradientConfigs.evening
    return gradientConfigs.night
  }

  // Mount effect
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Separate effect for noise speed updates
  useEffect(() => {
    if (!isMounted) return
    
    const noise = noiseRef.current
    if (!noise || !noise.style.backgroundImage) return

    noise.style.animation = `grained 0.4s steps(${noiseSpeed}, end) infinite`
  }, [noiseSpeed, isMounted])

  // Main initialization effect
  useEffect(() => {
    if (!isMounted) return

    const config = getTimeBasedGradient()
    setCurrentPeriod(config.name)

    // Perlin noise implementation
    const perlin: PerlinNoise = {
      gradients: {},
      memory: {},
      rand_vect: function () {
        const theta = Math.random() * 2 * Math.PI
        return { x: Math.cos(theta), y: Math.sin(theta) }
      },
      dot_prod_grid: function (x: number, y: number, vx: number, vy: number) {
        let g_vect: { x: number; y: number }
        const d_vect = { x: x - vx, y: y - vy }
        const key = `${vx},${vy}`

        if (this.gradients[key]) {
          g_vect = this.gradients[key]
        } else {
          g_vect = this.rand_vect()
          this.gradients[key] = g_vect
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y
      },
      smootherstep: function (x: number) {
        return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3
      },
      interp: function (x: number, a: number, b: number) {
        return a + this.smootherstep(x) * (b - a)
      },
      seed: function () {
        this.gradients = {}
        this.memory = {}
      },
      get: function (x: number, y: number) {
        const key = `${x},${y}`
        if (this.memory.hasOwnProperty(key)) return this.memory[key]

        const xf = Math.floor(x)
        const yf = Math.floor(y)
        const tl = this.dot_prod_grid(x, y, xf, yf)
        const tr = this.dot_prod_grid(x, y, xf + 1, yf)
        const bl = this.dot_prod_grid(x, y, xf, yf + 1)
        const br = this.dot_prod_grid(x, y, xf + 1, yf + 1)
        const xt = this.interp(x - xf, tl, tr)
        const xb = this.interp(x - xf, bl, br)
        const v = this.interp(y - yf, xt, xb)
        this.memory[key] = v
        return v
      },
    }
    perlin.seed()

    // Grain noise effect - based on Grained.js
    const createGrainNoise = () => {
      const noise = noiseRef.current
      if (!noise) return

      const options = {
        patternWidth: 100,
        patternHeight: 100,
        grainOpacity: 0.1,
        grainDensity: 1,
        grainWidth: 1,
        grainHeight: 1,
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = options.patternWidth
      canvas.height = options.patternHeight

      for (let w = 0; w < options.patternWidth; w += options.grainDensity) {
        for (let h = 0; h < options.patternHeight; h += options.grainDensity) {
          const rgb = (Math.random() * 256) | 0
          ctx.fillStyle = `rgba(${rgb}, ${rgb}, ${rgb}, ${options.grainOpacity})`
          ctx.fillRect(w, h, options.grainWidth, options.grainHeight)
        }
      }

      noise.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`
      noise.style.animation = `grained 0.5s steps(${noiseSpeed}, end) infinite`
    }

    createGrainNoise()

    // Granim-like gradient animation
    class SimpleGranim {
      canvas: HTMLCanvasElement
      ctx: CanvasRenderingContext2D
      gradients: string[][]
      currentIndex: number
      progress: number
      speed: number
      animationId: number | null

      constructor(element: HTMLCanvasElement, options: GranimOptions) {
        this.canvas = element
        const ctx = this.canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')
        this.ctx = ctx
        this.gradients = options.states['default-state'].gradients
        this.currentIndex = 0
        this.progress = 0
        this.speed = 0.003
        this.animationId = null
        this.animate()
      }

      animate = () => {
        this.progress += this.speed

        if (this.progress >= 1) {
          this.progress = 0
          this.currentIndex = (this.currentIndex + 1) % this.gradients.length
        }

        const current = this.gradients[this.currentIndex]
        const next = this.gradients[(this.currentIndex + 1) % this.gradients.length]

        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height)

        const interpolateColor = (color1: string, color2: string, factor: number): string => {
          const c1 = parseInt(color1.slice(1), 16)
          const c2 = parseInt(color2.slice(1), 16)

          const r1 = (c1 >> 16) & 255
          const g1 = (c1 >> 8) & 255
          const b1 = c1 & 255

          const r2 = (c2 >> 16) & 255
          const g2 = (c2 >> 8) & 255
          const b2 = c2 & 255

          const r = Math.round(r1 + (r2 - r1) * factor)
          const g = Math.round(g1 + (g2 - g1) * factor)
          const b = Math.round(b1 + (b2 - b1) * factor)

          return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
        }

        const color1 = interpolateColor(current[0], next[0], this.progress)
        const color2 = interpolateColor(current[1], next[1], this.progress)

        gradient.addColorStop(0, color1)
        gradient.addColorStop(1, color2)

        this.ctx.fillStyle = gradient
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.animationId = requestAnimationFrame(this.animate)
      }

      destroy() {
        if (this.animationId) {
          cancelAnimationFrame(this.animationId)
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    }

    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      granimRef.current = new SimpleGranim(canvas, {
        states: {
          'default-state': {
            gradients: config.gradients,
          },
        },
      })
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
      createGrainNoise()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (granimRef.current) {
        granimRef.current.destroy()
      }
    }
  }, [isMounted])

  // Show nothing during SSR
  if (!isMounted) {
    return null
  }

  return (
    <div className={styles.corebg}>
      <div className={styles.main}>
        <div className={styles.background}>
          <div ref={noiseRef} className={styles.noise} />
          <div className={styles.overlay} />
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
      </div>

      <style jsx>{`
        @keyframes grained {
          0% {
            transform: translate(-10%, 10%);
          }
          10% {
            transform: translate(-25%, 0%);
          }
          20% {
            transform: translate(-30%, 10%);
          }
          30% {
            transform: translate(-30%, 30%);
          }
          40% {
            transform: translate(-20%, 20%);
          }
          50% {
            transform: translate(-15%, 10%);
          }
          60% {
            transform: translate(-20%, 20%);
          }
          70% {
            transform: translate(-5%, 20%);
          }
          80% {
            transform: translate(-25%, 5%);
          }
          90% {
            transform: translate(-30%, 25%);
          }
          100% {
            transform: translate(-10%, 10%);
          }
        }
      `}</style>
    </div>
  )
}