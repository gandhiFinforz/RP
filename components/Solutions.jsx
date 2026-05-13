'use client'

import { motion } from 'framer-motion'

const industries = [
  {
    title: 'E-commerce',
    description: 'Increase checkout conversion with the payment methods your customers love.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    tag: 'Online'
  },
  {
    title: 'Retail & F&B',
    description: 'Accept every payment method at the counter, table, or curb. Sync to one dashboard.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    tag: 'In-store'
  },
  {
    title: 'SaaS & Subscriptions',
    description: 'Recurring billing, dunning management, and global card acceptance — all built in.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    tag: 'Recurring'
  },
  {
    title: 'Marketplace',
    description: 'Split payments, multi-party payouts, and escrow flows — out of the box.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    tag: 'Multi-party'
  },
  {
    title: 'Enterprise',
    description: 'Custom contracts, dedicated support, and treasury management at scale.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    tag: 'At scale'
  },
  {
    title: 'Education',
    description: 'Tuition collection, installment plans, and fee management for institutions.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth={1.8} />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeWidth={1.8} />
      </svg>
    ),
    tag: 'Vertical'
  },
]

export default function Solutions() {
  return (
    <section id="solutions" className="section-pad bg-ink-50/50 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 mb-4 uppercase tracking-wider">
            Solutions
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 leading-tight mb-6">
            Built for every <br />
            kind of business.
          </h2>
          <p className="text-lg text-ink-600 leading-relaxed">
            From a single-location café to nationwide retail chains — RinggitPay scales
            with you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((item, i) => (
            <motion.a
              href="#"
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative p-8 bg-white rounded-3xl border border-ink-100 card-lift overflow-hidden"
            >
              <div className="absolute top-6 right-6 text-[10px] font-semibold text-ink-400 uppercase tracking-wider">
                {item.tag}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-ink-900 mb-3">
                {item.title}
              </h3>
              <p className="text-ink-600 leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="flex items-center gap-2 text-sm font-semibold text-brand-700 opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
