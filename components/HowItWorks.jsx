'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Sign up in minutes',
    desc: 'Create your account with just an email. No card required.',
  },
  {
    n: '02',
    title: 'Verify your business',
    desc: 'Upload basic documents. Most merchants are approved within 24 hours.',
  },
  {
    n: '03',
    title: 'Integrate or share',
    desc: 'Drop in a snippet, use our SDKs, or share a payment link — your call.',
  },
  {
    n: '04',
    title: 'Go live',
    desc: 'Start accepting payments worldwide. Watch funds settle daily.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-8xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <p className="text-sm font-semibold text-brand-600 mb-4 uppercase tracking-wider">
              Get started
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink-900 leading-tight mb-6">
              Live in days, <br />
              not months.
            </h2>
            <p className="text-lg text-ink-600 leading-relaxed mb-8">
              Our onboarding is built to remove friction. Most merchants go from signup
              to first transaction in under 72 hours.
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-7 py-4 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 transition"
            >
              Create free account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>

          <div className="lg:col-span-7 space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 lg:p-8 bg-ink-50 hover:bg-brand-50 rounded-2xl border border-transparent hover:border-brand-200 transition flex items-start gap-6 cursor-pointer"
              >
                <div className="text-3xl lg:text-4xl font-bold text-brand-600 shrink-0 tabular-nums">
                  {step.n}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-ink-900 mb-2 group-hover:text-brand-700 transition">
                    {step.title}
                  </h3>
                  <p className="text-ink-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <svg className="w-6 h-6 text-ink-300 group-hover:text-brand-600 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
