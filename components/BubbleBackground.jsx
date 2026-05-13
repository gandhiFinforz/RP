'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

function pseudoRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export default function BubbleBackground({ count = 16, className = '' }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r1 = pseudoRandom(i + 1)
        const r2 = pseudoRandom(i + 47)
        const r3 = pseudoRandom(i + 113)
        const r4 = pseudoRandom(i + 241)
        const r5 = pseudoRandom(i + 389)
        const r6 = pseudoRandom(i + 503)
        const palette = ['#5a9efb', '#1b77f6', '#1361d4', '#8bbeff', '#bcd9ff']
        return {
          id: i,
          size: 28 + r1 * 140,
          left: r2 * 100,
          duration: 14 + r3 * 18,
          delay: r4 * 10,
          opacity: 0.18 + r5 * 0.32,
          drift: -60 + r6 * 120,
          color: palette[i % palette.length],
        }
      }),
    [count]
  )

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <motion.span
          key={b.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: -b.size - 20,
            background: `radial-gradient(circle at 32% 30%, ${b.color}cc 0%, ${b.color}55 45%, transparent 72%)`,
            filter: 'blur(1px)',
            opacity: b.opacity,
          }}
          animate={{
            y: ['0vh', '-130vh'],
            x: [0, b.drift, b.drift * -0.6, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Soft highlight on each bubble — pure CSS shine */}
      <style jsx>{`
        span::before {
          content: '';
          position: absolute;
          top: 12%;
          left: 18%;
          width: 24%;
          height: 24%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
        }
      `}</style>
    </div>
  )
}
