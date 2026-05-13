'use client'

import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="py-20 px-6 lg:px-10">
      <div className="max-w-8xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-900 via-brand-950 to-brand-900 px-8 py-16 md:px-16 md:py-20 lg:p-24"
        >
          {/* Decorative layers */}
          <div className="absolute inset-0 dot-pattern opacity-15" />
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] glow-blue rounded-full opacity-60" />
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] glow-blue rounded-full opacity-40" />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 text-white">
              <p className="text-sm font-semibold text-brand-300 mb-4 uppercase tracking-wider">
                Ready when you are
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Start accepting payments<br />
                in <span className="gradient-text">under 48 hours.</span>
              </h2>
              <p className="text-lg text-brand-100 leading-relaxed max-w-xl mb-10">
                Join 10,000+ businesses moving faster with RinggitPay. No setup fees,
                no monthly minimums, no surprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-7 py-4 bg-white text-ink-900 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-brand-50 transition"
                >
                  Create free account
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-7 py-4 border border-white/30 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition backdrop-blur-sm"
                >
                  Talk to sales
                </motion.a>
              </div>
            </div>

            {/* Right side benefits */}
            <div className="lg:col-span-5 space-y-3">
              {[
                { t: 'No setup costs', d: 'Get started for free, pay only when you transact' },
                { t: 'Daily settlements', d: 'Funds in your bank account every business day' },
                { t: 'Dedicated support', d: '24/7 access to a real human, not a bot' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{item.t}</p>
                    <p className="text-brand-200 text-sm">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
