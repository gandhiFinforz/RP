'use client'

import { motion } from 'framer-motion'
import BubbleBackground from './BubbleBackground'

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 spotlight pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <BubbleBackground count={18} />

      <div className="relative max-w-8xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 rounded-full bg-brand-50 border border-brand-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 pulse-ring"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              <span className="text-xs font-semibold text-brand-700 tracking-wide">
                NOW LIVE IN MALAYSIA & SOUTHEAST ASIA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="display-text text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem] font-bold text-ink-900 mb-6"
            >
              Unified <span className="shimmer-text">payments</span><br />
              for modern <br className="hidden md:block" />businesses.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-lg md:text-xl text-ink-600 mb-10 max-w-2xl leading-relaxed"
            >
              Accept payments online, in-store, and on the go. One platform that scales
              with your business — from your first sale to your billionth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-7 py-4 bg-ink-900 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-brand-700 transition shadow-lg shadow-ink-900/10"
              >
                Start accepting payments
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-4 bg-white text-ink-900 border border-ink-200 rounded-full font-semibold flex items-center justify-center gap-2 hover:border-ink-900 transition"
              >
                Talk to sales
              </motion.a>
            </motion.div>

            {/* Pay online logos */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-10"
            >
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Pay online</p>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { src: '/fpx.png',        alt: 'FPX' },
                  { src: '/mydebit.png',     alt: 'MyDebit' },
                  { src: '/DUIT.png',        alt: 'DuitNow' },
                  { src: '/visa.svg',        alt: 'Visa' },
                  { src: '/mastercard.svg',  alt: 'Mastercard' },
                  { src: '/tng.svg',         alt: 'Touch n Go' },
                  { src: '/GrabPay.png',     alt: 'GrabPay' },
                  { src: '/boost.png',       alt: 'Boost' },
                ].map(({ src, alt }) => (
                  <div
                    key={alt}
                    className="h-8 px-2.5 bg-white border border-ink-100 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <img src={src} alt={alt} className="h-5 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex items-center gap-8 text-sm text-ink-500"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                PCI DSS Level 1
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bank Negara approved
              </div>
              <div className="hidden md:flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                99.99% uptime
              </div>
            </motion.div>
          </div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function HeroVisual() {
  const sources = [
    { label: 'Card',    color: '#1b77f6', logo: '/mastercard.svg' },
    { label: 'FPX',     color: '#10b981', logo: '/fpx.png'       },
    { label: 'DuitNow', color: '#f43f5e', logo: '/DUIT.png'      },
    { label: 'GrabPay', color: '#22c55e', logo: '/GrabPay.png'   },
  ]

  // Coordinate system — viewBox 400 × 400
  // Source x = 70, hub x = 200, bank x = 340
  // 4 sources vertically spread across y = 60, 140, 220, 300; hub y = 180; bank y = 180
  const sourceX = 70
  const hubX = 200
  const hubY = 180
  const bankX = 340
  const sourceYs = [60, 140, 220, 300]

  return (
    <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-white rounded-3xl border border-ink-100 shadow-2xl shadow-brand-900/10 overflow-hidden flex flex-col"
      >
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

        {/* Header */}
        <div className="relative p-5 border-b border-ink-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-ink-700">Payments flowing live</p>
          </div>
          <p className="text-[10px] font-mono text-ink-400">v2.4.1</p>
        </div>

        {/* Flow area */}
        <div className="relative flex-1">
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="hubLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1b77f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#1b77f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1b77f6" stopOpacity="0.1" />
              </linearGradient>
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1b77f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1b77f6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Hub ambient glow */}
            <motion.circle
              cx={hubX}
              cy={hubY}
              r="70"
              fill="url(#hubGlow)"
              animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.4, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: `${hubX}px ${hubY}px` }}
            />

            {/* Source → hub paths */}
            {sourceYs.map((y, i) => {
              const d = `M ${sourceX} ${y} C ${sourceX + 70} ${y}, ${hubX - 50} ${hubY}, ${hubX} ${hubY}`
              return (
                <g key={sources[i].label}>
                  {/* Base track */}
                  <path d={d} fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />
                  {/* Flowing energy along the track */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={sources[i].color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="20 240"
                    initial={{ strokeDashoffset: 260 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, ease: 'linear' }}
                  />
                  {/* Big traveling dot — using animateMotion for rock-solid cross-browser */}
                  <circle r="5" fill={sources[i].color}>
                    <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.5}s`} path={d} />
                  </circle>
                </g>
              )
            })}

            {/* Hub → bank path */}
            <g>
              <path
                d={`M ${hubX + 35} ${hubY} L ${bankX - 30} ${hubY}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <motion.path
                d={`M ${hubX + 35} ${hubY} L ${bankX - 30} ${hubY}`}
                fill="none"
                stroke="#1361d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="30 80"
                initial={{ strokeDashoffset: 110 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              {[0, 1, 2].map((i) => (
                <circle key={i} r="6" fill="#1361d4">
                  <animateMotion
                    dur="1.8s"
                    repeatCount="indefinite"
                    begin={`${i * 0.6}s`}
                    path={`M ${hubX + 35} ${hubY} L ${bankX - 30} ${hubY}`}
                  />
                </circle>
              ))}
            </g>

            {/* Hub solid circle - drawn in SVG so flows go behind/around correctly */}
            <circle cx={hubX} cy={hubY} r="32" fill="white" stroke="#dbeafe" strokeWidth="3" />
          </svg>

          {/* Source nodes (HTML overlay) */}
          {sourceYs.map((y, i) => (
            <div
              key={sources[i].label}
              className="absolute flex items-center gap-2 -translate-y-1/2"
              style={{
                left: `calc(${(sourceX / 400) * 100}% - 22px)`,
                top: `${(y / 400) * 100}%`,
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ boxShadow: [`0 0 0 0 ${sources[i].color}55`, `0 0 0 8px ${sources[i].color}00`] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ background: sources[i].logo ? 'white' : `linear-gradient(135deg, ${sources[i].color}, ${sources[i].color}cc)` }}
                >
                  <img src={sources[i].logo} alt={sources[i].label} className="w-8 h-8 object-contain" />
                </motion.div>
                <span className="text-[11px] font-semibold text-ink-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md whitespace-nowrap">
                  {sources[i].label}
                </span>
              </motion.div>
            </div>
          ))}

          {/* Center hub logo */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(hubX / 400) * 100}%`,
              top: `${(hubY / 400) * 100}%`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2.5 rounded-full border border-dashed border-brand-300"
              />
              <div className="relative">
                <RinggitPayLogoMark />
              </div>
            </motion.div>
          </div>

          {/* Bank destination */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(bankX / 400) * 100}%`,
              top: `${(hubY / 400) * 100}%`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="bg-ink-900 text-white rounded-2xl p-3 w-[88px] shadow-xl"
            >
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center mb-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M3 10l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 10v9M19 10v9M3 20h18" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[10px] opacity-70 leading-tight">Settles to</p>
              <p className="text-xs font-bold leading-tight">Your bank</p>
            </motion.div>
          </div>
        </div>

        {/* Footer stat bar */}
        <div className="relative p-4 border-t border-ink-100 grid grid-cols-3 gap-3 shrink-0">
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wider">Today</p>
            <p className="text-sm font-bold text-ink-900">RM 248K</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wider">Transactions</p>
            <p className="text-sm font-bold text-ink-900">1,284</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-500 uppercase tracking-wider">Settled</p>
            <p className="text-sm font-bold text-emerald-600">T+1</p>
          </div>
        </div>
      </motion.div>

      {/* Floating notification — top right */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute -top-3 -right-4 bg-white rounded-2xl shadow-xl border border-ink-100 p-3 flex items-center gap-2.5"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-ink-500 leading-tight">Just received</p>
          <p className="text-sm font-bold text-ink-900 leading-tight">RM 1,240.00</p>
        </div>
      </motion.div>

      {/* Floating notification — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.6 }}
        className="absolute -bottom-3 -left-4 bg-ink-900 text-white rounded-2xl shadow-xl p-3"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full"
          />
          <p className="text-[10px] text-ink-300">Processing</p>
        </div>
        <p className="text-xs font-bold mt-0.5">RM 89.50 via DuitNow</p>
      </motion.div>
    </div>
  )
}

function RinggitPayLogoMark() {
  return (
    <div className="relative w-20 h-20 rounded-full bg-white shadow-xl shadow-brand-600/30 flex items-center justify-center overflow-hidden border-2 border-brand-100">
      <img
        src="/ringgitpay-mark.svg"
        alt="RinggitPay"
        className="w-16 h-16"
      />
    </div>
  )
}
