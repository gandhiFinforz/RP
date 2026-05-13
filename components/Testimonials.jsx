'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const testimonials = [
  {
    quote: 'RinggitPay let us launch in 3 markets in under a month. The team treats our integration like their own product.',
    name: 'Aisha Rahman',
    role: 'Head of Payments',
    company: 'NorthStar Retail',
    initial: 'A',
    stat: { value: '38%', label: 'lift in checkout conversion' }
  },
  {
    quote: 'We moved from a legacy gateway and our settlement times dropped from T+3 to T+1. That changes our entire working capital story.',
    name: 'Daniel Tan',
    role: 'CFO',
    company: 'Lumen SaaS',
    initial: 'D',
    stat: { value: 'T+1', label: 'instant settlements' }
  },
  {
    quote: 'The terminals are fast, reliable, and the merchant dashboard is genuinely the best in the market.',
    name: 'Priya Krishnan',
    role: 'Operations Director',
    company: 'Mango Cafés',
    initial: 'P',
    stat: { value: '120+', label: 'stores live in 6 weeks' }
  },
  {
    quote: 'Their API documentation and webhook reliability are world-class. We integrated end-to-end in less than two days.',
    name: 'Mark Wong',
    role: 'CTO',
    company: 'Skyline Marketplace',
    initial: 'M',
    stat: { value: '48h', label: 'from signup to live' }
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000)
    return () => clearInterval(id)
  }, [])

  const t = testimonials[index]

  return (
    <section className="section-pad bg-ink-50/50 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 glow-blue rounded-full opacity-30 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 mb-4 uppercase tracking-wider">
            Customer stories
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 leading-tight">
            Loved by teams<br />
            building the future.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Main quote */}
          <div className="lg:col-span-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-10 lg:p-14 rounded-3xl border border-ink-100 shadow-sm h-full flex flex-col justify-between min-h-[400px]"
              >
                <div>
                  <svg className="w-12 h-12 text-brand-200 mb-6" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>
                  <p className="text-2xl md:text-3xl text-ink-900 font-medium leading-snug mb-10">
                    {t.quote}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-white font-bold text-xl">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">{t.name}</p>
                    <p className="text-sm text-ink-500">{t.role}, {t.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2 mt-6 justify-center lg:justify-start">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-10 bg-brand-600' : 'w-1.5 bg-ink-200 hover:bg-ink-300'
                  }`}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Side stat panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="p-8 lg:p-10 bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-3xl flex flex-col justify-between min-h-[260px]"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-200 mb-2">
                  Results with RinggitPay
                </p>
                <div>
                  <p className="text-6xl font-bold mb-3 tracking-tight">{t.stat.value}</p>
                  <p className="text-brand-100 text-sm">{t.stat.label}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <a
              href="#"
              className="p-6 bg-white rounded-3xl border border-ink-100 hover:border-brand-300 transition card-lift flex items-center justify-between group"
            >
              <div>
                <p className="text-sm text-ink-500 mb-1">Read all stories</p>
                <p className="font-bold text-ink-900">Customer success →</p>
              </div>
              <svg className="w-8 h-8 text-ink-400 group-hover:text-brand-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
