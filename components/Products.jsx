'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const products = [
  {
    id: 'collect',
    eyebrow: 'Instant Collect',
    title: 'Instant Collect',
    description:
      'Send digital invoices via convenient messaging channels like Email or WhatsApp and collect payments instantly from your customers.',
    features: ['Payment Gateway', 'Digital Invoice', 'Payment Links'],
    visual: 'collect',
  },
  {
    id: 'billing',
    eyebrow: 'Recurring Billing',
    title: 'Recurring Billing',
    description:
      "Streamline your billing process by seamlessly debiting payments from your customers' bank account or credit card.",
    features: ['Auto Debit', 'e-Mandate', 'Subscription Plans'],
    visual: 'billing',
  },
  {
    id: 'pages',
    eyebrow: 'Payment Pages',
    title: 'Payment Pages',
    description:
      'Create purpose-built payment pages and payment forms for your business and easily deliver services to your customers.',
    features: ['Booking Page', 'Subscription Page', 'Checkout Page'],
    visual: 'pages',
  },
  {
    id: 'recovery',
    eyebrow: 'Smart Recovery',
    title: 'Smart Recovery',
    description:
      'Seamlessly handle payment failures and delays by implementing proactive measures such as sending persuasive reminders and employing alternative methods for collecting outstanding payments.',
    features: ['Payment Reminders', 'Recovery Workflow', 'Customer Analytics'],
    visual: 'recovery',
  },
]

const STAGE_COUNTS = [5, 5, 4, 3] // collect, billing, pages, recovery

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [stages, setStages] = useState([0, 0, 0, 0])
  const sectionRefs = useRef([])
  const tickingRef = useRef(false)
  const activeIndexRef = useRef(0)
  const stagesRef = useRef([0, 0, 0, 0])
  const lockUntilRef = useRef(0)

  // Keep refs in sync with state for the scroll handler
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    stagesRef.current = stages
  }, [stages])

  const setStageAt = (idx, newStage) => {
    setStages((prev) => {
      if (prev[idx] === newStage) return prev
      const next = [...prev]
      next[idx] = newStage
      return next
    })
    stagesRef.current = [...stagesRef.current]
    stagesRef.current[idx] = newStage
  }

  // Initial hold: 2 seconds for first product, 1 second for others
  useEffect(() => {
    const FIRST_PRODUCT_PAUSE = 2000
    const OTHER_PRODUCT_PAUSE = 1000
    const pauseTime = activeIndex === 0 ? FIRST_PRODUCT_PAUSE : OTHER_PRODUCT_PAUSE
    lockUntilRef.current = Date.now() + pauseTime
    setIsLocked(true)
    const timer = setTimeout(() => setIsLocked(false), pauseTime)
    return () => clearTimeout(timer)
  }, [activeIndex])

  useEffect(() => {
    const update = () => {
      const viewportCenter = window.innerHeight / 2
      let closestIdx = 0
      let closestDist = Infinity

      sectionRefs.current.forEach((ref, idx) => {
        if (!ref) return
        const rect = ref.getBoundingClientRect()
        const sectionCenter = rect.top + rect.height / 2
        const dist = Math.abs(sectionCenter - viewportCenter)
        if (dist < closestDist) {
          closestDist = dist
          closestIdx = idx
        }
      })

      setActiveIndex(closestIdx)
      tickingRef.current = false
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          // If we are locked or the wheel listener is active, don't let 
          // natural scroll update the active index as it causes jumping.
          if (Date.now() < lockUntilRef.current) {
            tickingRef.current = false
            return
          }
          update()
        })
        tickingRef.current = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Scroll-snap stage navigation across all products
  useEffect(() => {
    const PAUSE_MS = 1000
    const STAGE_LOCK_MS = 1000

    const isProductsInView = () => {
      const container = document.getElementById('products')
      if (!container) return false
      const rect = container.getBoundingClientRect()
      
      // If we are at the very top of the section (header), let it scroll normally
      if (rect.top > -50) return false
      
      // If we've scrolled past the entire section, let it scroll normally
      if (rect.bottom < window.innerHeight / 2) return false
      
      return true
    }

    const snapTo = (idx, { startAtEnd = false } = {}) => {
      const target = sectionRefs.current[idx]
      if (!target) return
      
      const pauseTime = 1400 // Slightly longer for product transitions
      lockUntilRef.current = Date.now() + pauseTime
      setIsLocked(true)
      
      setActiveIndex(idx)
      setStageAt(idx, startAtEnd ? STAGE_COUNTS[idx] - 1 : 0)
      
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      setTimeout(() => setIsLocked(false), pauseTime)
    }

    const advanceStage = (e, delta) => {
      e.preventDefault()
      const idx = activeIndexRef.current
      setStageAt(idx, stagesRef.current[idx] + delta)
      lockUntilRef.current = Date.now() + STAGE_LOCK_MS
      setIsLocked(true)
      setTimeout(() => setIsLocked(false), STAGE_LOCK_MS)
    }

    const handleDirection = (e, direction) => {
      if (!isProductsInView()) return
      const now = Date.now()
      
      // If we are currently transitioning/locked, always block the wheel
      if (now < lockUntilRef.current) {
        e.preventDefault()
        return
      }

      const idx = activeIndexRef.current
      const currentStage = stagesRef.current[idx]
      const maxStage = STAGE_COUNTS[idx] - 1

      if (direction > 0) {
        // SCROLL DOWN
        // If we are at the very start of the first product and haven't snapped yet, snap to it
        if (idx === 0 && currentStage === 0 && !isLocked) {
          const rect = sectionRefs.current[0].getBoundingClientRect()
          if (Math.abs(rect.top) > 10) { // If not perfectly aligned
            e.preventDefault()
            snapTo(0)
            return
          }
        }

        if (currentStage < maxStage) {
          advanceStage(e, 1)
          return
        }
        const next = idx + 1
        if (next >= products.length) {
          // Let it scroll out of the section
          return
        }
        e.preventDefault()
        snapTo(next, { startAtEnd: false })
        return
      }

      // SCROLL UP
      if (currentStage > 0) {
        advanceStage(e, -1)
        return
      }
      const next = idx - 1
      if (next < 0) {
        // Let it scroll back to header
        return
      }
      e.preventDefault()
      snapTo(next, { startAtEnd: true })
    }

    const handleWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1
      handleDirection(e, direction)
    }

    const handleKey = (e) => {
      let direction = 0
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) direction = 1
      else if (['ArrowUp', 'PageUp'].includes(e.key)) direction = -1
      else return
      handleDirection(e, direction)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <section id="products" className="relative bg-white py-24">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 mb-4 uppercase tracking-wider">
            Payment Platform
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 leading-tight mb-6">
            Acquiring payments needn't be tedious. <br />
            <span className="gradient-text">Do it smart with RinggitPay.</span>
          </h2>
          <p className="text-lg text-ink-600 leading-relaxed">
            Check out RinggitPay's wide range of payment services.
          </p>
        </motion.div>

        {/* Scrolly content */}
        <div className="relative lg:grid lg:grid-cols-2 lg:gap-16">
          {/* LEFT — text sections */}
          <div>
            {products.map((p, i) => (
              <div
                key={p.id}
                ref={(el) => (sectionRefs.current[i] = el)}
                className="min-h-screen flex flex-col justify-center py-16"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider tabular-nums">
                      0{i + 1} / 0{products.length}
                    </span>
                    <div className="h-px w-16 bg-brand-200" />
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
                      Payment Platform
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink-900 mb-6 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-lg text-ink-600 mb-8 leading-relaxed max-w-xl">
                    {p.description}
                  </p>

                  <ul className="space-y-3 mb-10">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-ink-700 font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-brand-700 font-semibold hover:gap-3 transition-all"
                  >
                    Explore product
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </motion.div>
              </div>
            ))}
          </div>

          {/* RIGHT — sticky visual (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen flex items-center">
              <div className="w-full">
                {/* Step pills */}
                <div className="flex items-center gap-2 mb-6">
                  {products.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        sectionRefs.current[i]?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                        setStageAt(i, 0)
                      }}
                      className="flex-1 group"
                    >
                      <div className="relative h-1 bg-ink-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{
                            width:
                              activeIndex === i
                                ? '100%'
                                : activeIndex > i
                                ? '100%'
                                : '0%',
                            opacity: activeIndex >= i ? 1 : 0.3,
                          }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 bg-brand-600 rounded-full"
                        />
                      </div>
                      <p
                        className={`mt-2.5 text-xs font-semibold text-left transition-colors ${
                          activeIndex === i ? 'text-ink-900' : 'text-ink-400'
                        }`}
                      >
                        {p.eyebrow}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Visual stage */}
                <div className="relative aspect-square w-full rounded-3xl bg-gradient-to-br from-brand-50 via-white to-ink-50 border border-ink-100 overflow-hidden shadow-2xl shadow-brand-900/10">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={products[activeIndex].visual}
                      initial={{ opacity: 0, scale: 0.97, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.99, y: -6 }}
                      transition={{
                        opacity: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                        y: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                      }}
                      className="absolute inset-0 flex items-center justify-center p-10"
                    >
                      <ProductVisual
                        type={products[activeIndex].visual}
                        stage={stages[activeIndex]}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute -bottom-20 -right-20 w-72 h-72 glow-blue rounded-full opacity-50 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile inline visuals */}
        <div className="lg:hidden space-y-12 mt-8">
          {products.map((p, i) => (
            <div
              key={`m-${p.id}`}
              className="aspect-square rounded-3xl bg-gradient-to-br from-brand-50 via-white to-ink-50 border border-ink-100 shadow-xl p-8 flex items-center justify-center"
            >
              <ProductVisual type={p.visual} stage={stages[i]} mobile />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PayIcon({ type }) {
  if (type === 'card') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" strokeLinecap="round" />
        <path d="M7 15h3" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'bank') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M3 10l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9M9 10v9M15 10v9M19 10v9" strokeLinecap="round" />
        <path d="M3 20h18" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'qr') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3M21 17v4M17 21h4" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'wallet') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinejoin="round" />
        <path d="M16 14h2" strokeLinecap="round" />
        <path d="M3 10h18" />
      </svg>
    )
  }
  return null
}

function BrandLogo({ className = 'w-12 h-12' }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1b77f6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="logo-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#a3e635" />
        </linearGradient>
      </defs>
      {/* Left checkmark/V ribbon */}
      <path
        d="M40 50 L70 50 L95 130 L80 150 L50 150 Z"
        fill="url(#logo-grad-1)"
      />
      <path
        d="M95 130 L120 50 L150 50 L115 150 L80 150 Z"
        fill="url(#logo-grad-2)"
      />
      {/* Right A ribbon */}
      <path
        d="M115 50 L145 50 L170 130 L155 150 L125 150 Z"
        fill="url(#logo-grad-2)"
      />
    </svg>
  )
}

function PaymentPagesFlowVisual({ stage: externalStage = 0, autoCycle = false }) {
  const [internalStage, setInternalStage] = useState(0)
  const stage = autoCycle ? internalStage : externalStage
  const [confetti, setConfetti] = useState([])
  const [copied, setCopied] = useState(false)
  const [revenueCount, setRevenueCount] = useState(0)
  const [tickerItems, setTickerItems] = useState([])

  useEffect(() => {
    if (!autoCycle) return
    const timer = setInterval(() => {
      setInternalStage((prev) => (prev < 3 ? prev + 1 : 0))
    }, 5500)
    return () => clearInterval(timer)
  }, [autoCycle])

  // Copy ripple effect on stage 2
  useEffect(() => {
    if (stage === 1) {
      const copyTimer = setTimeout(() => setCopied(true), 2500)
      const resetTimer = setTimeout(() => setCopied(false), 4000)
      return () => {
        clearTimeout(copyTimer)
        clearTimeout(resetTimer)
      }
    } else {
      setCopied(false)
    }
  }, [stage])

  // Counter & confetti for stage 4
  useEffect(() => {
    if (stage === 3) {
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
      }))
      setConfetti(newConfetti)

      // Animate revenue counter from 0 to 1840
      setRevenueCount(0)
      const target = 1840
      const duration = 1800
      const startTime = Date.now()
      const animateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setRevenueCount(Math.floor(target * eased))
        if (progress < 1) requestAnimationFrame(animateCount)
      }
      const rafId = requestAnimationFrame(animateCount)

      // Live transaction ticker
      const initialTickers = [
        { id: 1, name: 'Aisha R.', amt: 'RM 149' },
      ]
      setTickerItems(initialTickers)
      const names = ['Daniel T.', 'Priya K.', 'Mark W.', 'Sofia L.', 'James O.']
      const amounts = ['RM 49', 'RM 149', 'RM 240', 'RM 89', 'RM 320']
      let tickerCount = 1
      const tickerInterval = setInterval(() => {
        tickerCount++
        setTickerItems((prev) => [
          {
            id: Date.now(),
            name: names[Math.floor(Math.random() * names.length)],
            amt: amounts[Math.floor(Math.random() * amounts.length)],
          },
          ...prev.slice(0, 2),
        ])
      }, 1500)

      return () => {
        cancelAnimationFrame(rafId)
        clearInterval(tickerInterval)
      }
    }
  }, [stage])

  return (
    <div className="w-full max-w-sm overflow-hidden">
      <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-lg relative h-96">
        {/* Stage 1: Create Payment Page */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 0 ? 1 : 0, x: stage === 0 ? 0 : -400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Create Page</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-3">Build your branded payment page</p>

            {/* Canvas with floating glass cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 rounded-xl border border-white/60 p-3 mb-3 h-44 overflow-hidden"
            >
              {/* Animated gradient orbs background */}
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-24 h-24 rounded-full bg-cyan-300/30 blur-2xl"
              />
              <motion.div
                animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-emerald-300/30 blur-2xl"
              />

              {/* Brand Logo Card (Glass) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute top-3 left-3 w-16 h-16 rounded-xl bg-white/60 backdrop-blur-md border border-white shadow-lg flex items-center justify-center p-1.5"
                style={{ boxShadow: '0 8px 32px rgba(27, 119, 246, 0.15)' }}
              >
                <BrandLogo className="w-full h-full" />
              </motion.div>

              {/* Form Field Card (Glass) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.55, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute top-3 right-3 w-24 h-16 rounded-xl bg-white/60 backdrop-blur-md border border-white shadow-lg p-2"
                style={{ boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)' }}
              >
                <div className="h-1.5 w-12 bg-ink-300 rounded mb-1.5" />
                <div className="h-2.5 w-full bg-white rounded border border-ink-200" />
                <div className="h-1 w-8 bg-emerald-400 rounded mt-1.5" />
              </motion.div>

              {/* Amount Card (Glass) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute bottom-3 left-3 w-20 h-14 rounded-xl bg-white/60 backdrop-blur-md border border-white shadow-lg p-2 flex flex-col justify-center"
                style={{ boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15)' }}
              >
                <p className="text-[8px] text-ink-500 uppercase tracking-wider">Amount</p>
                <p className="text-sm font-bold text-ink-900">RM 149</p>
              </motion.div>

              {/* CTA Button Card (Glass) */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.85, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute bottom-3 right-3 w-24 h-14 rounded-xl shadow-lg flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1b77f6 0%, #06b6d4 50%, #10b981 100%)',
                  boxShadow: '0 8px 32px rgba(27, 119, 246, 0.3)',
                }}
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-y-0 w-1/3 bg-white/30 skew-x-12"
                />
                Pay Now
              </motion.div>
            </motion.div>

            {/* Theme Selection */}
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-ink-600">Theme</p>
              <div className="flex gap-1.5">
                {[
                  { name: 'Light', color: 'bg-white border border-ink-200' },
                  { name: 'Gradient', color: 'bg-gradient-to-br from-brand-500 to-emerald-500' },
                  { name: 'Dark', color: 'bg-ink-900' },
                ].map((theme, i) => (
                  <motion.button
                    key={theme.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.95 + i * 0.08, type: 'spring' }}
                    whileHover={{ scale: 1.15 }}
                    className={`w-6 h-6 rounded-full ${theme.color} ${i === 1 ? 'ring-2 ring-brand-600 ring-offset-2' : ''}`}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-cyan-600 text-white rounded-lg font-semibold text-sm shadow-md"
          >
            Publish Page
          </motion.button>
        </motion.div>

        {/* Stage 2: Share Payment Link */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 1 ? 1 : 0, x: stage === 1 ? 0 : stage > 1 ? -400 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Share Link</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-3">Your payment page is live</p>

            {/* Link with Beam Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative p-2.5 rounded-lg bg-gradient-to-r from-brand-50 via-cyan-50 to-emerald-50 border border-brand-200 mb-3 font-mono text-xs text-ink-700 h-10 flex items-center overflow-hidden"
            >
              {/* Beam animation */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none"
              />
              <span className="relative z-10 truncate">
                pay.ringgitpay.biz/lumen-studio
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-0.5 h-3 bg-brand-600 ml-0.5 align-middle"
                />
              </span>
            </motion.div>

            <div className="flex items-center gap-3">
              {/* Clean QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                className="w-24 h-24 rounded-lg bg-white p-2 border border-ink-200 shadow-md flex-shrink-0"
              >
                <svg className="w-full h-full" viewBox="0 0 25 25" shapeRendering="crispEdges">
                  {/* Position markers */}
                  <rect x="0" y="0" width="7" height="7" fill="#0a0a0a" />
                  <rect x="1" y="1" width="5" height="5" fill="white" />
                  <rect x="2" y="2" width="3" height="3" fill="#0a0a0a" />

                  <rect x="18" y="0" width="7" height="7" fill="#0a0a0a" />
                  <rect x="19" y="1" width="5" height="5" fill="white" />
                  <rect x="20" y="2" width="3" height="3" fill="#0a0a0a" />

                  <rect x="0" y="18" width="7" height="7" fill="#0a0a0a" />
                  <rect x="1" y="19" width="5" height="5" fill="white" />
                  <rect x="2" y="20" width="3" height="3" fill="#0a0a0a" />

                  {/* Data dots */}
                  {[
                    [9, 0], [10, 0], [12, 0], [14, 0], [15, 0],
                    [8, 1], [11, 1], [13, 1], [16, 1],
                    [9, 2], [10, 2], [12, 2], [15, 2],
                    [8, 3], [13, 3], [14, 3], [16, 3],
                    [9, 4], [11, 4], [12, 4], [15, 4],
                    [10, 5], [11, 5], [14, 5], [16, 5],
                    [8, 6], [10, 6], [13, 6], [15, 6],

                    [0, 9], [2, 9], [4, 9], [6, 9], [8, 9], [10, 9], [12, 9], [14, 9], [16, 9], [18, 9], [20, 9], [22, 9], [24, 9],
                    [1, 10], [3, 10], [7, 10], [9, 10], [11, 10], [13, 10], [17, 10], [19, 10], [23, 10],
                    [0, 11], [2, 11], [5, 11], [8, 11], [12, 11], [16, 11], [18, 11], [21, 11], [24, 11],
                    [1, 12], [3, 12], [6, 12], [10, 12], [13, 12], [15, 12], [17, 12], [20, 12], [22, 12],
                    [0, 13], [4, 13], [7, 13], [9, 13], [11, 13], [14, 13], [18, 13], [21, 13], [23, 13],
                    [2, 14], [5, 14], [8, 14], [10, 14], [13, 14], [16, 14], [19, 14], [22, 14], [24, 14],
                    [1, 15], [3, 15], [6, 15], [9, 15], [12, 15], [15, 15], [17, 15], [20, 15], [23, 15],
                    [0, 16], [4, 16], [7, 16], [11, 16], [14, 16], [18, 16], [21, 16],

                    [9, 18], [11, 18], [13, 18], [16, 18], [19, 18], [22, 18],
                    [10, 19], [14, 19], [17, 19], [20, 19], [23, 19],
                    [9, 20], [12, 20], [15, 20], [18, 20], [21, 20], [24, 20],
                    [11, 21], [13, 21], [16, 21], [19, 21], [22, 21],
                    [10, 22], [14, 22], [17, 22], [20, 22], [23, 22],
                    [9, 23], [12, 23], [15, 23], [18, 23], [21, 23],
                    [11, 24], [14, 24], [17, 24], [20, 24], [23, 24],
                  ].map(([x, y], i) => (
                    <motion.rect
                      key={i}
                      x={x}
                      y={y}
                      width="1"
                      height="1"
                      fill="#0a0a0a"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.003, duration: 0.2 }}
                    />
                  ))}
                </svg>
              </motion.div>

              {/* Share Icons Burst (Original brand colors) */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                {[
                  {
                    name: 'WhatsApp',
                    bg: 'bg-[#25D366]',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 13.925 9.935 9.935 0 001.371 3.855A9.934 9.934 0 0012.012 24c5.465 0 9.93-4.465 9.93-9.93 0-2.585-.994-5.02-2.79-6.841A9.936 9.936 0 0012.051 0" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Email',
                    bg: 'bg-[#EA4335]',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Twitter',
                    bg: 'bg-black',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'Telegram',
                    bg: 'bg-[#0088cc]',
                    icon: (
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    ),
                  },
                ].map((social, i) => (
                  <motion.button
                    key={social.name}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08, type: 'spring' }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className={`relative w-9 h-9 rounded-full ${social.bg} flex items-center justify-center shadow-md group`}
                    title={social.name}
                  >
                    {social.icon}
                    {/* Tooltip pop */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-ink-900 text-white text-[9px] font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {social.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Copy Button with Ripple */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-full py-2.5 bg-gradient-to-r from-brand-600 to-cyan-600 text-white rounded-lg font-semibold text-sm overflow-hidden shadow-md"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  Copy Link
                </motion.span>
              )}
            </AnimatePresence>

            {/* Ripple */}
            {copied && (
              <motion.span
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 pointer-events-none"
              />
            )}
          </motion.button>
        </motion.div>

        {/* Stage 3: Customer Payment Experience */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 2 ? 1 : 0, x: stage === 2 ? 0 : stage > 2 ? -400 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-5 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Checkout</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-ink-200" />
            </div>
          </div>

          {/* Product Summary with Secure Shield */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative p-2.5 rounded-lg bg-gradient-to-br from-brand-50 via-cyan-50 to-white border border-brand-100 mb-2 flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold text-ink-500 uppercase tracking-wider">Lumen Studio</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <p className="text-base font-bold text-ink-900 tabular-nums">
                    <AmountCounter target={149} active={stage === 2} />
                  </p>
                  <p className="text-[10px] text-ink-500">/ Growth · monthly</p>
                </div>
              </div>
              {/* Secure Shield with Pulse */}
              <motion.div className="relative flex-shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full border border-emerald-300"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Payment Methods - Slide Upward */}
          <p className="text-[9px] font-semibold text-ink-600 uppercase tracking-wider mb-1.5 flex-shrink-0">Payment Method</p>
          <div className="space-y-1 flex-1 min-h-0">
            {[
              { name: 'Credit / Debit Card', sub: '•••• 4242', icon: 'card', tint: 'bg-gradient-to-br from-brand-500 to-brand-700', selected: true },
              { name: 'FPX Online Banking', sub: 'Direct transfer', icon: 'bank', tint: 'bg-gradient-to-br from-emerald-500 to-emerald-700' },
              { name: 'DuitNow QR', sub: 'Scan and pay', icon: 'qr', tint: 'bg-gradient-to-br from-cyan-500 to-cyan-700' },
            ].map((method, i) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 4px 12px rgba(27, 119, 246, 0.12)',
                }}
                className={`px-2 py-1.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  method.selected
                    ? 'border-brand-600 bg-brand-50/50'
                    : 'border-ink-200 bg-white hover:border-brand-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md ${method.tint} flex items-center justify-center text-white shadow-sm`}>
                    <PayIcon type={method.icon} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-ink-900 leading-tight">{method.name}</p>
                    <p className="text-[9px] text-ink-500 leading-tight">{method.sub}</p>
                  </div>
                </div>
                {method.selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-full mt-2 py-2.5 bg-gradient-to-r from-brand-600 to-cyan-600 text-white rounded-lg font-semibold text-xs overflow-hidden shadow-md flex-shrink-0"
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-y-0 w-1/4 bg-white/30 skew-x-12 pointer-events-none"
            />
            <span className="relative z-10">Pay RM 149 Securely</span>
          </motion.button>
        </motion.div>

        {/* Stage 4: Success & Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 3 ? 1 : 0, x: stage === 3 ? 0 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col overflow-hidden"
        >
          {/* Confetti */}
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: (Math.random() - 0.5) * 240,
                y: -180,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.2, delay: item.delay, ease: 'easeOut' }}
              className="absolute w-1.5 h-1.5 rounded-sm"
              style={{
                left: `${item.left}%`,
                top: '35%',
                backgroundColor: ['#1b77f6', '#10b981', '#f43f5e', '#fbbf24', '#8b5cf6', '#06b6d4'][
                  Math.floor(Math.random() * 6)
                ],
              }}
            />
          ))}

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Success</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          <div className="flex flex-col items-center relative z-10 flex-1 justify-center">
            {/* Success Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 12 }}
              className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-2 relative"
            >
              <motion.svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>

              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute inset-0 rounded-full border-2 border-emerald-300"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-sm font-bold text-ink-900 mb-3"
            >
              Payment Received!
            </motion.p>

            {/* Revenue Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="w-full p-2.5 rounded-lg bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100 mb-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold text-ink-500 uppercase tracking-wider">Today's Revenue</p>
                  <p className="text-lg font-bold text-ink-900 tabular-nums">
                    RM {revenueCount.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[10px] font-bold">+24%</p>
                </div>
              </div>
            </motion.div>

            {/* Live Transaction Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="w-full"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
                <p className="text-[9px] font-bold text-ink-700 uppercase tracking-wider">Live Transactions</p>
              </div>
              <div className="space-y-1 overflow-hidden h-16">
                <AnimatePresence initial={false}>
                  {tickerItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between px-2 py-1 rounded-md bg-white border border-ink-100 text-[10px]"
                    >
                      <span className="font-semibold text-ink-700">{item.name}</span>
                      <span className="font-bold text-emerald-600">{item.amt}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function AmountCounter({ target, active }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) {
      setCount(0)
      return
    }
    const duration = 1200
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(target * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [target, active])

  return <span className="tabular-nums">RM {count}</span>
}

function RecurringBillingFlowVisual({ stage: externalStage = 0, autoCycle = false }) {
  const [internalStage, setInternalStage] = useState(0)
  const stage = autoCycle ? internalStage : externalStage
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    if (!autoCycle) return
    const timer = setInterval(() => {
      setInternalStage((prev) => (prev < 4 ? prev + 1 : 0))
    }, 4000)
    return () => clearInterval(timer)
  }, [autoCycle])

  useEffect(() => {
    if (stage === 4) {
      const newConfetti = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.2,
      }))
      setConfetti(newConfetti)
    }
  }, [stage])

  return (
    <div className="w-full max-w-sm overflow-hidden">
      <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-lg relative h-96">
        {/* Stage 1: Subscription Plan Setup */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 0 ? 1 : 0, x: stage === 0 ? 0 : -400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Select Plan</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-4">Choose your billing cycle</p>

            {/* Monthly / Yearly Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 mb-4 p-1 bg-ink-100 rounded-lg w-fit"
            >
              {['Monthly', 'Yearly'].map((label) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    label === 'Monthly'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-ink-600'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>

            {/* Pricing Cards - Stagger Animation */}
            <div className="space-y-2.5">
              {[
                { name: 'Starter', price: 'RM 49', desc: 'Per month' },
                { name: 'Growth', price: 'RM 149', desc: 'Per month' },
              ].map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    i === 1
                      ? 'border-brand-600 bg-brand-50 shadow-lg shadow-brand-100'
                      : 'border-ink-100 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink-900">{plan.name}</p>
                      <p className="text-xs text-ink-500">{plan.desc}</p>
                    </div>
                    <p className="text-lg font-bold text-ink-900">{plan.price}</p>
                  </div>
                  {i === 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                      className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Auto-renew enabled
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Continue Button with Pulse */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold text-sm"
          >
            Continue to Authorization
          </motion.button>
        </motion.div>

        {/* Stage 2: Customer Authorization */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 1 ? 1 : 0, x: stage === 1 ? 0 : stage > 1 ? -400 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Authorize Debit</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-6">Approve auto-debit mandate</p>

            {/* Mandate Card with Animated Border */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative p-4 rounded-xl border-2 border-brand-200 bg-brand-50 mb-4 overflow-hidden"
            >
              <motion.div
                initial={{ backgroundPosition: '0% 0%' }}
                animate={{ backgroundPosition: '100% 100%' }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(45deg, transparent 30%, #1b77f6 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0"
                  >
                    <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">AutoPay Mandate</p>
                    <p className="text-xs text-ink-600">Secure authorization</p>
                  </div>
                </div>

                <p className="text-xs text-ink-600 mb-4">Your bank account will be automatically debited every month on the renewal date.</p>

                {/* Consent Checkbox */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-5 h-5 rounded-lg border-2 border-brand-600 bg-brand-600 flex items-center justify-center flex-shrink-0 cursor-pointer mt-0.5"
                  >
                    <motion.svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                  <p className="text-xs text-ink-700 leading-relaxed">
                    I authorize {'{'}merchant{'}'} to debit my account for the subscription
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold text-sm"
          >
            Confirm Authorization
          </motion.button>
        </motion.div>

        {/* Stage 3: Payment Schedule Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 2 ? 1 : 0, x: stage === 2 ? 0 : stage > 2 ? -400 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Payment Schedule</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-4">Upcoming billing dates</p>

            {/* Timeline */}
            <div className="space-y-3">
              {[
                { date: 'Aug 12, 2024', amount: 'RM 149', status: 'next' },
                { date: 'Sep 12, 2024', amount: 'RM 149', status: 'scheduled' },
                { date: 'Oct 12, 2024', amount: 'RM 149', status: 'scheduled' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  {/* Timeline dot */}
                  <motion.div
                    animate={
                      item.status === 'next'
                        ? { scale: [1, 1.3, 1], boxShadow: ['0 0 0 0px rgba(27, 119, 246, 0.4)', '0 0 0 8px rgba(27, 119, 246, 0)'] }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      item.status === 'next' ? 'bg-brand-600' : 'bg-ink-300'
                    }`}
                  />

                  {/* Date and Amount */}
                  <div className="flex-1 p-3 rounded-lg bg-ink-50 border border-ink-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink-900">{item.date}</p>
                      <p className="text-sm font-bold text-brand-600">{item.amount}</p>
                    </div>
                    {item.status === 'next' && (
                      <p className="text-xs text-brand-600 mt-1 font-semibold">Next charge</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold text-sm"
          >
            Activate Subscription
          </motion.button>
        </motion.div>

        {/* Stage 4: Auto Processing Simulation */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 3 ? 1 : 0, x: stage === 3 ? 0 : stage > 3 ? -400 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Processing</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-8 text-center">Auto-processing your subscription charge</p>

            {/* Processing Flow Animation */}
            <div className="flex items-center gap-4 w-full mb-8">
              {/* Bank Icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-6 9 6" />
                </svg>
              </motion.div>

              {/* Animated Connection Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-brand-600 rounded-full origin-left"
              >
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="h-full w-1/4 bg-white rounded-full opacity-50"
                />
              </motion.div>

              {/* Processing Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </div>

            {/* Circular Progress Loader */}
            <motion.svg
              className="w-16 h-16 mb-6"
              viewBox="0 0 100 100"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="3"
                strokeDasharray="141.3"
                strokeDashoffset={0}
                initial={{ strokeDashoffset: 141.3 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1b77f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </motion.svg>

            <p className="text-xs text-ink-500 text-center">
              Processing monthly charge...
            </p>
          </div>
        </motion.div>

        {/* Stage 5: Subscription Active Success */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 4 ? 1 : 0, x: stage === 4 ? 0 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Confetti */}
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: (Math.random() - 0.5) * 200, y: -150, opacity: 0 }}
              transition={{ duration: 0.8, delay: item.delay, ease: 'easeOut' }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${item.left}%`,
                top: '40%',
                backgroundColor: ['#1b77f6', '#10b981', '#f43f5e', '#fbbf24', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}

          <div className="flex flex-col items-center relative z-10 text-center">
            <div className="flex items-center justify-between w-full mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Complete</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
              </div>
            </div>

            {/* Success Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 12 }}
              className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 relative"
            >
              <motion.svg
                className="w-12 h-12 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0, scale: 0.8 }}
                animate={{ pathLength: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </motion.svg>

              {/* Pulse Ring */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute inset-0 rounded-full border-2 border-emerald-300"
              />
            </motion.div>

            {/* Success Text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-lg font-bold text-ink-900 mb-1"
            >
              Subscription Active!
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-sm text-ink-600 mb-4"
            >
              RM 149 will be charged monthly
            </motion.p>

            {/* Subscription Badge with Shimmer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="relative inline-block"
            >
              <motion.div
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-700"
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Next charge: Aug 12
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function PaymentFlowVisual({ paymentFlowStage = 0, setPaymentFlowStage }) {
  const [confetti, setConfetti] = useState([])
  const stage = paymentFlowStage

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
    }))
    setConfetti(newConfetti)
  }

  useEffect(() => {
    if (stage === 4) {
      createConfetti()
    }
  }, [stage])

  return (
    <div className="w-full max-w-sm overflow-hidden">
      <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-lg relative h-96">
        {/* Stage 1: WhatsApp Message */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: stage === 0 ? 0 : -400, opacity: stage === 0 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col items-center justify-between"
        >
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">WhatsApp Message</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-2xl p-4 border border-green-200"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  RP
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink-900 mb-1">RinggitPay</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-ink-700 leading-relaxed"
                  >
                    You received an invoice payment request from Tropicana Mart
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg p-3 border border-green-200 mb-3"
              >
                <p className="text-xs text-ink-600 mb-2">RM 248.00 • Invoice #TM-2024-08956</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 13.925 9.935 9.935 0 001.371 3.855A9.934 9.934 0 0012.012 24c5.465 0 9.93-4.465 9.93-9.93 0-2.585-.994-5.02-2.79-6.841A9.936 9.936 0 0012.051 0" />
                  </svg>
                  Pay via Link
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stage 2: Payment Method Selection */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: stage === 1 ? 0 : stage > 1 ? -400 : 400, opacity: stage === 1 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Select Payment</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>
            <p className="text-3xl font-bold text-ink-900 mb-1">RM 248.00</p>
            <p className="text-sm text-ink-500 mb-6">Order #RP-29384</p>

            <div className="space-y-2.5">
              {[
                { name: 'Card', logo: null, icon: 'card', tint: 'bg-gradient-to-br from-brand-500 to-brand-700' },
                { name: 'FPX', logo: '/fpx.png', icon: null, tint: null },
                { name: 'DuitNow QR', logo: '/DUIT.png', icon: null, tint: null },
                { name: 'GrabPay', logo: '/GrabPay.png', icon: null, tint: null },
              ].map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`p-3 rounded-xl border ${
                    i === 0 ? 'border-brand-600 bg-brand-50' : 'border-ink-100'
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    {m.logo ? (
                      <img src={m.logo} alt={m.name} className="w-8 h-8 rounded-lg shadow-sm" />
                    ) : (
                      <div className={`w-8 h-8 rounded-lg ${m.tint} flex items-center justify-center text-white shadow-sm`}>
                        <PayIcon type={m.icon} />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-ink-900">{m.name}</span>
                  </div>
                  {i === 0 && <div className="w-4 h-4 rounded-full bg-brand-600" />}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stage 3: Card Details */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: stage === 2 ? 0 : stage > 2 ? -400 : 400, opacity: stage === 2 ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Card Details</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <div className="space-y-3">
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                type="text"
                placeholder="4242 4242 4242 4242"
                defaultValue="4242 4242 4242 4242"
                className="w-full px-4 py-2 border border-ink-200 rounded-lg text-sm bg-ink-50"
                readOnly
              />
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                type="text"
                placeholder="John Doe"
                defaultValue="John Doe"
                className="w-full px-4 py-2 border border-ink-200 rounded-lg text-sm bg-ink-50"
                readOnly
              />
              <div className="flex gap-3">
                <motion.input
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  type="text"
                  placeholder="12/25"
                  defaultValue="12/25"
                  className="flex-1 px-4 py-2 border border-ink-200 rounded-lg text-sm bg-ink-50"
                  readOnly
                />
                <motion.input
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  type="text"
                  placeholder="123"
                  defaultValue="123"
                  className="w-20 px-4 py-2 border border-ink-200 rounded-lg text-sm bg-ink-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-ink-500"
          >
            Processing payment...
          </motion.div>
        </motion.div>

        {/* Stage 4: OTP Verification */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: stage === 3 ? 0 : stage > 3 ? -400 : 400, opacity: stage === 3 ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Verify OTP</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-brand-600" />
                <div className="w-2 h-2 rounded-full bg-ink-200" />
              </div>
            </div>

            <p className="text-sm text-ink-600 mb-6">Enter the OTP sent to your bank</p>

            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="w-10 h-10 border-2 border-brand-600 rounded-lg flex items-center justify-center text-sm font-semibold text-brand-600 bg-brand-50"
                >
                  {i === 1 ? '1' : i === 2 ? '2' : i === 3 ? '3' : i === 4 ? '7' : i === 5 ? '8' : '9'}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-xs text-ink-500"
          >
            Verifying...
          </motion.div>
        </motion.div>

        {/* Stage 5: Success with Confetti */}
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: stage === 4 ? 0 : 400, opacity: stage === 4 ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 p-6 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Confetti burst */}
          {confetti.map((item) => (
            <motion.div
              key={item.id}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: (Math.random() - 0.5) * 200, y: -150, opacity: 0 }}
              transition={{ duration: 0.8, delay: item.delay, ease: 'easeOut' }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: '50%',
                top: '40%',
                backgroundColor: ['#1b77f6', '#10b981', '#f43f5e', '#fbbf24', '#8b5cf6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}

          <div className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 12 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 relative"
            >
              <motion.svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0, scale: 0.8 }}
                animate={{ pathLength: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>

              {/* Glow/burst effect */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute inset-0 rounded-full border-2 border-green-400"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-lg font-bold text-ink-900 text-center"
            >
              Payment Successful
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-sm text-ink-500 text-center mt-2"
            >
              Transaction ID: RP-29384
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-2xl font-bold text-ink-900 mt-4"
            >
              RM 248.00
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ProductVisual({ type, stage = 0, mobile = false }) {
  if (type === 'collect') {
    return <PaymentFlowVisual paymentFlowStage={stage} />
  }

  if (type === 'billing') {
    return <RecurringBillingFlowVisual stage={stage} autoCycle={mobile} />
  }

  if (type === 'pages') {
    return <PaymentPagesFlowVisual stage={stage} autoCycle={mobile} />
  }

  // recovery
  return <SmartRecoveryFlowVisual stage={stage} autoCycle={mobile} />
}

function SmartRecoveryFlowVisual({ stage: externalStage = 0, autoCycle = false }) {
  const [internalStage, setInternalStage] = useState(0)
  const stage = autoCycle ? internalStage : externalStage
  const [recoveredAmount, setRecoveredAmount] = useState(0)
  const [recoveryPercent, setRecoveryPercent] = useState(0)

  useEffect(() => {
    if (!autoCycle) return
    const timer = setInterval(() => {
      setInternalStage((prev) => (prev < 2 ? prev + 1 : 0))
    }, 5500)
    return () => clearInterval(timer)
  }, [autoCycle])

  // Counter animation for stage 3
  useEffect(() => {
    if (stage === 2) {
      setRecoveredAmount(0)
      setRecoveryPercent(0)
      const target = 8420
      const targetPct = 87
      const duration = 1800
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setRecoveredAmount(Math.floor(target * eased))
        setRecoveryPercent(Math.floor(targetPct * eased))
        if (progress < 1) requestAnimationFrame(animate)
      }
      const rafId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(rafId)
    }
  }, [stage])

  return (
    <div className="w-full max-w-sm overflow-hidden">
      <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-lg relative h-96">
        {/* Stage 1: Detect Failed Payment */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 0 ? 1 : 0, x: stage === 0 ? 0 : -400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-5 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">AI Detection</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <div className="w-2 h-2 rounded-full bg-ink-200" />
              <div className="w-2 h-2 rounded-full bg-ink-200" />
            </div>
          </div>

          {/* Floating Alert Particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, x: 0 }}
              animate={
                stage === 0
                  ? {
                      opacity: [0, 0.6, 0],
                      y: [50, -50],
                      x: [(i - 3) * 5, (i - 3) * 15],
                    }
                  : {}
              }
              transition={{
                duration: 2.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 pointer-events-none"
              style={{ left: `${20 + i * 12}%`, bottom: '30%' }}
            />
          ))}

          {/* Failed Transaction Card */}
          <motion.div
            animate={
              stage === 0
                ? { x: [0, -3, 3, -3, 3, 0] }
                : {}
            }
            transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 2 }}
            className="relative rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-4 mb-3 overflow-hidden flex-shrink-0"
          >
            {/* AI Scanner Sweep */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={stage === 0 ? { y: '300%' } : { y: '-100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.3 }}
              className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-rose-400/40 to-transparent pointer-events-none"
            />

            {/* Red Pulse Glow */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-xl bg-rose-500/10 pointer-events-none"
            />

            <div className="relative flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center text-xs font-bold">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-900">Aisha Rahman</p>
                  <p className="text-[10px] text-ink-500">Transaction #TXN-8421</p>
                </div>
              </div>

              {/* Warning Indicator */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-rose-400"
                />
              </motion.div>
            </div>

            <div className="relative flex items-center justify-between">
              <p className="text-base font-bold text-ink-900">RM 540.00</p>
              {/* Status Morph */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative h-5 w-20 overflow-hidden"
              >
                <motion.span
                  initial={{ y: 0 }}
                  animate={{ y: -20 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="absolute inset-x-0 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-center"
                >
                  Processing
                </motion.span>
                <motion.span
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="absolute inset-x-0 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full text-center"
                >
                  Failed
                </motion.span>
              </motion.div>
            </div>

            <div className="relative mt-2 text-[10px] text-ink-500 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Insufficient funds · Card declined
            </div>
          </motion.div>

          {/* Radar Scan with AI Detection */}
          <div className="relative flex-1 flex items-center justify-center mb-2">
            <div className="relative w-24 h-24">
              {/* Radar rings */}
              {[0, 0.5, 1, 1.5].map((delay, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={stage === 0 ? { scale: 2.5, opacity: 0 } : {}}
                  transition={{ duration: 2, delay, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-rose-400 pointer-events-none"
                />
              ))}

              {/* Radar sweep beam */}
              <motion.div
                animate={stage === 0 ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(244, 63, 94, 0.3) 60deg, transparent 90deg)',
                }}
              />

              {/* Center AI badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
                >
                  AI
                </motion.div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-ink-500 flex-shrink-0">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Scanning failure pattern · Preparing recovery
            </motion.span>
          </p>
        </motion.div>

        {/* Stage 2: Automated Recovery Workflow */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 1 ? 1 : 0, x: stage === 1 ? 0 : stage > 1 ? -400 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-5 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Recovery Workflow</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-brand-600" />
              <div className="w-2 h-2 rounded-full bg-ink-200" />
            </div>
          </div>

          <div className="flex-1 relative">
            {/* Connecting line SVG */}
            <svg className="absolute left-3 top-1 w-px h-full" style={{ overflow: 'visible' }}>
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="url(#wf-grad)"
                strokeWidth="2"
                strokeDasharray="3 3"
                initial={{ pathLength: 0 }}
                animate={stage === 1 ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, delay: 0.3 }}
              />
              <defs>
                <linearGradient id="wf-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#1b77f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {[
              {
                title: 'Payment Failed',
                detail: 'Detection at 14:32',
                nodeBg: 'bg-rose-100',
                nodeRing: 'border-rose-400',
                checkColor: 'text-rose-500',
                icon: (
                  <svg className="w-3 h-3 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ),
              },
              {
                title: 'WhatsApp Reminder',
                detail: 'Sent · Read receipt',
                nodeBg: 'bg-emerald-100',
                nodeRing: 'border-emerald-400',
                checkColor: 'text-emerald-500',
                icon: (
                  <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                ),
              },
              {
                title: 'Smart Retry Scheduled',
                detail: 'In 2 hours · Optimal time',
                nodeBg: 'bg-brand-100',
                nodeRing: 'border-brand-400',
                checkColor: 'text-brand-600',
                icon: (
                  <svg className="w-3 h-3 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
              },
              {
                title: 'Alternative Method',
                detail: 'FPX suggested · AI choice',
                nodeBg: 'bg-cyan-100',
                nodeRing: 'border-cyan-400',
                checkColor: 'text-cyan-500',
                icon: (
                  <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={stage === 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ delay: 0.5 + i * 0.4, duration: 0.5 }}
                className="relative flex items-center gap-3 mb-2.5"
              >
                {/* Workflow node with pulse */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={stage === 1 ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.5 + i * 0.4, type: 'spring' }}
                  className={`relative w-6 h-6 rounded-full ${step.nodeBg} border-2 border-white flex items-center justify-center flex-shrink-0 shadow-sm z-10`}
                >
                  {step.icon}
                  {/* Retry pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 + i * 0.4 }}
                    className={`absolute inset-0 rounded-full border ${step.nodeRing}`}
                  />
                </motion.div>

                {/* Step content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={stage === 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.6 + i * 0.4 }}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-ink-50/60 border border-ink-100 flex items-center justify-between min-w-0"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-ink-900 leading-tight truncate">{step.title}</p>
                    <p className="text-[9px] text-ink-500 leading-tight truncate">{step.detail}</p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={stage === 1 ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.8 + i * 0.4, type: 'spring' }}
                    className="flex-shrink-0"
                  >
                    <svg className={`w-3 h-3 ${step.checkColor}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* AI Decision Glow Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={stage === 1 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 2.4 }}
            className="flex items-center justify-center gap-1.5 flex-shrink-0 mt-1"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-brand-600"
            />
            <p className="text-[10px] font-semibold text-brand-700">AI orchestrating recovery</p>
          </motion.div>
        </motion.div>

        {/* Stage 3: Recovery Success & Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: stage === 2 ? 1 : 0, x: stage === 2 ? 0 : 400 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 p-5 flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Recovery Analytics</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Success Glow Background */}
          <motion.div
            animate={stage === 2 ? { opacity: [0, 0.4, 0.2] } : { opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.25) 0%, transparent 60%)',
            }}
          />

          <div className="grid grid-cols-2 gap-2 mb-2.5 flex-shrink-0">
            {/* Revenue Restored Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={stage === 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.2 }}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-y-0 w-1/3 bg-white/40 skew-x-12 pointer-events-none"
              />
              <p className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">Recovered</p>
              <p className="text-base font-bold text-ink-900 tabular-nums">
                RM {recoveredAmount.toLocaleString()}
              </p>
              <p className="text-[9px] text-ink-500">+24 transactions</p>
            </motion.div>

            {/* Animated Donut Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={stage === 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3 }}
              className="p-2 rounded-xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 flex items-center gap-2"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="url(#donut-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(recoveryPercent / 100) * 88} 88`}
                  />
                  <defs>
                    <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1b77f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[10px] font-bold text-ink-900 tabular-nums">{recoveryPercent}%</p>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-brand-700 uppercase tracking-wider">Success Rate</p>
                <p className="text-[10px] text-ink-500">vs 62% avg</p>
              </div>
            </motion.div>
          </div>

          {/* Mini Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={stage === 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
            className="p-2.5 rounded-xl bg-white border border-ink-100 mb-2 flex-shrink-0"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold text-ink-900">Recovery Trend</p>
              <div className="flex items-center gap-1 text-emerald-600">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-[9px] font-bold">+38%</p>
              </div>
            </div>
            <svg className="w-full h-10" viewBox="0 0 200 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 0 32 L 20 28 L 40 30 L 60 22 L 80 24 L 100 18 L 120 14 L 140 16 L 160 10 L 180 8 L 200 4 L 200 40 L 0 40 Z"
                fill="url(#chart-fill)"
                initial={{ opacity: 0 }}
                animate={stage === 2 ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
              <motion.path
                d="M 0 32 L 20 28 L 40 30 L 60 22 L 80 24 L 100 18 L 120 14 L 140 16 L 160 10 L 180 8 L 200 4"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={stage === 2 ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
              />
              {/* Data pulse points */}
              {[20, 60, 100, 140, 180].map((x, i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={[28, 22, 18, 16, 8][i]}
                  r="1.5"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={stage === 2 ? { scale: [0, 1.5, 1] } : { scale: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                />
              ))}
            </svg>
          </motion.div>

          {/* AI Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={stage === 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 1.8 }}
            className="relative p-2 rounded-lg bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200 flex items-center gap-2 flex-shrink-0 overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-y-0 w-1/4 bg-white/50 skew-x-12 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
            >
              AI
            </motion.div>
            <div className="relative min-w-0">
              <p className="text-[10px] font-bold text-ink-900 leading-tight truncate">AI Recommendation</p>
              <p className="text-[9px] text-ink-600 leading-tight truncate">Retry at 6PM for 92% success</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
