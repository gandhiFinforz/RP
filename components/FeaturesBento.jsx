'use client'

import { motion } from 'framer-motion'

export default function FeaturesBento() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <p className="text-sm font-semibold text-brand-600 mb-4 uppercase tracking-wider">
            Platform
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 leading-tight">
            One platform.<br />
            <span className="gradient-text">Endless possibilities.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {/* Large card - Security */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:row-span-2 relative p-10 bg-gradient-to-br from-ink-900 via-brand-950 to-ink-800 rounded-3xl text-white overflow-hidden group min-h-[400px]"
          >
            <div className="absolute inset-0 dot-pattern opacity-10" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 glow-blue rounded-full opacity-60" />

            <div className="relative h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Bank-grade security, by default.
              </h3>
              <p className="text-brand-100 text-lg leading-relaxed max-w-md mb-8">
                PCI DSS Level 1 certified. End-to-end encryption. Tokenization, 3DS2, and
                real-time fraud detection — built into every transaction.
              </p>

              <div className="mt-auto grid grid-cols-3 gap-3 max-w-md">
                {['PCI DSS', '3DS 2.0', 'ISO 27001'].map((badge) => (
                  <div key={badge} className="px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-center text-xs font-semibold">
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Speed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-brand-50 rounded-3xl border border-brand-100 relative overflow-hidden card-lift"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-ink-900 mb-2">Sub-200ms response</h3>
            <p className="text-ink-600 text-sm leading-relaxed">
              Multi-region infrastructure delivers the fastest payment authorization in SEA.
            </p>
          </motion.div>

          {/* Local rails */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="p-8 bg-white rounded-3xl border border-ink-100 card-lift"
          >
            <div className="w-12 h-12 rounded-xl bg-ink-900 text-white flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
                <circle cx="5" cy="5" r="2" strokeWidth={1.8} />
                <circle cx="19" cy="5" r="2" strokeWidth={1.8} />
                <circle cx="5" cy="19" r="2" strokeWidth={1.8} />
                <circle cx="19" cy="19" r="2" strokeWidth={1.8} />
                <path strokeLinecap="round" strokeWidth={1.8} d="M6.5 6.5l3 3M17.5 6.5l-3 3M6.5 17.5l3-3M17.5 17.5l-3-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-ink-900 mb-2">All Malaysian rails</h3>
            <p className="text-ink-600 text-sm leading-relaxed">
              FPX, DuitNow QR, cards, GrabPay, TNG and Boost — one integration covers every checkout.
            </p>
          </motion.div>

          {/* Developer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-8 bg-ink-900 text-white rounded-3xl overflow-hidden relative card-lift"
          >
            <div className="grid md:grid-cols-2 gap-6 items-center h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Built for developers</h3>
                <p className="text-ink-300 text-sm leading-relaxed">
                  REST APIs and e-Commerce plugins.
                </p>
              </div>
              <div className="bg-ink-800 rounded-xl p-4 font-mono text-xs overflow-hidden">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-ink-400">$ curl ringgitpay.biz/v1/charge</div>
                <div className="text-emerald-400 mt-1">{`{ "status": "succeeded" }`}</div>
                <div className="text-ink-400 mt-2">$ npm install ringgitpay</div>
                <div className="text-brand-300 mt-1">✓ installed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
