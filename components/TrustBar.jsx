'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

const BG = '#03060d'

// CSS for the component-specific background effects
const trustBarStyles = `
  @keyframes aurora-drift {
    0% { transform: scale(1) translate(0, 0); }
    50% { transform: scale(1.1) translate(2%, 2%); }
    100% { transform: scale(1) translate(-1%, 1%); }
  }
  @keyframes sparkle-pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }
`

const CARD_SHADOW = `
  0 0 0 1px rgba(255,255,255,0.05),
  0 4px 16px rgba(0,0,0,0.30),
  0 0  48px rgba(27,119,246,0.07)
`

const col1 = [
  { name: 'Maybank',     logo: '/maybank.png',    cat: 'Bank' },
  { name: 'CIMB',        logo: '/cimb.svg',        cat: 'Bank' },
  { name: 'Public Bank', logo: '/publicbank.svg',  cat: 'Bank' },
  { name: 'RHB',         logo: '/rhb.svg',          cat: 'Bank' },
  { name: 'Hong Leong',  logo: '/hongleong.svg',   cat: 'Bank' },
]

const col2 = [
  { name: 'GrabPay',    logo: '/GrabPay.png',    cat: 'E-Wallet' },
  { name: 'Touch n Go', logo: '/tng.svg',         cat: 'E-Wallet' },
  { name: 'Boost',      logo: '/boost.png',       cat: 'E-Wallet' },
  { name: 'ShopeePay',  logo: '/shopeepay.svg',   cat: 'E-Wallet' },
  { name: 'AmBank',     logo: '/ambank.svg',      cat: 'Bank' },
]

const col3 = [
  { name: 'DuitNow',    logo: '/DUIT.png',        cat: 'Transfer' },
  { name: 'FPX',        logo: '/fpx.png',          cat: 'Transfer' },
  { name: 'Visa',       logo: '/visa.svg',         cat: 'Network' },
  { name: 'Mastercard', logo: '/mastercard.svg',  cat: 'Network' },
]

const colVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function TrustBar() {
  return (
    <section className="py-12 px-6 lg:px-16" style={{ perspective: '1400px' }}>
      <style>{trustBarStyles}</style>
      <motion.div
        initial={{ opacity: 0, y: 64, scale: 0.95, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: BG, boxShadow: CARD_SHADOW, transformStyle: 'preserve-3d' }}
        className="relative rounded-[2.5rem] overflow-hidden py-10"
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full opacity-20 blur-[100px]"
            style={{ 
              background: 'radial-gradient(circle, #1b77f6 0%, transparent 70%)',
              animation: 'aurora-drift 15s infinite alternate ease-in-out' 
            }}
          />
          <div 
            className="absolute -bottom-1/2 -right-1/4 w-full h-full rounded-full opacity-20 blur-[100px]"
            style={{ 
              background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
              animation: 'aurora-drift 20s infinite alternate-reverse ease-in-out' 
            }}
          />
        </div>

        {/* Sparkle Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: `
              radial-gradient(1px 1px at 10% 20%, white 100%, transparent),
              radial-gradient(1px 1px at 30% 50%, white 100%, transparent),
              radial-gradient(1.5px 1.5px at 70% 30%, white 100%, transparent),
              radial-gradient(1px 1px at 90% 80%, white 100%, transparent)
            `,
            backgroundSize: '250px 250px',
            animation: 'sparkle-pulse 6s infinite alternate'
          }}
        />
        {/* Gloss reflection */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none z-20 rounded-t-[2.5rem]"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 100%)' }}
        />
        {/* Top rim light */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-20"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)' }}
        />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-5 px-8 mb-8"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10 max-w-xs hidden sm:block" />
          <p className="text-[11px] font-bold text-white uppercase tracking-[0.18em] text-center">
            Powering payments for 10,000+ businesses across Southeast Asia
          </p>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10 max-w-xs hidden sm:block" />
        </motion.div>

        {/* Column scroll wall */}
        <div className="relative h-60">
          <div
            className="absolute inset-x-0 top-0 h-14 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${BG}, transparent)` }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-14 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${BG}, transparent)` }}
          />

          <div className="flex gap-3 px-6 lg:px-10 h-full">
            <ScrollCol custom={0} items={col1} direction="down" speed={0.5} />
            <ScrollCol custom={1} items={col2} direction="up"   speed={0.4} />
            <ScrollCol custom={2} items={col3} direction="down" speed={0.7} extraClass="hidden lg:flex" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ScrollCol({ items, direction, speed, custom, extraClass = '' }) { // NOSONAR javascript:S6774
  const ref = useRef(null)
  const raf = useRef(null)
  const paused = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // "up" columns start at halfway so the loop feels continuous from the start
    if (direction === 'up') el.scrollTop = el.scrollHeight / 2

    const tick = () => {
      if (!paused.current && el) {
        const half = el.scrollHeight / 2
        if (direction === 'down') {
          el.scrollTop += speed
          if (el.scrollTop >= half) el.scrollTop -= half
        } else {
          el.scrollTop -= speed
          if (el.scrollTop <= 0) el.scrollTop += half
        }
      }
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [direction, speed])

  const pause  = () => { paused.current = true }
  const resume = () => { paused.current = false }
  const resumeLater = () => { setTimeout(resume, 1500) }

  return (
    <motion.div
      custom={custom}
      variants={colVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`flex-1 min-w-0 ${extraClass}`}
    >
      <section
        ref={ref}
        aria-label="Partner list"
        className="h-full w-full overflow-y-auto hide-scrollbar"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resumeLater}
      >
        <div className="flex flex-col gap-3 pb-3">
          {[...items, ...items].map((p, i) => (
            <PartnerCard key={`${p.name}-${i}`} {...p} />
          ))}
        </div>
      </section>
    </motion.div>
  )
}

function PartnerCard({ name, logo, cat }) { // NOSONAR javascript:S6774
  return (
    <div className="shrink-0 flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/20 transition-all duration-300 cursor-default group">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden p-1.5">
        <img src={logo} alt={name} className="w-full h-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white/60 group-hover:text-white/90 transition-colors duration-200 truncate">
          {name}
        </p>
        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">{cat}</p>
      </div>
      <div className="w-1.5 h-1.5 rounded-full shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300 bg-white/40" />
    </div>
  )
}
