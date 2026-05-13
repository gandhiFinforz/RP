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

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [paymentFlowStage, setPaymentFlowStage] = useState(0)
  const sectionRefs = useRef([])
  const tickingRef = useRef(false)
  const activeIndexRef = useRef(0)
  const paymentFlowStageRef = useRef(0)
  const lockUntilRef = useRef(0)
  const sectionElRef = useRef(null)

  // Keep refs in sync with state for the scroll handler
  useEffect(() => {
    activeIndexRef.current = activeIndex
    paymentFlowStageRef.current = paymentFlowStage
  }, [activeIndex, paymentFlowStage])

  // Initial hold: 2 seconds for first product, 0.5 seconds for others
  useEffect(() => {
    const FIRST_PRODUCT_PAUSE = 2000
    const OTHER_PRODUCT_PAUSE = 500
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
        window.requestAnimationFrame(update)
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

  // Scroll-snap with 0.5-second pause between products
  useEffect(() => {
    const PAUSE_MS = 500

    const isProductsInView = () => {
      const el = document.getElementById('products')
      if (!el) return false
      const rect = el.getBoundingClientRect()
      // Check if viewport center is within products section
      const viewportCenter = window.innerHeight / 2
      return rect.top <= viewportCenter && rect.bottom >= viewportCenter
    }

    const hasScrolledPast100vh = () => {
      const firstProduct = sectionRefs.current[0]
      if (!firstProduct) return false
      const rect = firstProduct.getBoundingClientRect()
      // Allow stage progression only after scrolling past 100vh (full viewport)
      return rect.top <= -window.innerHeight
    }

    const snapTo = (idx) => {
      const target = sectionRefs.current[idx]
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const pauseTime = idx === 0 ? 2000 : PAUSE_MS
      lockUntilRef.current = Date.now() + pauseTime
      setIsLocked(true)
      setTimeout(() => setIsLocked(false), pauseTime)
    }

    const handleWheel = (e) => {
      if (!isProductsInView()) return

      const now = Date.now()
      // During the pause — block all scroll attempts
      if (now < lockUntilRef.current) {
        e.preventDefault()
        return
      }

      const direction = e.deltaY > 0 ? 1 : -1
      const STAGE_LOCK_MS = 500 // 0.5 second lock for stage transitions

      // If on first product (collect), progress through payment flow stages
      if (activeIndexRef.current === 0) {
        // Only allow stage progression after scrolling past 100vh
        if (hasScrolledPast100vh()) {
          if (direction > 0) {
            // Scrolling down
            if (paymentFlowStageRef.current < 4) {
              e.preventDefault()
              setPaymentFlowStage(paymentFlowStageRef.current + 1)
              lockUntilRef.current = Date.now() + STAGE_LOCK_MS
              setIsLocked(true)
              setTimeout(() => setIsLocked(false), STAGE_LOCK_MS)
              return
            }
          } else {
            // Scrolling up
            if (paymentFlowStageRef.current > 0) {
              e.preventDefault()
              setPaymentFlowStage(paymentFlowStageRef.current - 1)
              lockUntilRef.current = Date.now() + STAGE_LOCK_MS
              setIsLocked(true)
              setTimeout(() => setIsLocked(false), STAGE_LOCK_MS)
              return
            }
          }
          // If at end of payment flow (stage 4) and scrolling down, allow to move to next product
          if (paymentFlowStageRef.current === 4 && direction > 0) {
            const next = activeIndexRef.current + direction
            if (next >= products.length) return
            e.preventDefault()
            snapTo(next)
            return
          }
        } else {
          // Before 100vh is scrolled, allow normal scroll (don't prevent)
          return
        }
      }

      // Normal product navigation
      const next = activeIndexRef.current + direction

      // At boundaries — allow native scroll to exit the section
      if (next < 0 || next >= products.length) return

      e.preventDefault()
      snapTo(next)
    }

    // Keyboard navigation
    const handleKey = (e) => {
      if (!isProductsInView()) return
      const now = Date.now()
      if (now < lockUntilRef.current) {
        e.preventDefault()
        return
      }
      let direction = 0
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) direction = 1
      else if (['ArrowUp', 'PageUp'].includes(e.key)) direction = -1
      else return

      const STAGE_LOCK_MS = 500 // 0.5 second lock for stage transitions

      // If on first product (collect), progress through payment flow stages
      if (activeIndexRef.current === 0) {
        // Only allow stage progression after scrolling past 100vh
        if (hasScrolledPast100vh()) {
          if (direction > 0) {
            // Moving down
            if (paymentFlowStageRef.current < 4) {
              e.preventDefault()
              setPaymentFlowStage(paymentFlowStageRef.current + 1)
              lockUntilRef.current = Date.now() + STAGE_LOCK_MS
              setIsLocked(true)
              setTimeout(() => setIsLocked(false), STAGE_LOCK_MS)
              return
            }
          } else {
            // Moving up
            if (paymentFlowStageRef.current > 0) {
              e.preventDefault()
              setPaymentFlowStage(paymentFlowStageRef.current - 1)
              lockUntilRef.current = Date.now() + STAGE_LOCK_MS
              setIsLocked(true)
              setTimeout(() => setIsLocked(false), STAGE_LOCK_MS)
              return
            }
          }
          // If at end of payment flow (stage 4) and moving down, allow to move to next product
          if (paymentFlowStageRef.current === 4 && direction > 0) {
            const next = activeIndexRef.current + direction
            if (next >= products.length) return
            e.preventDefault()
            snapTo(next)
            return
          }
        } else {
          // Before 100vh is scrolled, allow normal scroll (don't prevent)
          return
        }
      }

      // Normal product navigation
      const next = activeIndexRef.current + direction
      if (next < 0 || next >= products.length) return
      e.preventDefault()
      snapTo(next)
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
                          block: 'center',
                        })
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
                        paymentFlowStage={products[activeIndex].id === 'collect' ? paymentFlowStage : undefined}
                        setPaymentFlowStage={products[activeIndex].id === 'collect' ? setPaymentFlowStage : undefined}
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
          {products.map((p) => (
            <div
              key={`m-${p.id}`}
              className="aspect-square rounded-3xl bg-gradient-to-br from-brand-50 via-white to-ink-50 border border-ink-100 shadow-xl p-8 flex items-center justify-center"
            >
              <ProductVisual
                type={p.visual}
                paymentFlowStage={p.id === 'collect' ? paymentFlowStage : undefined}
                setPaymentFlowStage={p.id === 'collect' ? setPaymentFlowStage : undefined}
              />
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

function ProductVisual({ type, paymentFlowStage, setPaymentFlowStage }) {
  if (type === 'collect') {
    return <PaymentFlowVisual paymentFlowStage={paymentFlowStage} setPaymentFlowStage={setPaymentFlowStage} />
  }

  if (type === 'billing') {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold text-ink-900">Active subscriptions</p>
              <p className="text-xs text-ink-500">RM 18,240 MRR · 412 subscribers</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.div>
          </div>

          <div className="space-y-1">
            {[
              { plan: 'Growth · Monthly', who: 'Lumen Studio', amt: 'RM 149', next: 'Renews Aug 12', active: true },
              { plan: 'Pro · Yearly', who: 'Northwind Co.', amt: 'RM 1,990', next: 'Renews Dec 04', active: true },
              { plan: 'Starter · Monthly', who: 'Cafe Tujuh', amt: 'RM 49', next: 'Renews Aug 28', active: true },
              { plan: 'Enterprise', who: 'Skyline Group', amt: 'RM 4,200', next: 'Renews Sep 15', active: true },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between py-3 border-b border-ink-50 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {row.who.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{row.who}</p>
                    <p className="text-[10px] text-ink-500">{row.plan} · {row.next}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-ink-900 shrink-0 ml-2">{row.amt}</p>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-2.5 bg-brand-50 text-brand-700 rounded-xl text-xs font-semibold border border-brand-100">
            Manage plans →
          </button>
        </div>
      </div>
    )
  }

  if (type === 'pages') {
    return (
      <div className="w-full max-w-sm space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-ink-50 border-b border-ink-100">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="flex-1 mx-2 px-2 py-0.5 bg-white rounded-md text-[10px] font-mono text-ink-500 truncate">
              pay.ringgitpay.biz/lumen
            </div>
          </div>
          {/* Page body */}
          <div className="p-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-white font-bold text-lg mb-3">
              L
            </div>
            <p className="text-xs text-ink-500 mb-1">Lumen Studio invoice #INV-204</p>
            <p className="text-2xl font-bold text-ink-900 mb-4">RM 1,840.00</p>
            <div className="space-y-2 mb-4">
              <div className="h-9 rounded-lg border border-ink-100 bg-ink-50/50" />
              <div className="h-9 rounded-lg border border-ink-100 bg-ink-50/50" />
            </div>
            <button className="w-full py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold">
              Pay now
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-ink-100 p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-ink-500">Share via</p>
            <p className="text-sm font-mono text-ink-900 truncate">pay.ringgitpay.biz/lumen</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button className="text-[10px] font-semibold text-brand-700 px-2.5 py-1.5 bg-brand-50 rounded-md">Copy</button>
            <button className="text-[10px] font-semibold text-ink-700 px-2.5 py-1.5 bg-ink-100 rounded-md">QR</button>
          </div>
        </motion.div>
      </div>
    )
  }

  // recovery
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border border-ink-100 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-bold text-ink-900">Smart Recovery</p>
            <p className="text-xs text-ink-500">Last 30 days</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            +38% recovered
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand-50 to-white border border-brand-100">
            <p className="text-[10px] text-ink-500 uppercase tracking-wider">Recovered</p>
            <p className="text-lg font-bold text-ink-900">RM 4,820</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-ink-50 to-white border border-ink-100">
            <p className="text-[10px] text-ink-500 uppercase tracking-wider">In progress</p>
            <p className="text-lg font-bold text-ink-900">RM 1,240</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { who: 'Aisha R.', amt: 'RM 540', state: 'recovered', attempt: 'Retry 2 of 4' },
            { who: 'Daniel T.', amt: 'RM 220', state: 'retrying', attempt: 'Retry 3 of 4' },
            { who: 'Priya K.', amt: 'RM 1,180', state: 'recovered', attempt: 'Retry 1 of 4' },
            { who: 'Mark W.', amt: 'RM 89', state: 'scheduled', attempt: 'Next: in 2h' },
          ].map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-ink-50/60"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  row.state === 'recovered' ? 'bg-emerald-500' :
                  row.state === 'retrying' ? 'bg-amber-500' :
                  'bg-ink-300'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-900 truncate">{row.who}</p>
                  <p className="text-[10px] text-ink-500">{row.attempt}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <p className="text-xs font-bold text-ink-900">{row.amt}</p>
                {row.state === 'recovered' ? (
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : row.state === 'retrying' ? (
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </motion.svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
