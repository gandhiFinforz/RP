'use client'

import { motion } from 'framer-motion'

const columns = {
  Products: ['Online Payments', 'POS Terminals', 'Payment Links', 'Subscriptions', 'Payouts', 'Invoicing'],
  Solutions: ['E-commerce', 'Retail & F&B', 'SaaS', 'Marketplace', 'Enterprise', 'Education'],
  Developers: ['Documentation', 'API Reference', 'SDKs', 'Webhooks', 'Status', 'Changelog'],
  Company: ['About', 'Careers', 'Press', 'Partners', 'Contact', 'Legal'],
}

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] glow-blue rounded-full opacity-30 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-6 lg:px-10">
        {/* Top — Brand + Newsletter */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <div className="mb-6">
              <img
                src="/ringgitpay-logo.svg"
                alt="RinggitPay"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-ink-300 leading-relaxed max-w-md mb-8">
              Unified payments infrastructure for the next generation of businesses in
              Malaysia and across Southeast Asia.
            </p>

            <div className="max-w-md">
              <p className="text-sm font-semibold text-white mb-3">Stay in the loop</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-ink-400 focus:outline-none focus:border-brand-500 transition"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-3 bg-brand-600 hover:bg-brand-500 rounded-full text-sm font-semibold transition"
                >
                  Subscribe
                </motion.button>
              </div>
              <p className="text-xs text-ink-500 mt-3">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-ink-300 hover:text-white transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-6 text-sm text-ink-400">
            <span>© 2025 RinggitPay Sdn Bhd</span>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
            <a href="#" className="hover:text-white transition">Security</a>
          </div>

          <div className="flex items-center gap-3">
            <SocialIcon path="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
            <SocialIcon path="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            <SocialIcon path="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.14 6.84 9.46.5.08.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.57.67.48C19.14 20.16 22 16.43 22 12.04c0-5.5-4.46-9.96-9.96-9.96z" />
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ path }) {
  return (
    <a
      href="#"
      className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-600 border border-white/10 flex items-center justify-center transition"
    >
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  )
}
