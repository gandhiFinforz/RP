'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function Counter({ end, suffix = '', prefix = '', duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {prefix}{Math.round(count).toLocaleString()}{suffix}
    </span>
  )
}

const stats = [
  { value: 10000, suffix: '+', label: 'Active merchants', sub: 'Across SEA' },
  { value: 2.4, suffix: 'B', prefix: 'RM ', label: 'Processed annually', sub: 'And growing' },
  { value: 150, suffix: '+', label: 'Payment methods', sub: 'Cards, wallets, banks' },
  { value: 99.99, suffix: '%', label: 'Platform uptime', sub: 'Last 12 months' },
]

export default function Stats() {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-br from-ink-900 via-brand-950 to-ink-900 text-white">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] glow-blue rounded-full pointer-events-none opacity-50" />

      <div className="relative max-w-8xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-semibold text-brand-300 mb-4 uppercase tracking-wider">
            By the numbers
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Trusted infrastructure <br />
            for ambitious teams.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-2">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-8 lg:p-10 text-center"
            >
              <div className="text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
                <Counter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-base font-semibold text-white mb-1">{stat.label}</p>
              <p className="text-sm text-brand-200">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
