'use client'

import { motion } from 'framer-motion'

const partners = [
  'Maybank', 'CIMB', 'Public Bank', 'RHB', 'Hong Leong',
  'AmBank', 'Touch n Go', 'GrabPay', 'Boost', 'ShopeePay',
  'DuitNow', 'FPX', 'Visa', 'Mastercard',
]

export default function TrustBar() {
  return (
    <section className="py-16 border-y border-ink-100 bg-ink-50/40 overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 lg:px-10 mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold text-ink-500 uppercase tracking-wider"
        >
          Powering payments for 10,000+ businesses across Southeast Asia
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex marquee">
          {[...partners, ...partners].map((name, i) => (
            <div
              key={i}
              className="shrink-0 px-12 flex items-center justify-center"
            >
              <span className="text-2xl font-bold text-ink-300 hover:text-ink-700 transition whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
